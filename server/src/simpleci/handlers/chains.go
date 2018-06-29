package handlers

import (
	"encoding/json"
	"net/http"
	DB "simpleci/db"
	"github.com/julienschmidt/httprouter"
	"database/sql"
)

type projectChain struct {
	Id   int    `json:"id"`
	ProjectID int `json:"projectId"`
	Name string `json:"name"`
}

func GetProjectChainById(w http.ResponseWriter, r *http.Request, db *DB.Db) {
	ps := httprouter.ParamsFromContext(r.Context())
	id, ok := getID(w, ps)
	if !ok {
		return
	}
	chain, err := db.GetProjectChainById(id)
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(404)
			return
		}
		w.WriteHeader(500)
		return
	}
	if err = json.NewEncoder(w).Encode(chain); err != nil {
		w.WriteHeader(500)
		return
	}
	setJsonContentTypeHeader(w)
}

func CreateProjectChain(w http.ResponseWriter, r *http.Request, db *DB.Db) {
	var chain projectChain
	err := json.NewDecoder(r.Body).Decode(&chain)
	if err != nil || chain.Name == "" || chain.ProjectID <= 0 {
		w.WriteHeader(400)
		return
	}

	_, err = db.GetProjectById(chain.ProjectID)
	if nil != err {
		w.WriteHeader(400)
		return
	}

	if _, err := db.CreateProjectChain(chain.ProjectID, chain.Name); err != nil {
		w.WriteHeader(500)
		return
	}
	setJsonContentTypeHeader(w)
	w.WriteHeader(201)
}


func DeleteProjectChain(w http.ResponseWriter, r *http.Request, db *DB.Db) {
	ps := httprouter.ParamsFromContext(r.Context())
	id, ok := getID(w, ps)
	if !ok {
		return
	}
	if _, err := db.DeleteProjectChain(id); err != nil {
		w.WriteHeader(500)
		return
	}
	setJsonContentTypeHeader(w)
	w.WriteHeader(200)
}

func UpdateProjectChain(w http.ResponseWriter, r *http.Request, db *DB.Db) {
	ps := httprouter.ParamsFromContext(r.Context())
	id, ok := getID(w, ps)
	if !ok {
		return
	}
	var chain DB.Chain
	err := json.NewDecoder(r.Body).Decode(&chain)
	if err != nil || chain.Name == "" {
		w.WriteHeader(400)
		return
	}
	if _, err := db.UpdateProjectChain(id, chain.Name); err != nil {
		w.WriteHeader(500)
		return
	}
	setJsonContentTypeHeader(w)
	w.WriteHeader(200)
}

