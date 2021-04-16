package model

type User struct {
	UserId   string `json:"userId"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

var userTable = `
CREATE TABLE IF NOT EXISTS users(
	userId 		INTEGER NOT NULL PRIMARY KEY,
	name		TEXT,
	email 		TEXT 	NOT NULL UNIQUE,
	password	TEXT 	NOT NULL,
	role 		TEXT 	NOT NULL CHECK(role IN('user', 'admin'))
)
`
