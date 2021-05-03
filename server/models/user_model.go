package models

import (
	"fmt"
	"regexp"
	"server/utils"
	"strings"
	"unicode"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id       int    `json:"id" db:"id"`
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

func NewUser(email, password, name, role string) *User {
	return &User{Id: -1, Email: email, Password: password, Name: name, Role: role}
}

/////////
// GET //
/////////

func GetUserById(id int) (user *User, errCode string) {
	user = new(User)
	if err := db.Get(user, `SELECT * FROM users WHERE id=$1`, id); err != nil {
		return nil, "US000"
	}
	return user, ""
}

func GetUserByEmail(email string) (user *User, errCode string) {
	user = new(User)
	if err := db.Get(user, `SELECT * FROM users WHERE email=$1`, email); err != nil {
		return nil, "US001"
	}
	return user, ""
}

func GetUserByAuthentication(email, password string) (user *User, errCode string) {
	user, errCode = GetUserByEmail(email)
	if errCode != "" {
		return nil, "AU001"
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, "AU002"
	}
	return user, ""
}

//////////
// Save //
//////////

func (user *User) Save() (errCode string) {
	var err error
	if errCode := user.validate(); errCode != "" {
		return errCode
	}
	if errCode := user.hashPassword(); errCode != "" {
		return errCode
	}

	if user.Id < 0 { // Create
		query := `INSERT INTO users (email, password, name, role) VALUES($1, $2, $3, $4) RETURNING id`
		err = db.QueryRow(query, user.Email, user.Password, user.Name, user.Role).Scan(&user.Id)
	} else { //Update
		_, err = db.NamedExec(`UPDATE user SET email=:email, password=:password, name=:name, role=:role WHERE id=:id`, &user)
	}

	if err != nil {
		if strings.Contains(err.Error(), "users_email_key") {
			return "AU000"
		} else {
			utils.ErrorLog.Println(err.Error())
			return "GE000"
		}
	}

	return ""
}

/////////////
// METHODS //
/////////////

func (user *User) validate() (errCode string) {
	// Not null
	if user.Id == 0 || user.Email == "" || user.Password == "" || user.Name == "" || user.Role == "" {
		return "GE003"
	}
	// Email
	var emailRegex = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
	if !emailRegex.MatchString(user.Email) {
		return "AU003"
	}
	// Password
	has_digit := false
	has_upper := false
	has_lower := false
	has_special := false
	pass_length := len(user.Password)
	for _, value := range user.Password {
		switch {
		case unicode.IsLower(value):
			has_digit = true
		case unicode.IsUpper(value):
			has_upper = true
		case unicode.IsNumber(value):
			has_lower = true
		case unicode.IsPunct(value) || unicode.IsSymbol(value):
			has_special = true
		}
	}
	if !(has_digit && has_upper && has_lower && has_special && pass_length >= 8) {
		return "AU004"
	}

	return ""
}

func (user *User) hashPassword() (errCode string) {
	passwordBytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println(err.Error())
		return "GE000"
	}
	user.Password = string(passwordBytes)
	return ""
}
