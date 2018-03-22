package main

import (
	"net/http"
	"log"
	"github.com/nytimes/gziphandler"
)

func BytesResponseHandler(callbackForBytesResponse func() ([]byte, error)) http.Handler {
	bytes, err := callbackForBytesResponse()
	if err != nil {
		log.Fatal(err)
	}
	handler := http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Write(bytes)
	})
	return gziphandler.GzipHandler(handler)
}
