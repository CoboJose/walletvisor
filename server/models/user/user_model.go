package models

import (
	"database/sql"
	"fmt"
	"regexp"
	"server/util"
	"unicode"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id       int64  `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Role     string `json:"role"`
}

var userTable = `
CREATE TABLE IF NOT EXISTS users(
	userId 		INTEGER NOT NULL PRIMARY KEY,
	email 		TEXT 	NOT NULL UNIQUE,
	password	TEXT 	NOT NULL,
	name		TEXT,
	role 		TEXT 	NOT NULL CHECK(role IN('user', 'admin'))
)
`

func NewUser(email, password, name, role string) *User {
	return &User{Id: -1, Email: email, Password: password, Name: name, Role: role}
}

func (user *User) Save() (errCode string) {
	var err error
	var res sql.Result

	if errCode := user.valid(); errCode != "" {
		return errCode
	}
	if errCode := user.hashPassword(); errCode != "" {
		return errCode
	}

	if user.Id < 0 { // Create
		query := `INSERT INTO users(email, password, name, role) values(?, ?, ?, ?)`
		res, err = db.Exec(query, user.Email, user.Password, user.Name, user.Role)
	} else { //Update
		query := `UPDATE users SET email=?, password=?, name=?, role=? WHERE userId=?`
		res, err = db.Exec(query, user.Email, user.Password, user.Name, user.Role, user.Id)
	}

	if err != nil {
		if err.Error() == "UNIQUE constraint failed: users.email" {
			return "AU000"
		} else {
			util.ErrorLog.Println("Unexpected Error creating a user: ", err.Error())
			return "GE000"
		}
	}
	//Set the db id
	if user.Id < 0 {
		user.Id, _ = res.LastInsertId()
	}

	return ""
}

func (u User) GetUserById(id int64) (user *User, errCode string) {
	query := ` SELECT * FROM users WHERE userId = ?`
	err := db.QueryRow(query, id).Scan(&user.Id, &user.Name, &user.Email, &user.Password, &user.Role)
	if err != nil {
		return nil, "US000"
	}

	return user, ""
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

func (user *User) valid() (errCode string) {
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
