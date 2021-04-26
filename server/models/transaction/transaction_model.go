package transaction

import (
	"server/database"
	"server/util"

	"github.com/jmoiron/sqlx"
)

type Transaction struct {
	TransactionId string `json:"transactionId"`
	Test          string `json:"test"`
}

var db *sqlx.DB

func init() {
	db = database.Get()
	userTable := `CREATE TABLE IF NOT EXISTS transactions (
		transactionId	INTEGER NOT NULL PRIMARY KEY,
		test			TEXT
	)`
	if _, err := db.Exec(userTable); err != nil {
		util.ErrorLog.Fatalln("Could not create the Transactions table: " + err.Error())
	}
}
