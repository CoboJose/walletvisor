package database

import (
	"database/sql"
	"server/models"

	_ "github.com/mattn/go-sqlite3"
)

//DB global variable to perform database actions
var DB *sql.DB

//InitDB initialises the sqlite Database
func InitDB() (err error) {

	DB, err = sql.Open("sqlite3", "./walletvisor.db")
	if err != nil {
		return
	}

	//Create all tables if they do not exist
	for _, t := range models.GetTables() {
		_, err = DB.Exec(t)
		if err != nil {
			return
		}
	}

	return
}

//InitDB initialises the sqlite Database
func InitTestDB() {

	DB, _ = sql.Open("sqlite3", "./test.db")

	//Create all tables if they do not exist
	for _, t := range models.GetTables() {
		DB.Exec(t)
	}

	//Populate Initial Data

}
