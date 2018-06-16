package main

import (
	"assets"
	"github.com/julienschmidt/httprouter"
	log "github.com/sirupsen/logrus"
	"net/http"
	"simpleci/auth"
	"simpleci/config"
	DB "simpleci/db"
	"simpleci/handlers"
	"strconv"
)

func main() {
	auth.InitSecretJWT()

	cfg := config.LoadConfiguration()

	db := DB.CreateDatabase(cfg.Database)
	db.Connect()
	defer db.Close()

	db.CreateStructure()

	router := httprouter.New()

	router.Handler("POST", "/api/v1/registry", wrapHandler(handlers.Registry, db))
	router.Handler("POST", "/api/v1/login", wrapHandler(handlers.GetToken, db))

	router.Handler("GET", "/api/v1/projects", jwtHandler(handlers.GetProjects, db))
	router.Handler("GET", "/api/v1/projects/:id", jwtHandler(handlers.GetProjectById, db))
	router.Handler("PUT", "/api/v1/projects/:id", jwtHandler(handlers.UpdateProject, db))
	router.Handler("DELETE", "/api/v1/projects/:id", jwtHandler(handlers.DeleteProject, db))
	router.Handler("POST", "/api/v1/projects", jwtHandler(handlers.CreateProject, db))

	router.Handler("POST", "/api/v1/chains", jwtHandler(handlers.CreateProjectChain, db))

	router.Handle("OPTIONS", "/*path", handlers.OptionsHandler)

	router.Handler("GET", "/favicon.ico", bytesResponseHandler(assets.ClientFaviconIcoBytes, "image/x-icon"))
	router.Handler("GET", "/dist/bundle.css", bytesResponseHandler(assets.ClientDistBundleCssBytes, "text/css"))
	router.Handler("GET", "/dist/bundle.js", bytesResponseHandler(assets.ClientDistBundleJsBytes, "application/javascript"))

	root := rootHandler(assets.ClientIndexHtmlBytes, db)
	router.Handler("GET", "/", root)
	router.NotFound = root

	port := strconv.Itoa(cfg.Server.Port)
	log.Infof("Server start on port :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
