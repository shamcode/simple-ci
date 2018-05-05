package main

import (
	"github.com/nytimes/gziphandler"
	"log"
	"net/http"
)

func bytesResponseHandler(callbackForBytesResponse func() ([]byte, error), contentType string) http.Handler {
	bytes, err := callbackForBytesResponse()
	if err != nil {
		log.Fatal(err)
	}
	handler := http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", contentType)
		writer.Write(bytes)
	})
	return gziphandler.GzipHandler(handler)
}

func wrapHandler(handler func(http.ResponseWriter, *http.Request, *Db), db *Db) http.Handler {
	handlerFunc := http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		handler(writer, request, db)
	})
	return gziphandler.GzipHandler(handlerFunc)
}
