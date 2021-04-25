package models

import (
	"database/sql"
	"server/database"
	"server/util"
)

var (
	db     *sql.DB
	tables []string = []string{userTable, transactionTable}
)

// CreateTables create all the models tables in the database if they do not exists yet
func CreateTables() {
	db = database.Get()

	tx, _ := db.Begin()
	for _, t := range tables {
		if _, err := tx.Exec(t); err != nil {
			tx.Rollback()
			util.ErrorLog.Fatalln("Could not create the tables: " + err.Error())
		}
	}
	tx.Commit()
}
