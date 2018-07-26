package handlers

import (
	"bufio"
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/julienschmidt/httprouter"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	DB "simpleci/db"
	WS "simpleci/ws"
)

type projectChain struct {
	Id        int    `json:"id"`
	ProjectID int    `json:"projectId"`
	Name      string `json:"name"`
	Command   string `json:"command"`
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

	if _, err := db.CreateProjectChain(chain.ProjectID, chain.Name, chain.Command); err != nil {
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
	var chain DB.ChainDetail
	err := json.NewDecoder(r.Body).Decode(&chain)
	if err != nil || chain.Name == "" {
		w.WriteHeader(400)
		return
	}
	if _, err := db.UpdateProjectChain(id, chain.Name, chain.Command); err != nil {
		w.WriteHeader(500)
		return
	}
	setJsonContentTypeHeader(w)
	w.WriteHeader(200)
}

func RunProjectChain(w http.ResponseWriter, r *http.Request, db *DB.Db) {
	ps := httprouter.ParamsFromContext(r.Context())
	id, ok := getID(w, ps)
	if !ok {
		return
	}
	chain, err := db.GetProjectChainForRun(id)
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(404)
			return
		}
		w.WriteHeader(500)
		return
	}
	go runChain(chain)
	setJsonContentTypeHeader(w)
	w.WriteHeader(200)
}

func runChain(chain DB.ChainForRun) {
	log.
		WithField("id", chain.Id).
		WithField("name", chain.Name).
		WithField("project", chain.Project.Name).
		Info("run project chain")
	scriptFile, err := ioutil.TempFile("", "_simpleciscript.sh")
	if nil != err {
		log.WithError(err).Error("fail create temp file")
		return
	}
	defer os.Remove(scriptFile.Name())
	scriptFile.WriteString("#!/bin/sh\n")
	scriptFile.WriteString(chain.Command)
	cmd := exec.Command("sh", scriptFile.Name())
	cmd.Dir = chain.Project.Cwd
	stdout, _ := cmd.StdoutPipe()
	cmdErr := &bytes.Buffer{}
	cmd.Stderr = cmdErr
	cmd.Start()
	scanner := bufio.NewScanner(stdout)
	scanner.Split(bufio.ScanLines)
	for scanner.Scan() {
		WS.Store.Broadcast(chain.Id, scanner.Bytes())
	}
	err = cmd.Wait()

	if nil != err {
		WS.Store.Broadcast(chain.Id, cmdErr.Bytes())
	}
	WS.Store.Broadcast(chain.Id, []byte(fmt.Sprintf("Finish \"%s\"", chain.Name)))
	WS.Store.RemoveChain(chain.Id)
	log.
		WithField("id", chain.Id).
		WithField("name", chain.Name).
		WithField("project", chain.Project.Name).
		Info("finish run project chain")
}
