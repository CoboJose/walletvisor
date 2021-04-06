package user

import (
	"fmt"
	"server/database"
	"server/models"
)

func CreateUser(name, email, password, role string) (errCode string) {

	fmt.Println(database.DB)
	query := `INSERT INTO users(name, email, password, role) values(?, ?, ?, ?)`

	if _, err := database.DB.Exec(query, email, email, password, role); err != nil {

		if err.Error() == "UNIQUE constraint failed: users.email" {
			return "AU000"
		} else {
			fmt.Println(err.Error())
			return "GE000"
		}
	}

	return ""
}

func GetPasswordAndRoleFromEmail(email string) (errCode string, password, role string) {

	query := `SELECT password, role FROM users WHERE email = ?`

	if err := database.DB.QueryRow(query, email).Scan(&password, &role); err != nil {
		fmt.Println(err.Error())
		return "AU001", "", ""
	}

	return
}

func GetUserByEmail(email string) (errCode string, user models.User) {

	query := ` SELECT * FROM users WHERE email = ? `
	err := database.DB.QueryRow(query, email).Scan(&user.UserId, &user.Name, &user.Email, &user.Password, &user.Role)
	if err != nil {
		return "US000", user
	}

	return "", user
}
