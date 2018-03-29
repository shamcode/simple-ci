package main

import (
	"net/http"
	"log"
	"fmt"
	"assets"
)

func main() {
	cfg := loadConfiguration()

	db := CreateDatabase(cfg.Database)
	db.Connect()
	defer db.Close()

	db.CreateStructure()

	fmt.Printf("Server start on port :%d\n", cfg.Server.Port)

	http.Handle("/", bytesResponseHandler(assets.ClientIndexHtmlBytes, "text/html"))
	http.Handle("/dist/bundle.css", bytesResponseHandler(assets.ClientDistBundleCssBytes, "text/css"))
	http.Handle("/dist/bundle.js", bytesResponseHandler(assets.ClientDistBundleJsBytes, "application/javascript"))

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", cfg.Server.Port), nil))
}

