package models

import (
	"wv-server/database"
	"wv-server/utils"

	"github.com/jmoiron/sqlx"
)

var db *sqlx.DB
var tables = []string{usersTable, transactionsTable, transactionsIndexes}

func init() {
	db = database.Get()

	// Create the tables
	tx, _ := db.Begin()
	for _, t := range tables {
		_, err := tx.Exec(t)
		if err != nil {
			tx.Rollback()
			utils.ErrorLog.Fatalln("Could not create the tables: " + err.Error())
		}
	}
	tx.Commit()
}
