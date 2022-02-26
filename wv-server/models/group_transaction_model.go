package models

import (
	"database/sql"
	"errors"
	"strings"
	"wv-server/utils"
)

// GroupTransaction represents a transaction made for a group
type GroupTransaction struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Kind     string  `json:"kind"`
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
	Date     int     `json:"date"`
	GroupId  int     `json:"groupId"  db:"group_id"`
}

var groupTransactionsTable = `CREATE TABLE IF NOT EXISTS group_transactions (
		id			SERIAL 			PRIMARY KEY,
		name 		VARCHAR(100)	NOT NULL,
		kind 		VARCHAR(100) 	NOT NULL	CHECK(kind IN('` + Income.String() + `', '` + Expense.String() + `')),
		category 	VARCHAR(100) 	NOT NULL	CHECK((kind='` + Income.String() + `' AND category IN(` + Income.getCategoriesString() + `)) OR (kind='` + Expense.String() + `' AND category IN(` + Expense.getCategoriesString() + `))),
		amount 		REAL 			NOT NULL	CHECK(amount>=0),
		date 		BIGINT			NOT NULL	CHECK(date>=0),
		group_id 	INT				NOT NULL	REFERENCES groups(id) 	ON DELETE CASCADE
	)`

var groupTransactionsIndexes = `CREATE INDEX IF NOT EXISTS group_trn_date_index ON group_transactions (date);`

/////////
// NEW //
/////////

// NewGroupTransaction creates a groupTransaction struct, but does not store it in the database
func NewGroupTransaction(name string, kind string, category string, amount float64, date int, groupId int) *GroupTransaction {
	return &GroupTransaction{ID: -1, Name: name, Kind: kind, Category: category, Amount: utils.Round(amount, 2), Date: date, GroupId: groupId}
}

/////////
// Get //
/////////

// GetGroupTransactionByID returns the groupTransaction matching the id
func GetGroupTransactionByID(groupTransactionID int) (*GroupTransaction, *utils.Cerr) {
	groupTransaction := new(GroupTransaction)
	if err := db.Get(groupTransaction, `SELECT * FROM group_transactions WHERE id=$1`, groupTransactionID); err != nil {
		return nil, utils.NewCerr("GT000", err)
	}

	groupTransaction.Amount = utils.Round(groupTransaction.Amount, 2)

	return groupTransaction, nil
}

// GetGroupTransactionsByGroupId returns all the groupTransactions in that group
func GetGroupTransactionsByGroupId(groupId int) ([]GroupTransaction, *utils.Cerr) {
	groupTransactions := []GroupTransaction{}
	query := `SELECT * FROM group_transactions WHERE group_id=$1`
	if err := db.Select(&groupTransactions, query, groupId); err != nil {
		return nil, utils.NewCerr("GT001", err)
	}

	for i := 0; i < len(groupTransactions); i++ {
		groupTransactions[i].Amount = utils.Round(groupTransactions[i].Amount, 2)
	}

	return groupTransactions, nil
}

// GetGroupTransactionsByUserIdAndGroupId returns all the groupTransactions in that group that the user is participating
func GetGroupTransactionsByUserIdAndGroupId(userId, groupId int) ([]GroupTransaction, *utils.Cerr) {
	groupTransactions := []GroupTransaction{}
	query := `SELECT gt.* FROM group_transactions gt JOIN group_transaction_users gtu ON gt.id=gtu.group_transaction_id WHERE gtu.user_id=$1 AND gt.group_id=$2`
	if err := db.Select(&groupTransactions, query, userId, groupId); err != nil {
		return nil, utils.NewCerr("GT001", err)
	}

	for i := 0; i < len(groupTransactions); i++ {
		groupTransactions[i].Amount = utils.Round(groupTransactions[i].Amount, 2)
	}

	return groupTransactions, nil
}

