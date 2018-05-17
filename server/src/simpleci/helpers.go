package main

import (
	"errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/nytimes/gziphandler"
	"github.com/sirupsen/logrus"
	"log"
	"net/http"
)

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

func wrapHandler(handler func(http.ResponseWriter, *http.Request, *Db), db *Db) http.Handler {
	handlerFunc := http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		handler(writer, request, db)
	})
	return gziphandler.GzipHandler(handlerFunc)
}

func jwtHandler(handler func(http.ResponseWriter, *http.Request, *Db), db *Db) http.Handler {
	return wrapHandler(func(w http.ResponseWriter, r *http.Request, db *Db) {
		setAllowOriginHeader(w)
		jwtToken := r.Header.Get("Bearer")
		if 0 == len(jwtToken) {
			http.Error(w, "Request failed!", http.StatusUnauthorized)
			return
		}

		claims, err := jwt.ParseWithClaims(jwtToken, &JWTData{}, func(token *jwt.Token) (interface{}, error) {
			if jwt.SigningMethodHS256 != token.Method {
				return nil, errors.New("Invalid signing algorithm")
			}
			return []byte(SECRET), nil
		})

		if err != nil {
			logrus.WithError(err).Error("Request failed!")
			http.Error(w, "Request failed!", http.StatusUnauthorized)
			return
		}

		data := claims.Claims.(*JWTData)

		userID := data.CustomClaims["id"]
		logrus.WithField("userID", userID).Info("User session")
		handler(w, r, db)
	}, db)
}
