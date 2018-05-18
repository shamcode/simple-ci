package main

import (
	"database/sql"
	"fmt"
	_ "github.com/bmizerany/pq"
	log "github.com/sirupsen/logrus"
)

type Db struct {
	config     DataBaseConfig
	connection *sql.DB
}

type Project struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
	Cwd  string `json:"cwd"`
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
	_, err := db.connection.Exec(`
		CREATE TABLE IF NOT EXISTS project("id" SERIAL PRIMARY KEY, "name" varchar(50), "cwd" varchar(255));
		CREATE TABLE IF NOT EXISTS admin("id" SERIAL PRIMARY KEY, "username" varchar(50), "password" varchar(50));
	`)
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

func (db *Db) GetProjectById(id int) (Project, error) {
	var project Project
	row := db.connection.QueryRow("SELECT * FROM project WHERE id=$1", id)
	return project, row.Scan(&project.Id, &project.Name, &project.Cwd)
}

func (db *Db) CreateProject(name, cwd string) (sql.Result, error) {
	return db.connection.Exec("INSERT INTO project VALUES (default, $1, $2)",
		name, cwd)
}

func (db *Db) UpdateProject(id int, name, cwd string) (sql.Result, error) {
	return db.connection.Exec("UPDATE project SET \"name\"=$1, cwd=$2 WHERE id=$3",
		name, cwd, id)
}

func (db *Db) DeleteProject(id int) (sql.Result, error) {
	return db.connection.Exec("DELETE FROM project WHERE id=$1", id)
}

func CreateDatabase(config DataBaseConfig) *Db {
	return &Db{config, nil}
}
