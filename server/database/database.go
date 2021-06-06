package database

import (
	"os"
	"server/utils"

	_ "github.com/jackc/pgx/stdlib"       // The driver for the postgres database
	"github.com/jmoiron/sqlx"             // Automatic conversion from db to structs
	_ "github.com/joho/godotenv/autoload" // Load environment variables
)

var db *sqlx.DB

func init() {
	var err error
	// Open the Database connection
	db, err = sqlx.Connect("pgx", os.Getenv("DATABASE_URL"))
	if err != nil {
		utils.ErrorLog.Fatalln("Could not open the database: " + err.Error())
	}
}

// Close closes the connection to the database
func Close() {
	db.Close()
}

// Get returns a handle to the database
func Get() *sqlx.DB {
	return db
}
