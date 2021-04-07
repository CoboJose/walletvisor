package main

import (
	"fmt"
	"server/database"
	"server/routes"

	"github.com/joho/godotenv"
)

func main() {

	// Environment variables
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Could not read environment variables: ", err.Error())
		panic(err)
	}

	// Database
	err = database.InitDB()
	if err != nil {
		fmt.Println("Could not init the database: s", err.Error())
		panic(err)
	}
	defer database.DB.Close()

	// Echo Server
	e := routes.SetupRouter()
	e.Logger.Fatal(e.Start(":8000"))
}
