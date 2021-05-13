package models

import (
	"errors"
	"fmt"
	"server/utils"
	"strings"
)

type Transaction struct {
	Id       int     `json:"id"`
	Name     string  `json:"name"`
	Kind     string  `json:"kind"`
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
	Date     int     `json:"date"`
	UserId   int     `json:"userId"  db:"user_id"`
}

var transactionTable = `CREATE TABLE IF NOT EXISTS transactions (
		id			SERIAL 			PRIMARY KEY,
		name 		VARCHAR(100)	NOT NULL,
		kind 		VARCHAR(100) 	NOT NULL	CHECK(kind IN('income', 'expense')),
		category	VARCHAR(100) 	NOT NULL	CHECK((kind='income' AND category IN('salary', 'business', 'gifts', 'other')) OR (kind='expense' AND category IN('food','home', 'shopping', 'transport', 'bills', 'entertainment', 'other'))),
		amount 		REAL 			NOT NULL	CHECK(amount>=0),
		date 		INT				NOT NULL	CHECK(date>=0),
		user_id		INT				NOT NULL	REFERENCES users	ON DELETE CASCADE
	)`

/////////
// NEW //
/////////

func NewTransaction(name string, kind string, category string, amount float64, date int, userId int) *Transaction {
	return &Transaction{Id: -1, Kind: kind, Category: category, Amount: amount, Date: date, UserId: userId}
}

//////////
// Save //
//////////

func (trn *Transaction) Save() *utils.Cerr {
	var err error
	if cerr := trn.validate(); cerr != nil {
		return cerr
	}

	if trn.Id <= 0 { // Create
		query := `INSERT INTO transactions (name, kind, category, amount, date, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`
		err = db.QueryRow(query, trn.Name, trn.Kind, trn.Category, trn.Amount, trn.Date, trn.UserId).Scan(&trn.Id)
	} else { //Update
		_, err = db.NamedExec(`UPDATE transactions SET name=:name, kind=:kind, category=:category, amount=:amount, date=:date, user_id=:user_id WHERE id=:id`, &trn)
	}

	if err != nil {
		fmt.Println(err)
		if strings.Contains(err.Error(), "check") {
			return utils.NewCerr("TR000", errors.New("error saving the transaction to the database"))
		} else {
			return utils.NewCerr("GE000", err)
		}
	}

	return nil
}

func (trn *Transaction) validate() *utils.Cerr {
	incomeCategories := []string{"salary", "business", "gifts", "other"}
	expenseCategories := []string{"food", "home", "shopping", "transport", "bills", "entertainment", "other"}
	// Not null
	if trn.Name == "" || trn.Kind == "" || trn.Category == "" {
		return utils.NewCerr("GE003", nil)
	}
	// Kind and Category
	if trn.Kind == "income" {
		if !utils.Contains(incomeCategories, trn.Category) {
			return utils.NewCerr("TR000", nil)
		}
	} else if trn.Kind == "expense" {
		if !utils.Contains(expenseCategories, trn.Category) {
			return utils.NewCerr("TR000", nil)
		}
	} else {
		return utils.NewCerr("TR000", nil)
	}
	// Amount and Date
	if trn.Amount < 0 || trn.Date < 0 {
		return utils.NewCerr("TR000", nil)
	}

	return nil
}
