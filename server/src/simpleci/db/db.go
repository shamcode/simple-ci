package db

import (
	"database/sql"
	"fmt"
	_ "github.com/bmizerany/pq"
	log "github.com/sirupsen/logrus"
	"simpleci/config"
)

type Db struct {
	config     config.DataBaseConfig
	connection *sql.DB
}

type Admin struct {
	Id       int
	Username string
	Password string
}

type Project struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
	Cwd  string `json:"cwd"`
}

type ProjectDetail struct {
	Project
	Chains []Chain `json:"chains"`
}

type Chain struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
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
		CREATE TABLE IF NOT EXISTS project(
			"id" SERIAL PRIMARY KEY, 
			"name" varchar(50), 
			"cwd" varchar(255)
		);
		CREATE TABLE IF NOT EXISTS admin(
			"id" SERIAL PRIMARY KEY,
			"username" varchar(50), 
			"password" text
		);
		CREATE TABLE IF NOT EXISTS chain(
			"id" SERIAL PRIMARY KEY, 
			"project_id" INTEGER REFERENCES project(id) ON DELETE CASCADE,  
			"name" VARCHAR(50)
		);
	`)
	if err != nil {
		log.Fatal(err)
	}
}

func (db *Db) GetAdmin() (Admin, error) {
	var admin Admin
	row := db.connection.QueryRow("SELECT * FROM admin")
	return admin, row.Scan(&admin.Id, &admin.Username, &admin.Password)
}

func (db *Db) HasAdmin() bool {
	var count int
	row := db.connection.QueryRow("SELECT COUNT(*) as count FROM  admin")
	row.Scan(&count)
	return count > 0
}

func (db *Db) CreateAdmin(username, password string) (sql.Result, error) {
	return db.connection.Exec("INSERT INTO admin VALUES (default, $1, $2)",
		username, password)
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

func (db *Db) GetProjectById(id int) (ProjectDetail, error) {
	var project ProjectDetail
	row := db.connection.QueryRow("SELECT * FROM project WHERE id=$1", id)
	err := row.Scan(&project.Id, &project.Name, &project.Cwd)
	if nil != err {
		return project, err
	}

	project.Chains = make([]Chain, 0)
	rows, err := db.connection.Query("SELECT id, \"name\" FROM chain WHERE project_id=$1", id)
	if err != nil {
		return project, err
	}
	defer rows.Close()

	var chain Chain
	for rows.Next() {
		if err = rows.Scan(&chain.Id, &chain.Name); err != nil {
			return project, err
		}
		project.Chains = append(project.Chains, chain)
	}
	if err = rows.Err(); err != nil {
		return project, err
	}
	return project, err
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

func (db *Db) GetProjectChainById(id int) (Chain, error) {
	var chain Chain
	row := db.connection.QueryRow("SELECT id, \"name\" FROM chain WHERE id=$1", id)
	err := row.Scan(&chain.Id, &chain.Name)
	return chain, err
}

func (db *Db) CreateProjectChain(projectID int, name string) (sql.Result, error) {
	return db.connection.Exec("INSERT INTO chain VALUES (default, $1, $2)",
		projectID, name)
}

func (db *Db) UpdateProjectChain(id int, name string) (sql.Result, error) {
	return db.connection.Exec("UPDATE chain SET \"name\"=$1 WHERE id=$2",
		name, id)
}

func (db *Db) DeleteProjectChain(id int) (sql.Result, error) {
	return db.connection.Exec("DELETE FROM chain WHERE id=$1", id)
}

func CreateDatabase(config config.DataBaseConfig) *Db {
	return &Db{config, nil}
}
