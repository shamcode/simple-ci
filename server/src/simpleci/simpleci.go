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

	http.Handle("/", bytesResponseHandler(assets.ClientIndexHtmlBytes))
	http.Handle("/dist/bundle.css", bytesResponseHandler(assets.ClientDistBundleCssBytes))
	http.Handle("/dist/bundle.js", bytesResponseHandler(assets.ClientDistBundleJsBytes))

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", cfg.Server.Port), nil))
}

