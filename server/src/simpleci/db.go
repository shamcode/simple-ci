package main

import (
	_ "github.com/bmizerany/pq"
	"database/sql"
	"fmt"
	"log"
)

type Db struct {
	config DataBaseConfig
	connection *sql.DB
}

func (db *Db) Connect() {
	var err error
	connectString := fmt.Sprintf("host=%s port=%d dbname=%s user=%s password=%s",
		db.config.Host,
		db.config.Port,
		db.config.Name,
		db.config.User,
		db.config.Pass,
	)
	db.connection, err = sql.Open(db.config.Driver, connectString)
	if err != nil {
		log.Fatal(err)
	}
}

func (db *Db) Close() {
	db.connection.Close()
}

func (db *Db) CreateStructure() {
	_, err := db.connection.Exec("CREATE TABLE IF NOT EXISTS " +
		`admin("id" SERIAL PRIMARY KEY,` +
		`"name" varchar(50))`)
	if err != nil {
		log.Fatal(err)
	}
}

func CreateDatabase(config DataBaseConfig) *Db {
	return &Db{config, nil}
}