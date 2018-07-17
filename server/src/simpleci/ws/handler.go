package ws

import (
	"encoding/json"
	"errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/websocket"
	"github.com/julienschmidt/httprouter"
	log "github.com/sirupsen/logrus"
	"net/http"
	"simpleci/auth"
	DB "simpleci/db"
	"time"
)

type WebSocketHandler struct {
	upgrader websocket.Upgrader
}

func (handler *WebSocketHandler) handle(conn *Connection) {
	for {
		if msg, err := conn.ReadMessage(); err == nil {
			handler.processMessage(msg, conn)
			continue
		}
		Store.removeConnection(conn)
		break
	}
}

func (handler *WebSocketHandler) processMessage(msg string, conn *Connection) {
	var req ChainWatchRequest
	json.Unmarshal([]byte(msg), &req)
	Store.addChainWatcher(req.ChainID, conn)
}

func (handler *WebSocketHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c, err := handler.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.WithError(err).Info("fail upgrade")
		return
	}
	conn, err := NewSession(c, r, 60*time.Second)
	if err != nil {
		log.WithError(err).Error("fail create session")
		return
	}
	defer c.Close()
	handler.handle(conn)
}

func NewHandler(db *DB.Db) *WebSocketHandler {
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			ps := httprouter.ParamsFromContext(r.Context())
			jwtToken := ps.ByName("token")
			if 0 == len(jwtToken) {
				return false
			}

			claims, err := jwt.ParseWithClaims(jwtToken, &auth.JWTData{}, func(token *jwt.Token) (interface{}, error) {
				if jwt.SigningMethodHS256 != token.Method {
					return nil, errors.New("Invalid signing algorithm")
				}
				return []byte(auth.SECRET), nil
			})

			if err != nil {
				log.WithError(err).Warn("Fail parse jwt")
				return false
			}

			data := claims.Claims.(*auth.JWTData)

			userID := data.CustomClaims["id"]

			admin, err := db.GetAdmin()
			if err != nil {
				log.WithError(err).Error("Request failed!")
				return false
			}
			if userID != string(admin.Id) {
				log.Warn("Invalid claims data")
				return false
			}
			return true
		},
		EnableCompression: true,
		ReadBufferSize:    4096,
		WriteBufferSize:   4096,
		HandshakeTimeout:  10 * time.Second,
	}
	return &WebSocketHandler{
		upgrader: upgrader,
	}
}
