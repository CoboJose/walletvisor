package database

import (
	"database/sql"
	"server/model"
	"server/web"

	_ "github.com/mattn/go-sqlite3"
)

var (
	db  *sql.DB
	w   = web.W
	err error
)

// InitDB opens the database, creates the database and/or the tables defined in models if they do not exists
func Init(dbPath string) {

	// Open the Database
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		w.Logger.Error("Could not open the database: " + err.Error())
		w.Close()
	}

	// Start the Transaction to create the tables
	tx, _ := db.Begin()

	for _, t := range model.Tables {
		if _, err = tx.Exec(t); err != nil {
			tx.Rollback()
			w.Logger.Error("Could not create the tables: " + err.Error())
			w.Close()
		}
	}
	tx.Commit()
}

// Close closes the connection to the database
func Close() {
	db.Close()
}
