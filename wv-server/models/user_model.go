package models

import (
	"database/sql"
	"errors"
	"regexp"
	"strings"
	"unicode"
	"wv-server/utils"

	"golang.org/x/crypto/bcrypt"
)

// User represents a user of the application
type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Role     string `json:"role"`
}

var usersTable = `CREATE TABLE IF NOT EXISTS users (
		id			SERIAL	 		PRIMARY KEY,
		email 		VARCHAR(100)	NOT NULL 	UNIQUE,
		password	VARCHAR(250) 	NOT NULL,
		name		VARCHAR(100) 	NOT NULL,
		role 		VARCHAR(10)		NOT NULL 	CHECK(role IN('user', 'admin'))
	)`

/////////
// NEW //
/////////

// NewUser creates a new user, but does not store it in the database
func NewUser(email, password, name, role string) *User {
	return &User{ID: -1, Email: email, Password: password, Name: name, Role: role}
}

/////////
// GET //
/////////

// GetUserByID returns the user identified by the id
func GetUserByID(id int) (*User, *utils.Cerr) {
	user := new(User)
	if err := db.Get(user, `SELECT * FROM users WHERE id=$1`, id); err != nil {
		return nil, utils.NewCerr("US000", err)
	}
	return user, nil
}

// GetUserByEmail returns the user identified by the email
func GetUserByEmail(email string) (*User, *utils.Cerr) {
	user := new(User)
	if err := db.Get(user, `SELECT * FROM users WHERE email=$1`, email); err != nil {
		return nil, utils.NewCerr("US001", err)
	}
	return user, nil
}

// GetUserByAuthentication returns the user identified by the email, if the password is correct
func GetUserByAuthentication(email, password string) (*User, *utils.Cerr) {
	user, cerr := GetUserByEmail(email)
	if cerr != nil {
		return nil, utils.NewCerr("AU001", cerr.Err)
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, utils.NewCerr("AU002", err)
	}
	return user, nil
}

// GetUsersByGroupId returns all the users belonging to a group
func GetUsersByGroupId(groupID int) ([]User, *utils.Cerr) {
	groups := []User{}
	query := `SELECT u.* FROM users u JOIN user_groups ug ON u.id=ug.user_id JOIN groups g ON ug.group_id=g.id WHERE g.id=$1`
	if err := db.Select(&groups, query, groupID); err != nil {
		return nil, utils.NewCerr("GR003", err)
	}

	return groups, nil
}

// GetUsersByGroupTransactionId returns all the users that participated in a group transaction
func GetUsersByGroupTransactionId(groupTransactionId int) ([]User, *utils.Cerr) {
	groups := []User{}
	query := `SELECT u.* FROM users u JOIN group_transaction_users gtu ON u.id=gtu.user_id JOIN group_transactions gt ON gtu.group_transaction_id=gt.id WHERE gt.id=$1`
	if err := db.Select(&groups, query, groupTransactionId); err != nil {
		return nil, utils.NewCerr("GE000", err)
	}

	return groups, nil
}

// GetNumberOfUsersByGroupTransactionId returns the number of users that participated in a group transaction
func GetNumberOfUsersByGroupTransactionId(groupTransactionId int) (int, *utils.Cerr) {
	var res int
	query := `SELECT COUNT(u.*) FROM users u JOIN group_transaction_users gtu ON u.id=gtu.user_id JOIN group_transactions gt ON gtu.group_transaction_id=gt.id WHERE gt.id=$1`
	if err := db.Get(&res, query, groupTransactionId); err != nil {
		return 0, utils.NewCerr("GE000", err)
	}

	return res, nil
}

//////////
// Save //
//////////

// Save stores the user in the database, creating it if the ID <= 0, updating it in the other case
func (user *User) Save() *utils.Cerr {
	var err error
	if cerr := user.validate(); cerr != nil {
		return cerr
	}
	if cerr := user.HashPassword(); cerr != nil {
		return cerr
	}

	if user.ID < 0 { // Create
		query := `INSERT INTO users (email, password, name, role) VALUES($1, $2, $3, $4) RETURNING id`
		err = db.QueryRow(query, user.Email, user.Password, user.Name, user.Role).Scan(&user.ID)
	} else { //Update
		query := `UPDATE users SET email=:email, password=:password, name=:name, role=:role WHERE id=:id`
		var res sql.Result
		res, err = db.NamedExec(query, &user)
		if err == nil {
			if rowsAffected, _ := res.RowsAffected(); err == nil && rowsAffected < 1 {
				err = errors.New("no rows affected")
			}
		}
	}

	if err != nil {
		if strings.Contains(err.Error(), "users_email_key") {
			return utils.NewCerr("AU000", nil)
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
func (user *User) Delete() *utils.Cerr {
	query := `DELETE FROM users WHERE id=:id`
	res, err := db.NamedExec(query, &user)

	if err != nil {
		utils.ErrorLog.Println(err.Error())
		return utils.NewCerr("GE000", err)
	} else if rowsAffected, _ := res.RowsAffected(); rowsAffected < 1 {
		return utils.NewCerr("US000", errors.New("no rows affected"))
	}

	return nil
}

/////////////
// METHODS //
/////////////

// HashPassword hashes the user password
func (user *User) HashPassword() *utils.Cerr {
	passwordBytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.ErrorLog.Println(err.Error())
		return utils.NewCerr("GE000", err)
	}
	user.Password = string(passwordBytes)
	return nil
}

func (user *User) validate() *utils.Cerr {
	// Not null
	if user.ID == 0 || user.Email == "" || user.Password == "" || user.Name == "" || user.Role == "" {
		return utils.NewCerr("GE003", nil)
	}
	// Email
	var emailRegex = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
	if !emailRegex.MatchString(user.Email) {
		return utils.NewCerr("AU003", nil)
	}
	// Password
	hasDigit := false
	hasUpper := false
	hasLower := false
	hasSpecial := false
	passLength := len(user.Password)
	for _, value := range user.Password {
		switch {
		case unicode.IsLower(value):
			hasDigit = true
		case unicode.IsUpper(value):
			hasUpper = true
		case unicode.IsNumber(value):
			hasLower = true
		case unicode.IsPunct(value) || unicode.IsSymbol(value):
			hasSpecial = true
		}
	}
	if !(hasDigit && hasUpper && hasLower && hasSpecial && passLength >= 8) {
		return utils.NewCerr("AU004", nil)
	}

	return nil
}
