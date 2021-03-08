package main

import (
	"fmt"
	"server/database"
	"server/routes"
)

func main() {
	err := database.InitDB()
	if err != nil {
		fmt.Println("could not create database: ", err)
	}
	defer database.DB.Close()

	e := routes.SetupRouter()
	e.Logger.Fatal(e.Start(":8000"))
}
