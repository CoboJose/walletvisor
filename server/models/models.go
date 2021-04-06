package models

var Tables []string

//////////////
//// USER ////
//////////////

// User struct
type User struct {
	UserId   string `json:"userId"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

var UserTable = `
CREATE TABLE IF NOT EXISTS users(
	userId 		INTEGER NOT NULL PRIMARY KEY,
	name		TEXT,
	email 		TEXT 	NOT NULL UNIQUE,
	password	TEXT 	NOT NULL,
	role 		TEXT 	NOT NULL CHECK(role IN('user', 'admin'))
)
`

/////////////////////
//// TRANSACTION ////
/////////////////////

type Transaction struct {
	TransactionId string `json:"transactionId"`
	Test          string `json:"test"`
}

var TransactionTable = `
CREATE TABLE IF NOT EXISTS transactions(
	transactionId	INTEGER NOT NULL PRIMARY KEY,
	test			TEXT
)
`

func GetTables() []string {

	return []string{UserTable, TransactionTable}
}
