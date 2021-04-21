package database

import (
	"server/model"
	"server/utils"
)

type UserDB struct{}

func (u UserDB) CreateUser(name, email, password, role string) (errCode string) {
	query := `INSERT INTO users(name, email, password, role) values(?, ?, ?, ?)`

	if _, err := db.Exec(query, email, email, password, role); err != nil {
		if err.Error() == "UNIQUE constraint failed: users.email" {
			return "AU000"
		} else {
			utils.ErrorLog.Println("Unexpected Error creating a user: ", err.Error())
			return "GE000"
		}
	}

	return ""
}

func (u UserDB) GetPasswordAndRoleFromEmail(email string) (errCode, password, role string) {

	query := `SELECT password, role FROM users WHERE email = ?`

	if err := db.QueryRow(query, email).Scan(&password, &role); err != nil {
		return "AU001", "", ""
	}

	return
}

func (u UserDB) GetRoleByUserEmail(email string) (role, errCode string) {

	query := `SELECT role FROM users WHERE email = ?`

	if err := db.QueryRow(query, email).Scan(&role); err != nil {
		return "", "AU001"
	}

	return
}

func (u UserDB) GetUserByEmail(email string) (user model.User, errCode string) {

	query := ` SELECT * FROM users WHERE email = ? `
	err := db.QueryRow(query, email).Scan(&user.UserId, &user.Name, &user.Email, &user.Password, &user.Role)
	if err != nil {
		return user, "US000"
	}

	return user, ""
}
