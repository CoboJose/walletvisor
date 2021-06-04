package models

import (
	"database/sql"
	"errors"
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

/////////
// Get //
/////////

func GetTransactionById(transactionId string) (*Transaction, *utils.Cerr) {
	transaction := new(Transaction)
	if err := db.Get(transaction, `SELECT * FROM transactions WHERE id=$1`, transactionId); err != nil {
		return nil, utils.NewCerr("TR002", err)
	}
	return transaction, nil
}

func GetTransactions(userId int) ([]Transaction, *utils.Cerr) {
	transactions := []Transaction{}
	if err := db.Select(&transactions, `SELECT * FROM transactions WHERE user_id=$1`, userId); err != nil {
		return nil, utils.NewCerr("TR001", err)
	}
	return transactions, nil
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
		query := `UPDATE transactions SET name=:name, kind=:kind, category=:category, amount=:amount, date=:date WHERE id=:id AND user_id=:user_id`
		var res sql.Result
		res, err = db.NamedExec(query, &trn)
		if err == nil {
			if rowsAffected, _ := res.RowsAffected(); err == nil && rowsAffected < 1 {
				err = errors.New("no rows affected")
			}
		}
	}

	if err != nil {
		if strings.Contains(err.Error(), "check") {
			return utils.NewCerr("TR000", errors.New("error saving the transaction to the database"))
		} else if strings.Contains(err.Error(), "no rows affected") {
			return utils.NewCerr("TR002", errors.New("error updating the transaction in the database"))
		} else {
			utils.ErrorLog.Println(err.Error())
			return utils.NewCerr("GE000", err)
		}
	}

	return nil
}

////////////
// Delete //
////////////

func (trn *Transaction) Delete() *utils.Cerr {
	query := `DELETE FROM transactions WHERE id=:id AND user_id=:user_id`
	res, err := db.NamedExec(query, &trn)

	if err != nil {
		utils.ErrorLog.Println(err.Error())
		return utils.NewCerr("GE000", err)
	} else if rowsAffected, _ := res.RowsAffected(); rowsAffected < 1 {
		return utils.NewCerr("TR002", errors.New("no rows affected"))
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
