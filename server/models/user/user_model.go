package user

import (
	"database/sql"
	"fmt"
	"regexp"
	"server/database"
	"server/util"
	"unicode"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	UserId   int64  `json:"userId" db:"user_id"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Role     string `json:"role"`
}

var db *sqlx.DB

func init() {
	db = database.Get()
	//Drop the table
	if _, err := db.Exec(`DROP TABLE IF EXISTS users CASCADE`); err != nil {
		util.ErrorLog.Fatalln("Could not create the Users table: " + err.Error())
	}
	//Create the table
	userTable := `CREATE TABLE users (
		id			SERIAL	 	PRIMARY KEY,
		email 		TEXT 		NOT NULL 	UNIQUE,
		password	TEXT 		NOT NULL,
		name		TEXT 		NOT NULL,
		role 		TEXT 		NOT NULL 	CHECK(role IN('user', 'admin'))
		)`
	if _, err := db.Exec(userTable); err != nil {
		util.ErrorLog.Fatalln("Could not create the Users table: " + err.Error())
	}
}

func NewUser(email, password, name, role string) *User {
	return &User{UserId: -1, Email: email, Password: password, Name: name, Role: role}
}

func GetUserById(id int64) (user *User, errCode string) {
	res := new(User)

	if err := db.Get(res, `SELECT * FROM users WHERE user_id = ?`, id); err != nil {
		return user, "US000"
	}

	return res, ""
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

	if user.UserId < 0 { // Create
		res, err = db.NamedExec(`INSERT INTO users(email, password, name, role) values(:email, :password, :name, :role)`, &user)
	} else { //Update
		res, err = db.NamedExec(`UPDATE users SET email=:email, password=:password, name=:name, role=:role WHERE user_id=:user_id`, &user)
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
	if user.UserId < 0 {
		user.UserId, _ = res.LastInsertId()
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

func (user *User) valid() (errCode string) {
	// Not null
	if user.UserId == 0 || user.Email == "" || user.Password == "" || user.Name == "" || user.Role == "" {
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
