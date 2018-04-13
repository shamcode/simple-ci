package main

import (
	_ "github.com/bmizerany/pq"
	"database/sql"
	"fmt"
	log "github.com/sirupsen/logrus"
)

type Db struct {
	config DataBaseConfig
	connection *sql.DB
}

type Project struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Cwd   string `json:"cwd"`
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
	log.Info("Create DB schema")
	_, err := db.connection.Exec(`CREATE TABLE IF NOT EXISTS project("id" SERIAL PRIMARY KEY, "name" varchar(50), "cwd" varchar(255));`)
	if err != nil {
		log.Fatal(err)
	}
}

func (db *Db) GetProjects() ([]Project, error) {
	rows, err := db.connection.Query("SELECT * FROM project")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects = make([]Project, 0)
	var project Project
	for rows.Next() {
		if err = rows.Scan(&project.Id, &project.Name, &project.Cwd); err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return projects, nil
}

func (db *Db) CreateProject(name, cwd string) (sql.Result, error) {
	return db.connection.Exec("INSERT INTO project VALUES (default, $1, $2)",
		name, cwd)
}

func CreateDatabase(config DataBaseConfig) *Db {
	return &Db{config, nil}
}