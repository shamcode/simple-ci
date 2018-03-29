package main

import (
	"net/http"
	"log"
	"github.com/nytimes/gziphandler"
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
