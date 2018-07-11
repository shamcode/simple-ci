package ws

import (
	"github.com/gorilla/websocket"
	"time"
	"sync"
	"net/http"
	"github.com/matoous/go-nanoid"
)

type Connection struct {
	conn              *websocket.Conn
	id                string
	heartbeatInterval time.Duration
	writeMutex        sync.Mutex
}

func (c *Connection) ID() string {
	return c.id
}

func (c *Connection) ReadMessage() (string, error) {
	_, msg, err := c.conn.ReadMessage()
	return string(msg), err
}

func (c *Connection) write(messageType int, data []byte) error {
	c.writeMutex.Lock()
	defer c.writeMutex.Unlock()
	return c.conn.WriteMessage(messageType, data)
}

func (c *Connection) Write(msg []byte) error {
	return c.write(websocket.TextMessage, msg)
}

func (c *Connection) ping(msg []byte) error {
	return c.write(websocket.PingMessage, msg)
}

func (c *Connection) Close() {
	c.conn.Close()
}

func (c *Connection) keepAlive() {
	lastResponse := time.Now()
	c.conn.SetPongHandler(func(msg string) error {
		lastResponse = time.Now()
		return nil
	})

	go func() {
		for {
			err := c.ping([]byte("keepalive"))
			if err != nil {
				break
			}
			time.Sleep(c.heartbeatInterval / 2)
			if time.Now().Sub(lastResponse) > c.heartbeatInterval {
				c.Close()
				break
			}
		}
	}()
}

func NewSession(conn *websocket.Conn, r *http.Request, heartbeatInterval time.Duration) (*Connection, error) {
	var c *Connection
	id, err := gonanoid.Nanoid()
	if nil == err {
		c = &Connection{
			conn:              conn,
			id:                id,
			heartbeatInterval: heartbeatInterval,
		}
		c.keepAlive()
	}
	return c, err
}
