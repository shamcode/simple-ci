package handlers

import (
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"simpleci/auth"
	DB "simpleci/db"
	"time"
)

type AdminData struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Registry(w http.ResponseWriter, r *http.Request, db *DB.Db) {
	SetAllowOriginHeader(w)
	var adminData AdminData
	err := json.NewDecoder(r.Body).Decode(&adminData)
	if nil != err {
		http.Error(w, "Fail registry admin!", http.StatusUnauthorized)
		return
	}

	if db.HasAdmin() {
		http.Error(w, "Admin already registered", http.StatusForbidden)
		return
	}

	// Generate "hash" to store from user password
	hash, err := bcrypt.GenerateFromPassword([]byte(adminData.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logrus.WithError(err).Error("Fail registry admin!")
		return
	}
	if _, err := db.CreateAdmin(adminData.Username, string(hash)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		logrus.WithError(err).Error("Fail registry admin!")
		return
	}
	setJsonContentTypeHeader(w)
	w.WriteHeader(201)
}

func GetToken(w http.ResponseWriter, r *http.Request, db *DB.Db) {
	SetAllowOriginHeader(w)
	var adminData AdminData
	err := json.NewDecoder(r.Body).Decode(&adminData)
	if nil != err {
		http.Error(w, "Login failed!", http.StatusUnauthorized)
		return
	}
	admin, err := db.GetAdmin()
	if nil != err {
		http.Error(w, "Login failed!", http.StatusInternalServerError)
		logrus.WithError(err).Error("Login failed!")
		return
	}
	if adminData.Username != admin.Username {
		http.Error(w, "Login failed", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(adminData.Password))
	if err != nil {
		http.Error(w, "Login failed!", http.StatusUnauthorized)
		return
	}

	claims := auth.JWTData{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour).Unix(),
		},
		CustomClaims: map[string]string{
			"id": string(admin.Id),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(auth.SECRET))
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
}
