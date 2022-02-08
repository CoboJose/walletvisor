package models

import (
	"wv-server/database"
	"wv-server/utils"

	"github.com/jmoiron/sqlx"
)

var db *sqlx.DB
var dbOperations = []string{usersTable, groupsTable, groupsIndexes, groupInvitationsTable, userGroupsTable,
	groupTransactionsTable, groupTransactionsIndexes, groupTransactionUsersTable, transactionsTable, transactionsIndexes}

func init() {
	db = database.Get()

	// Init the database with the tables and indexes
	tx, _ := db.Begin()
	for _, t := range dbOperations {
		_, err := tx.Exec(t)
		if err != nil {
			tx.Rollback()
			utils.ErrorLog.Fatalln("Could not make the init database operation: " + err.Error())
		}
	}
	tx.Commit()
}
