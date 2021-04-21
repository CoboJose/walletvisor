package database

import (
	"database/sql"
	"server/model"
	"server/utils"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

// InitDB opens the database, creates the database and/or the tables defined in models if they do not exists
func Init(dbPath string) {
	var err error
	// Open the Database
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		utils.ErrorLog.Fatalln("Could not open the database: " + err.Error())
	}

	// Create the tables
	tx, _ := db.Begin()
	for _, t := range model.Tables {
		if _, err = tx.Exec(t); err != nil {
			tx.Rollback()
			utils.ErrorLog.Fatalln("Could not create the tables: " + err.Error())
		}
	}
	tx.Commit()
}

// Close closes the connection to the database
func Close() {
	db.Close()
}
