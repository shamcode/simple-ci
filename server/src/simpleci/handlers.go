package main

import (
	"database/sql"
	"encoding/json"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/julienschmidt/httprouter"
	"github.com/sirupsen/logrus"
	"net/http"
	"strconv"
	"time"
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
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Bearer")
	w.Header().Set("Access-Control-Allow-Methods", r.Header.Get("Access-Control-Request-Method"))
}

func getToken(w http.ResponseWriter, r *http.Request, db *Db) {
	setAllowOriginHeader(w)
	var userData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	err := json.NewDecoder(r.Body).Decode(&userData)
	if nil != err {
		http.Error(w, "Login failed!", http.StatusUnauthorized)
		return
	}
	if userData.Username == "admin" && userData.Password == "passw0rd" {
		claims := JWTData{
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: time.Now().Add(time.Hour).Unix(),
			},
			CustomClaims: map[string]string{
				"id": "1",
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString([]byte(SECRET))
		if err != nil {
			logrus.WithError(err).Error("login failed")
			http.Error(w, "Login failed!", http.StatusUnauthorized)
			return
		}

		err = json.NewEncoder(w).Encode(struct {
			Token string `json:"token"`
		}{
			tokenString,
		})
		if err != nil {
			logrus.WithError(err).Error("login failed")
			http.Error(w, "Login failed!", http.StatusUnauthorized)
			return
		}
		setJsonContentTypeHeader(w)
	} else {
		http.Error(w, "Login failed", http.StatusUnauthorized)
	}
}

func getProjects(w http.ResponseWriter, r *http.Request, db *Db) {
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

func deleteProject(w http.ResponseWriter, r *http.Request, db *Db) {
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
