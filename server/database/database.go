package database

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3" //fe
)

//DB global variable to perform database actions
var DB *sql.DB

//InitDB initialises the sqlite Database
func InitDB() (err error) {
	DB, err = sql.Open("sqlite3", "./walletvisor.db")
	if err != nil {
		return
	}

	//Create all tables if they do not exists
	createTables()

	return
}

func createTables() {
	tables := `
	CREATE TABLE IF NOT EXISTS users(
		Id INT NOT NULL PRIMARY KEY,
		Email TEXT NOT NULL,
		Password TEXT NOT NULL
	)
	`
	_, err := DB.Exec(tables)
	if err != nil {
		panic(err)
	}
}
