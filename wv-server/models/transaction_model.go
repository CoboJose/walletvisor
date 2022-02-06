package models

import (
	"database/sql"
	"errors"
	"strings"
	"wv-server/utils"

	"gopkg.in/guregu/null.v3"
)

type Kind int

const (
	Income Kind = iota
	Expense
)

type Category int

const (
	Salary Category = iota
	Business
	Gifts
	Food
	Home
	Shopping
	Transport
	Bills
	Entertainment
	Other
)

type Transaction struct {
	ID                 int      `json:"id"`
	Name               string   `json:"name"`
	Kind               string   `json:"kind"`
	Category           string   `json:"category"`
	Amount             float64  `json:"amount"`
	Date               int      `json:"date"`
	UserID             int      `json:"userID"  db:"user_id"`
	GroupTransactionID null.Int `json:"groupTransactionID"  db:"group_transaction_id"`
}

var transactionsTable = `CREATE TABLE IF NOT EXISTS transactions (
		id						SERIAL 			PRIMARY KEY,
		name 					VARCHAR(100)	NOT NULL,
		kind 					VARCHAR(100) 	NOT NULL	CHECK(kind IN('` + Income.String() + `', '` + Expense.String() + `')),
		category				VARCHAR(100) 	NOT NULL	CHECK((kind='` + Income.String() + `' AND category IN(` + Income.getCategoriesString() + `)) OR (kind='` + Expense.String() + `' AND category IN(` + Expense.getCategoriesString() + `))),
		amount 					REAL 			NOT NULL	CHECK(amount>=0),
		date 					BIGINT			NOT NULL	CHECK(date>=0),
		user_id					INT				NOT NULL	REFERENCES users(id)				ON DELETE CASCADE,
		group_transaction_id 	INT							REFERENCES group_transactions(id) 	ON DELETE SET NULL
	)`

var transactionsIndexes = `CREATE INDEX IF NOT EXISTS trn_date_index ON transactions (date);
						  CREATE INDEX IF NOT EXISTS trn_user_id_index ON transactions (user_id);`

/////////
// NEW //
/////////

// NewTransaction creates a transaction struct, but does not store it in the database
func NewTransaction(name string, kind string, category string, amount float64, date int, userID int) *Transaction {
	return &Transaction{ID: -1, Name: name, Kind: kind, Category: category, Amount: utils.Round(amount, 2), Date: date, UserID: userID}
}

/////////
// Get //
/////////

// GetTransactionByID returns the transaction matching the id and user id
func GetTransactionByID(transactionID, userID int) (*Transaction, *utils.Cerr) {
	transaction := new(Transaction)
	if err := db.Get(transaction, `SELECT * FROM transactions WHERE id=$1 AND user_id=$2`, transactionID, userID); err != nil {
		return nil, utils.NewCerr("TR002", err)
	}

	transaction.Amount = utils.Round(transaction.Amount, 2)

	return transaction, nil
}

// GetUserTransactions returns all the transactions made by a user between the given timestamps
func GetUserTransactions(userID, from, to int) ([]Transaction, *utils.Cerr) {
	transactions := []Transaction{}
	query := `SELECT * FROM transactions WHERE user_id=$1 AND date >= $2 AND date <= $3`
	if err := db.Select(&transactions, query, userID, from, to); err != nil {
		return nil, utils.NewCerr("TR001", err)
	}

	for i := 0; i < len(transactions); i++ {
		transactions[i].Amount = utils.Round(transactions[i].Amount, 2)
	}

	return transactions, nil
}

// GetUserTotalBalance returns the current total Balance, not filtering by date
func GetUserTotalBalance(userID int) (float64, *utils.Cerr) {
	transactions := []Transaction{}
	query := `SELECT * FROM transactions WHERE user_id=$1`
	if err := db.Select(&transactions, query, userID); err != nil {
		return 0, utils.NewCerr("TR001", err)
	}

	totalBalance := 0.
	for _, trn := range transactions {
		if trn.Kind == "income" {
			totalBalance += trn.Amount
		} else {
			totalBalance -= trn.Amount
		}
	}
	totalBalance = utils.Round(totalBalance, 2)

	return totalBalance, nil
}

