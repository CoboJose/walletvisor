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
	godotenv.Load()

	// Database
	err := database.InitDB()
	if err != nil {
		fmt.Println("Could not init the database: s", err.Error())
		panic(err)
	}
	defer database.DB.Close()

	// Echo Server
	e := routes.SetupRouter()
	e.Logger.Fatal(e.Start(":" + os.Getenv("PORT")))
}
