package database

import (
	"database/sql"
	"fmt"

	"server/models"

	_ "github.com/mattn/go-sqlite3"
)

//DB global variable to perform database actions
var DB *sql.DB

//InitDB initialises the sqlite Database
func InitDB() error {
	DB, err := sql.Open("sqlite3", "./walletvisor.db")
	if err != nil {
		fmt.Println("Could not init the database")
		return err
	}

	//Create all tables if they do not exists
	for _, t := range models.GetTables() {
		_, err := DB.Exec(t)
		if err != nil {
			fmt.Println("Could not create the tables")
			return err
		}
	}

	return nil

}