// GetActiveGroupTransactionsByUserIdAndGroupId returns all the groupTransactions in that group that the user is participating that are active
func GetActiveGroupTransactionsByUserIdAndGroupId(userId, groupId int) ([]GroupTransaction, *utils.Cerr) {
	res := []GroupTransaction{}

	groupTransactions := []GroupTransaction{}
	query := `SELECT gt.* FROM group_transactions gt JOIN group_transaction_users gtu ON gt.id=gtu.group_transaction_id WHERE gtu.user_id=$1 AND gt.group_id=$2`
	if err := db.Select(&groupTransactions, query, userId, groupId); err != nil {
		return nil, utils.NewCerr("GT001", err)
	}

	for _, gt := range groupTransactions {
		if gt.IsActive() {
			res = append(res, gt)
		}
	}

	for i := 0; i < len(res); i++ {
		res[i].Amount = utils.Round(res[i].Amount, 2)
	}

	return res, nil
}

//////////
// Save //
//////////

// Save stores the groupTransaction in the database, creating it if the ID <= 0, updating it in the other case
func (groupTransaction *GroupTransaction) Save() *utils.Cerr {
	var err error
	if cerr := groupTransaction.validate(); cerr != nil {
		return cerr
	}

	groupTransaction.Amount = utils.Round(groupTransaction.Amount, 2)

	if groupTransaction.ID <= 0 { // Create
		query := `INSERT INTO group_transactions (name, kind, category, amount, date, group_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`
		err = db.QueryRow(query, groupTransaction.Name, groupTransaction.Kind, groupTransaction.Category, groupTransaction.Amount, groupTransaction.Date, groupTransaction.GroupId).Scan(&groupTransaction.ID)
	} else { //Update
		query := `UPDATE group_transactions SET name=:name, kind=:kind, category=:category, amount=:amount, date=:date WHERE id=:id`
		var res sql.Result
		res, err = db.NamedExec(query, &groupTransaction)
		if err == nil {
			if rowsAffected, _ := res.RowsAffected(); err == nil && rowsAffected < 1 {
				err = errors.New("no rows affected")
			}
		}
	}

	if err != nil {
		if strings.Contains(err.Error(), "check") {
			return utils.NewCerr("GT002", errors.New("error saving the transaction to the database"))
		}
		utils.ErrorLog.Println(err.Error())
		return utils.NewCerr("GE000", err)
	}

	return nil
}

////////////
// Delete //
////////////

// Delete deletes the groupTransaction from the database
func (groupTransaction *GroupTransaction) Delete() *utils.Cerr {
	query := `DELETE FROM group_transactions WHERE id=:id`
	res, err := db.NamedExec(query, &groupTransaction)

	if err != nil {
		utils.ErrorLog.Println(err.Error())
		return utils.NewCerr("GE000", err)
	} else if rowsAffected, _ := res.RowsAffected(); rowsAffected < 1 {
		return utils.NewCerr("GE000", errors.New("no rows affected"))
	}

	return nil
}

func (groupTransaction *GroupTransaction) validate() *utils.Cerr {
	// Not null
	if groupTransaction.Name == "" || groupTransaction.Kind == "" || groupTransaction.Category == "" {
		return utils.NewCerr("GE003", nil)
	}
	// Kind and Category
	if groupTransaction.Kind == Income.String() {
		if !utils.Contains(Income.getCategoriesStringArray(), groupTransaction.Category) {
			return utils.NewCerr("GT002", nil)
		}
	} else if groupTransaction.Kind == Expense.String() {
		if !utils.Contains(Expense.getCategoriesStringArray(), groupTransaction.Category) {
			return utils.NewCerr("GT002", nil)
		}
	} else {
		return utils.NewCerr("GT002", nil)
	}
	// Amount and Date
	if groupTransaction.Amount < 0 || groupTransaction.Date < 0 {
		return utils.NewCerr("GT002", nil)
	}

	return nil
}

// IsActive returns false if all the users have paid
func (groupTransaction *GroupTransaction) IsActive() bool {
	isActive := false

	groupTransactionUsersNumber, cerr := GetNumberOfGroupTransactionUsersByGroupTransactionId(groupTransaction.ID)
	if cerr != nil {
		utils.ErrorLog.Println(cerr.Err)
		return isActive
	}
	payedGroupTransactionUsersNumber, cerr := GetNumberOfPayedGroupTransactionUsersByGroupTransactionId(groupTransaction.ID)
	if cerr != nil {
		utils.ErrorLog.Println(cerr.Err)
		return isActive
	}

	return groupTransactionUsersNumber > payedGroupTransactionUsersNumber
}
