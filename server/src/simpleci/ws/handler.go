package ws

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	log "github.com/sirupsen/logrus"
	"net/http"
	"time"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	HandshakeTimeout: 10 * time.Second,
}

type webSocketHandler struct {
}

func (handler *webSocketHandler) handle(conn *Connection) {
	for {
		if msg, err := conn.ReadMessage(); err == nil {
			handler.processMessage(msg, conn)
			continue
		}
		Store.removeConnection(conn)
		break
	}
}

func (handler *webSocketHandler) processMessage(msg string, conn *Connection) {
	var req ChainWatchRequest
	json.Unmarshal([]byte(msg), &req)
	Store.addChainWatcher(req.ChainID, conn)
}

func (handler *webSocketHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
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
