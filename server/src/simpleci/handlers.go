package main

import (
	"net/http"
	"encoding/json"
	"github.com/julienschmidt/httprouter"
)

func optionsHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers")
}

func getProjects(w http.ResponseWriter, r *http.Request, db *Db) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	projects, err := db.GetProjects()
	if err != nil {
		w.WriteHeader(500)
		return
	}
	if err = json.NewEncoder(w).Encode(projects); err != nil {
		w.WriteHeader(500)
	}
}

func createProject(w http.ResponseWriter, r *http.Request, db *Db) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
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
	w.WriteHeader(201)
}