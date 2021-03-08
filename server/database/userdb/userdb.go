package userdb

import "server/database"

//CreateUser Insert the user into the db (hashing the password)
func CreateUser(email, pass string) (err error) {

	insert := `
	INSERT INTO users(
		Id, Email, Password
	) values(?, ?, ?)
	`
	smt, err := database.DB.Prepare(insert)
	if err != nil {
		panic(err)
	}
	defer smt.Close()
	_, err = smt.Exec(2, "email@email.com", "pass")
	if err != nil {
		panic(err)
	}
	return nil
}
