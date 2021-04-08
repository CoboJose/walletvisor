package main

import (
	"fmt"
	"os"
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

	fmt.Println("Im on Heroku!!")

	// Echo Server
	e := routes.SetupRouter()
	e.Logger.Fatal(e.Start(os.Getenv("PORT")))
}
