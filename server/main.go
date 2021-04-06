package main

import (
	"server/database"
	"server/routes"
)

func main() {
	database.InitDB()
	defer database.DB.Close()

	e := routes.SetupRouter()
	e.Logger.Fatal(e.Start(":8000"))
}
