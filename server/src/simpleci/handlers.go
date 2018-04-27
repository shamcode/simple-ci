package main

import (
	"net/http"
	"encoding/json"
	"github.com/julienschmidt/httprouter"
	"strconv"
	"database/sql"
)

func getID(w http.ResponseWriter, ps httprouter.Params) (int, bool) {
	id, err := strconv.Atoi(ps.ByName("id"))
	if err != nil {
		w.WriteHeader(400)
		return 0, false
	}
	return id, true
}

func setAllowOriginHeader(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
}

func setJsonContentTypeHeader(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
}

func optionsHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	setAllowOriginHeader(w)
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers")
	w.Header().Set("Access-Control-Allow-Methods", r.Header.Get("Access-Control-Request-Method"))
}

func getProjects(w http.ResponseWriter, r *http.Request, db *Db) {
	setAllowOriginHeader(w)
	projects, err := db.GetProjects()
	if err != nil {
		w.WriteHeader(500)
		return
	}
	if err = json.NewEncoder(w).Encode(projects); err != nil {
		w.WriteHeader(500)
		return
	}
	setJsonContentTypeHeader(w)
}

func getProjectById(w http.ResponseWriter, r *http.Request, db *Db) {
	setAllowOriginHeader(w)
	ps := httprouter.ParamsFromContext(r.Context())
	id, ok := getID(w, ps)
	if !ok {
		return
	}
	project, err := db.GetProjectById(id)
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(404)
			return
		}
		w.WriteHeader(500)
		return
	}
	if err = json.NewEncoder(w).Encode(project); err != nil {
		w.WriteHeader(500)
		return
	}
	setJsonContentTypeHeader(w)
}

func createProject(w http.ResponseWriter, r *http.Request, db *Db) {
	setAllowOriginHeader(w)
	var project Project
	err := json.NewDecoder(r.Body).Decode(&project)
	if err != nil || project.Name == "" || project.Cwd == "" {
		w.WriteHeader(400)
		return
	}
	if _, err := db.CreateProject(project.Name, project.Cwd); err != nil {
		w.WriteHeader(500)
		return
	}
	setJsonContentTypeHeader(w)
	w.WriteHeader(201)
}

func updateProject(w http.ResponseWriter, r *http.Request, db *Db) {
	ps := httprouter.ParamsFromContext(r.Context())
	id, ok := getID(w, ps)
	if !ok {
		return
	}
	setAllowOriginHeader(w)
	var project Project
	err := json.NewDecoder(r.Body).Decode(&project)
	if err != nil || project.Name == "" || project.Cwd == "" {
		w.WriteHeader(400)
		return
	}
	if _, err := db.UpdateProject(id, project.Name, project.Cwd); err != nil {
		w.WriteHeader(500)
		return
	}
	setJsonContentTypeHeader(w)
	w.WriteHeader(200)
}