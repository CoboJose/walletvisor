package models

import (
	"errors"
	"wv-server/utils"
)

// GroupTransactionUsers Joins groupTransactions and users
type GroupTransactionUsers struct {
	UserId             int `json:"userId" db:"user_id"`
	GroupTransactionId int `json:"groupTransactionId" db:"group_transaction_id"`
}

var groupTransactionUsersTable = `CREATE TABLE IF NOT EXISTS group_transaction_users (
		user_id 				INT 	NOT NULL 	REFERENCES users(id)				ON DELETE CASCADE,
		group_transaction_id 	INT		NOT NULL 	REFERENCES group_transactions(id)	ON DELETE CASCADE,
		PRIMARY KEY (user_id, group_transaction_id)
	)`

/////////
// NEW //
/////////

// NewGroupTransactionUsers creates a new groupTransactionUsers, but does not store it in the database
func NewGroupTransactionUsers(userId, groupTransactionId int) *GroupTransactionUsers {
	return &GroupTransactionUsers{UserId: userId, GroupTransactionId: groupTransactionId}
}

/////////
// GET //
/////////

// GetGroupTransactionUsersById returns the groupTransactionUsers identified by the id
func GetGroupTransactionUsersById(userId, groupTransactionId int) (*GroupTransactionUsers, *utils.Cerr) {
	groupTransactionUsers := new(GroupTransactionUsers)
	if err := db.Get(groupTransactionUsers, `SELECT * FROM group_transaction_users WHERE user_id=$1 AND group_transaction_id=$2`, userId, groupTransactionId); err != nil {
		return nil, utils.NewCerr("GE000", err)
	}
	return groupTransactionUsers, nil
}

// GetGroupTransactionUsersByGroupTransactionId returns the groupTransactionUsers identified by the groupTransaction id
func GetGroupTransactionUsersByGroupTransactionId(groupTransactionId int) ([]GroupTransactionUsers, *utils.Cerr) {
	groupTransactionUsers := []GroupTransactionUsers{}
	query := `SELECT * FROM group_transaction_users WHERE group_transaction_id=$1`
	if err := db.Select(&groupTransactionUsers, query, groupTransactionId); err != nil {
		return nil, utils.NewCerr("GE000", err)
	}
	return groupTransactionUsers, nil
}

// GetGroupTransactionUsersByUserIdAndGroupTransactionId returns the groupTransactionUsers identified by the groupTransaction id and the user id
func GetGroupTransactionUsersByUserIdAndGroupTransactionId(userId, groupTransactionId int) ([]GroupTransactionUsers, *utils.Cerr) {
	groupTransactionUsers := []GroupTransactionUsers{}
	query := `SELECT * FROM group_transaction_users WHERE user_id=$1 AND group_transaction_id=$2`
	if err := db.Select(&groupTransactionUsers, query, userId, groupTransactionId); err != nil {
		return nil, utils.NewCerr("GE000", err)
	}
	return groupTransactionUsers, nil
}

//////////
// Save //
//////////

// Save stores the groupTransactionUsers in the database, creating it if the ID <= 0, updating it in the other case
func (groupTransactionUsers *GroupTransactionUsers) Save() *utils.Cerr {
	var err error
	if cerr := groupTransactionUsers.validate(); cerr != nil {
		return cerr
	}

	query := `INSERT INTO group_transaction_users (user_id, group_transaction_id) VALUES($1, $2)`
	_, err = db.Exec(query, groupTransactionUsers.UserId, groupTransactionUsers.GroupTransactionId)

	if err != nil {
		return utils.NewCerr("GE000", err)
	}

	return nil
}

////////////
// Delete //
////////////

// Delete deletes the groupTransactionUsers from the database
func (groupTransactionUsers *GroupTransactionUsers) Delete() *utils.Cerr {
	query := `DELETE FROM group_transaction_users WHERE user_id=:user_id AND group_transaction_id=:group_transaction_id`
	res, err := db.NamedExec(query, &groupTransactionUsers)

	if err != nil {
		utils.ErrorLog.Println(err.Error())
		return utils.NewCerr("GE000", err)
	} else if rowsAffected, _ := res.RowsAffected(); rowsAffected < 1 {
		return utils.NewCerr("GE000", errors.New("no rows affected"))
	}

	return nil
}

/////////////
// METHODS //
/////////////

func (groupTransactionUsers *GroupTransactionUsers) validate() *utils.Cerr {
	// Not null
	if groupTransactionUsers.UserId == 0 || groupTransactionUsers.GroupTransactionId == 0 {
		return utils.NewCerr("GE003", nil)
	}

	return nil
}
