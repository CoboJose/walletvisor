package database

import (
	"database/sql"
	"server/util"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

// InitDB opens the database, creates the database and/or the tables defined in models if they do not exists
func Init(dbPath string) {
	var err error
	// Open the Database
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		util.ErrorLog.Fatalln("Could not open the database: " + err.Error())
	}
}

// Close closes the connection to the database
func Close() {
	db.Close()
}

// GetDB returns a handle to the database
func Get() *sql.DB {
	return db
}
