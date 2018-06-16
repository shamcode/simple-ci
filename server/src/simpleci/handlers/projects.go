package handlers

import (
	"database/sql"
	"encoding/json"
	"github.com/julienschmidt/httprouter"
	"net/http"
	DB "simpleci/db"
)

func GetProjects(w http.ResponseWriter, _ *http.Request, db *DB.Db) {
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

func GetProjectById(w http.ResponseWriter, r *http.Request, db *DB.Db) {
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

func CreateProject(w http.ResponseWriter, r *http.Request, db *DB.Db) {
	var project DB.Project
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

func UpdateProject(w http.ResponseWriter, r *http.Request, db *DB.Db) {
	ps := httprouter.ParamsFromContext(r.Context())
	id, ok := getID(w, ps)
	if !ok {
		return
	}
	var project DB.Project
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

func DeleteProject(w http.ResponseWriter, r *http.Request, db *DB.Db) {
	ps := httprouter.ParamsFromContext(r.Context())
	id, ok := getID(w, ps)
	if !ok {
		return
	}
	if _, err := db.DeleteProject(id); err != nil {
		w.WriteHeader(500)
		return
	}
	setJsonContentTypeHeader(w)
	w.WriteHeader(200)
}
