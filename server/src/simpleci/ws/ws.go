package ws

import (
	"net/http"
	DB "simpleci/db"
)

type server struct {
	db *DB.Db
}

func (s *server) ServeHTTP(responseWriter http.ResponseWriter, request *http.Request) {
	NewHandler(s.db).ServeHTTP(responseWriter, request)
}

func NewServer(db *DB.Db) http.HandlerFunc {
	server := &server{
		db: db,
	}
	return server.ServeHTTP
}
