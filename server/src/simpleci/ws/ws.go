package ws

import "net/http"

type server struct {
}

func (s *server) ServeHTTP(responseWriter http.ResponseWriter, request *http.Request) {
	s.newWebSocketHandler(responseWriter, request).ServeHTTP(responseWriter, request)
}

func (s *server) newWebSocketHandler(w http.ResponseWriter, r *http.Request) http.Handler {
	return &webSocketHandler{}
}

func NewServer() http.HandlerFunc {
	server := &server{}
	return server.ServeHTTP
}
