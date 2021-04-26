package database

import (
	"fmt"
	"os"
	"server/util"

	_ "github.com/jackc/pgx/stdlib"
	"github.com/jmoiron/sqlx"
	_ "github.com/joho/godotenv/autoload"
)

var db *sqlx.DB

func init() {
	var err error
	// Open the Database connection
	fmt.Println(os.Getenv("DATABASE_URL"))
	db, err = sqlx.Connect("pgx", os.Getenv("DATABASE_URL"))
	if err != nil {
		util.ErrorLog.Fatalln("Could not open the database: " + err.Error())
	}
}

// Close closes the connection to the database
func Close() {
	db.Close()
}

// GetDB returns a handle to the database
func Get() *sqlx.DB {
	return db
}
