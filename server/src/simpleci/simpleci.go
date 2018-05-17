package main

import (
	"assets"
	"github.com/julienschmidt/httprouter"
	log "github.com/sirupsen/logrus"
	"net/http"
	"strconv"
)

func main() {
	InitSecretJWT()

	cfg := loadConfiguration()

	db := CreateDatabase(cfg.Database)
	db.Connect()
	defer db.Close()

	db.CreateStructure()

	router := httprouter.New()

	router.Handler("POST", "/api/v1/login", wrapHandler(getToken, db))

	router.Handler("GET", "/api/v1/projects", jwtHandler(getProjects, db))
	router.Handler("GET", "/api/v1/projects/:id", jwtHandler(getProjectById, db))
	router.Handler("PUT", "/api/v1/projects/:id", jwtHandler(updateProject, db))
	router.Handler("DELETE", "/api/v1/projects/:id", jwtHandler(deleteProject, db))
	router.Handler("POST", "/api/v1/projects", jwtHandler(createProject, db))

	router.Handle("OPTIONS", "/*path", optionsHandler)

	router.Handler("GET", "/favicon.ico", bytesResponseHandler(assets.ClientFaviconIcoBytes, "image/x-icon"))
	router.Handler("GET", "/dist/bundle.css", bytesResponseHandler(assets.ClientDistBundleCssBytes, "text/css"))
	router.Handler("GET", "/dist/bundle.js", bytesResponseHandler(assets.ClientDistBundleJsBytes, "application/javascript"))

	root := bytesResponseHandler(assets.ClientIndexHtmlBytes, "text/html")
	router.Handler("GET", "/", root)
	router.NotFound = root

	port := strconv.Itoa(cfg.Server.Port)
	log.Infof("Server start on port :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
