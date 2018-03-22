package main

import (
	"net/http"
	"log"
	"fmt"
	"assets"
)

func main() {
	cfg := LoadConfiguration()

	fmt.Printf("Server start on port :%d\n", cfg.Server.Port)

	http.Handle("/", BytesResponseHandler(assets.ClientIndexHtmlBytes))
	http.Handle("/dist/bundle.css", BytesResponseHandler(assets.ClientDistBundleCssBytes))
	http.Handle("/dist/bundle.js", BytesResponseHandler(assets.ClientDistBundleJsBytes))

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", cfg.Server.Port), nil))
}

