package models

import (
	"database/sql"
	"errors"
	"strings"
	"wv-server/utils"
)

// User represents a user of the application
type ExpenseLimit struct {
	ID       int     `json:"id"`
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
	UserId   int     `json:"userId" db:"user_id"`
}

var expenselimitsTable = `CREATE TABLE IF NOT EXISTS expense_limits (
		id 			SERIAL	 		PRIMARY KEY,
		category 	VARCHAR(100) 	NOT NULL	CHECK(category IN(` + Expense.getCategoriesString() + ", 'all'" + `)),
		amount		REAL 			NOT NULL	CHECK(amount>=0),
		user_id		INT				NOT NULL	REFERENCES users(id) 	ON DELETE CASCADE
	)`

/////////
// NEW //
/////////

// NewExpenseLimit creates a new expenseLimit, but does not store it in the database
func NewExpenseLimit(category string, amount float64, userId int) *ExpenseLimit {
	return &ExpenseLimit{ID: -1, Category: category, Amount: amount, UserId: userId}
}

/////////
// GET //
/////////

// GetExpenseLimitByID returns the expenseLimit identified by the id
func GetExpenseLimitByID(id int) (*ExpenseLimit, *utils.Cerr) {
	expenseLimit := new(ExpenseLimit)
	if err := db.Get(expenseLimit, `SELECT * FROM expense_limits WHERE id=$1`, id); err != nil {
		return nil, utils.NewCerr("EL000", err)
	}
	return expenseLimit, nil
}

// GetExpenseLimitsByUserId returns the expenseLimits identified by the userId
func GetExpenseLimitsByUserId(userID int) ([]ExpenseLimit, *utils.Cerr) {
	expenseLimits := []ExpenseLimit{}
	query := `SELECT * FROM expense_limits WHERE user_id=$1`
	if err := db.Select(&expenseLimits, query, userID); err != nil {
		return nil, utils.NewCerr("EL001", err)
	}

	for i := 0; i < len(expenseLimits); i++ {
		expenseLimits[i].Amount = utils.Round(expenseLimits[i].Amount, 2)
	}

	return expenseLimits, nil
}

//////////
// Save //
//////////

// Save stores the expenseLimit in the database, creating it if the ID <= 0, updating it in the other case
func (expenseLimit *ExpenseLimit) Save() *utils.Cerr {
	var err error
	if cerr := expenseLimit.validate(); cerr != nil {
		return cerr
	}

	if expenseLimit.ID < 0 { // Create
		query := `INSERT INTO expense_limits (category, amount, user_id) VALUES($1, $2, $3) RETURNING id`
		err = db.QueryRow(query, expenseLimit.Category, expenseLimit.Amount, expenseLimit.UserId).Scan(&expenseLimit.ID)
	} else { //Update
		query := `UPDATE expense_limits SET category=:category, amount=:amount, user_id=:user_id WHERE id=:id`
		var res sql.Result
		res, err = db.NamedExec(query, &expenseLimit)
		if err == nil {
			if rowsAffected, _ := res.RowsAffected(); err == nil && rowsAffected < 1 {
				err = errors.New("no rows affected")
			}
		}
	}

	if err != nil {
		if strings.Contains(err.Error(), "check") {
			return utils.NewCerr("EL002", errors.New("error saving the transaction to the database"))
		}
		utils.ErrorLog.Println(err.Error())
		return utils.NewCerr("GE000", err)
	}

	return nil
}

////////////
// Delete //
////////////

// Delete deletes the user from the database
func (expenseLimit *ExpenseLimit) Delete() *utils.Cerr {
	query := `DELETE FROM expense_limits WHERE id=:id`
	res, err := db.NamedExec(query, &expenseLimit)

	if err != nil {
		utils.ErrorLog.Println(err.Error())
		return utils.NewCerr("GE000", err)
	} else if rowsAffected, _ := res.RowsAffected(); rowsAffected < 1 {
		return utils.NewCerr("EL000", errors.New("no rows affected"))
	}

	return nil
}

/////////////
// METHODS //
/////////////

func (expenseLimit *ExpenseLimit) validate() *utils.Cerr {
	// Not null
	if expenseLimit.ID == 0 || expenseLimit.Category == "" || expenseLimit.Amount == 0 || expenseLimit.UserId == 0 {
		return utils.NewCerr("GE003", nil)
	}
	// Category
	if !utils.Contains(append(Expense.getCategoriesStringArray(), "all"), expenseLimit.Category) {
		return utils.NewCerr("TR000", nil)
	}

	return nil
}
