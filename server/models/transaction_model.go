package models

type Transaction struct {
	TransactionId string `json:"transactionId"`
	Test          string `json:"test"`
}

var transactionTable = `
CREATE TABLE IF NOT EXISTS transactions(
	transactionId	INTEGER NOT NULL PRIMARY KEY,
	test			TEXT
)
`
