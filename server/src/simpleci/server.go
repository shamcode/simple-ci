package main

import (
	"net/http"
	"log"
	"github.com/nytimes/gziphandler"
)

func main() {
	http.Handle("/", gziphandler.GzipHandler(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		indexHtmlBytes, err := ClientIndexHtmlBytes()
		if err != nil {
			log.Fatal(err)
		}
		writer.Write(indexHtmlBytes)
	})))

	http.Handle("/dist/bundle.css", gziphandler.GzipHandler(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		bundleCssBytes, err := ClientDistBundleCssBytes()
		if err != nil {
			log.Fatal(err)
		}
		writer.Write(bundleCssBytes)
	})))

	http.Handle("/dist/bundle.js", gziphandler.GzipHandler(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		bundleJsBytes, err := ClientDistBundleJsBytes()
		if err != nil {
			log.Fatal(err)
		}
		writer.Write(bundleJsBytes)
	})))

	log.Fatal(http.ListenAndServe(":3000", nil))
}

