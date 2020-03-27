package handlers

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
	"strconv"
)

func getID(w http.ResponseWriter, ps httprouter.Params) (int, bool) {
	id, err := strconv.Atoi(ps.ByName("id"))
	if err != nil {
		w.WriteHeader(400)
		return 0, false
	}
	return id, true
}

func SetAllowOriginHeader(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
}

func setJsonContentTypeHeader(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
}

func OptionsHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	SetAllowOriginHeader(w)
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Bearer, x-compress")
	w.Header().Set("Access-Control-Allow-Methods", r.Header.Get("Access-Control-Request-Method"))
}