// GetTransactionsByGroupTransactionId returns all the transactions created by a group transaction
func GetTransactionsByGroupTransactionId(groupTransactionId int) ([]Transaction, *utils.Cerr) {
	transactions := []Transaction{}
	query := `SELECT * FROM transactions WHERE group_transaction_id=$1`
	if err := db.Select(&transactions, query, groupTransactionId); err != nil {
		return nil, utils.NewCerr("TR003", err)
	}

	for i := 0; i < len(transactions); i++ {
		transactions[i].Amount = utils.Round(transactions[i].Amount, 2)
	}

	return transactions, nil
}

// GetTransactionsByUserIdAndGroupTransactionId returns all the transactions created by a group transaction for a user
func GetTransactionsByUserIdAndGroupTransactionId(userId, groupTransactionId int) ([]Transaction, *utils.Cerr) {
	transactions := []Transaction{}
	query := `SELECT * FROM transactions WHERE user_id=$1 AND group_transaction_id=$2`
	if err := db.Select(&transactions, query, userId, groupTransactionId); err != nil {
		return nil, utils.NewCerr("GE000", err)
	}

	for i := 0; i < len(transactions); i++ {
		transactions[i].Amount = utils.Round(transactions[i].Amount, 2)
	}

	return transactions, nil
}

//////////
// Save //
//////////

// Save stores the transaction in the database, creating it if the ID <= 0, updating it in the other case
func (trn *Transaction) Save() *utils.Cerr {
	var err error
	if cerr := trn.validate(); cerr != nil {
		return cerr
	}

	trn.Amount = utils.Round(trn.Amount, 2)

	if trn.ID <= 0 { // Create
		query := `INSERT INTO transactions (name, kind, category, amount, date, user_id, group_transaction_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`
		err = db.QueryRow(query, trn.Name, trn.Kind, trn.Category, trn.Amount, trn.Date, trn.UserID, trn.GroupTransactionID).Scan(&trn.ID)
	} else { //Update
		query := `UPDATE transactions SET name=:name, kind=:kind, category=:category, amount=:amount, date=:date, group_transaction_id=:group_transaction_id WHERE id=:id AND user_id=:user_id`
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
		}
		utils.ErrorLog.Println(err.Error())
		return utils.NewCerr("GE000", err)
	}

	return nil
}

////////////
// Delete //
////////////

// Delete deletes the transaction from the database
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
	// Not null
	if trn.Name == "" || trn.Kind == "" || trn.Category == "" {
		return utils.NewCerr("GE003", nil)
	}
	// Kind and Category
	if trn.Kind == Income.String() {
		if !utils.Contains(Income.getCategoriesStringArray(), trn.Category) {
			return utils.NewCerr("TR000", nil)
		}
	} else if trn.Kind == Expense.String() {
		if !utils.Contains(Expense.getCategoriesStringArray(), trn.Category) {
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

func (k Kind) String() string {
	return []string{"income", "expense"}[k]
}
func (k Kind) categories() []Category {
	switch k {
	case Income:
		return []Category{Salary, Business, Gifts, Other}
	case Expense:
		return []Category{Food, Home, Shopping, Transport, Bills, Entertainment, Other}
	default:
		return []Category{}
	}
}
func (k Kind) getCategoriesString() string {
	res := ""
	for i, c := range k.categories() {
		if i == 0 {
			res += "'" + c.String() + "'"
		} else {
			res += (", '" + c.String() + "'")
		}
	}
	return res
}
func (k Kind) getCategoriesStringArray() []string {
	res := []string{}
	for _, c := range k.categories() {
		res = append(res, c.String())
	}
	return res
}

func (c Category) String() string {
	return []string{"salary", "business", "gifts", "food", "home", "shopping", "transport", "bills", "entertainment", "other"}[c]
}
