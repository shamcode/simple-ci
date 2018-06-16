package main

import (
	"errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/nytimes/gziphandler"
	"github.com/sirupsen/logrus"
	"log"
	"net/http"
	"simpleci/auth"
	DB "simpleci/db"
	"simpleci/handlers"
)

const registryUrlPath = "/registry/"

func rootHandler(callbackForBytesResponse func() ([]byte, error), db *DB.Db) http.Handler {
	bytes, err := callbackForBytesResponse()
	if err != nil {
		log.Fatal(err)
	}
	handler := http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", "text/html")
		if db.HasAdmin() || registryUrlPath == request.URL.Path {
			writer.Write(bytes)
		} else {
			logrus.Warn("Redirect to registry page")
			http.Redirect(writer, request, registryUrlPath, http.StatusSeeOther)
		}
	})
	return gziphandler.GzipHandler(handler)
}

func bytesResponseHandler(callbackForBytesResponse func() ([]byte, error), contentType string) http.Handler {
	bytes, err := callbackForBytesResponse()
	if err != nil {
		log.Fatal(err)
	}
	handler := http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", contentType)
		writer.Write(bytes)
	})
	return gziphandler.GzipHandler(handler)
}

func wrapHandler(handler func(http.ResponseWriter, *http.Request, *DB.Db), db *DB.Db) http.Handler {
	handlerFunc := http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		handler(writer, request, db)
	})
	return gziphandler.GzipHandler(handlerFunc)
}

func jwtHandler(handler func(http.ResponseWriter, *http.Request, *DB.Db), db *DB.Db) http.Handler {
	return wrapHandler(func(w http.ResponseWriter, r *http.Request, db *DB.Db) {
		handlers.SetAllowOriginHeader(w)
		jwtToken := r.Header.Get("Bearer")
		if 0 == len(jwtToken) {
			http.Error(w, "Request failed!", http.StatusUnauthorized)
			return
		}

		claims, err := jwt.ParseWithClaims(jwtToken, &auth.JWTData{}, func(token *jwt.Token) (interface{}, error) {
			if jwt.SigningMethodHS256 != token.Method {
				return nil, errors.New("Invalid signing algorithm")
			}
			return []byte(auth.SECRET), nil
		})

		if err != nil {
			logrus.WithError(err).Warn("Fail parse jwt")
			http.Error(w, "Request failed!", http.StatusUnauthorized)
			return
		}

		data := claims.Claims.(*auth.JWTData)

		userID := data.CustomClaims["id"]

		admin, err := db.GetAdmin()
		if err != nil {
			http.Error(w, "Request failed!", http.StatusInternalServerError)
			logrus.WithError(err).Error("Request failed!")
			return
		}
		if userID != string(admin.Id) {
			logrus.Warn("Invalid claims data")
			http.Error(w, "Request failed!", http.StatusUnauthorized)
			return
		}
		handler(w, r, db)
	}, db)
}
