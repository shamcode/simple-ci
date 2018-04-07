package main

import (
	"net/http"
	"log"
	"fmt"
	"assets"
	"github.com/julienschmidt/httprouter"
)

func main() {
	cfg := loadConfiguration()

	db := CreateDatabase(cfg.Database)
	db.Connect()
	defer db.Close()

	db.CreateStructure()

	router := httprouter.New()

	router.Handler("GET", "/api/v1/projects", wrapHandler(getProjects, db))
	router.Handler("POST", "/api/v1/projects", wrapHandler(createProject, db))

	router.Handle("OPTIONS", "/*path", optionsHandler)

	router.Handler("GET", "/favicon.ico", bytesResponseHandler(assets.ClientFaviconIcoBytes, "image/x-icon"))
	router.Handler("GET", "/dist/bundle.css", bytesResponseHandler(assets.ClientDistBundleCssBytes, "text/css"))
	router.Handler("GET", "/dist/bundle.js", bytesResponseHandler(assets.ClientDistBundleJsBytes, "application/javascript"))

	root := bytesResponseHandler(assets.ClientIndexHtmlBytes, "text/html")
	router.Handler("GET", "/", root)
	router.NotFound = root

	fmt.Printf("Server start on port :%d\n", cfg.Server.Port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", cfg.Server.Port), router))
}

