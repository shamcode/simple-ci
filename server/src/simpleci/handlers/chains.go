package handlers

import (
	"encoding/json"
	"net/http"
	DB "simpleci/db"
)

type projectChain struct {
	Id   int    `json:"id"`
	ProjectID int `json:"projectId"`
	Name string `json:"name"`
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

