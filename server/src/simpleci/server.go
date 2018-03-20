package main

import (
	"net/http"
	"log"
	"github.com/nytimes/gziphandler"
	"fmt"
)

func bytesResponseHandler(callbackForBytesResponse func() ([]byte, error)) http.Handler {
	bytes, err := callbackForBytesResponse()
	if err != nil {
		log.Fatal(err)
	}
	handler := http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Write(bytes)
	})
	return gziphandler.GzipHandler(handler)
}

func main() {
	fmt.Print("Server start on port :3000\n")

	http.Handle("/", bytesResponseHandler(ClientIndexHtmlBytes))
	http.Handle("/dist/bundle.css", bytesResponseHandler(ClientDistBundleCssBytes))
	http.Handle("/dist/bundle.js", bytesResponseHandler(ClientDistBundleJsBytes))

	log.Fatal(http.ListenAndServe(":3000", nil))
}

