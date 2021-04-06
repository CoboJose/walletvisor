package main

import (
	"fmt"
	"server/database"
	"server/routes"
)

func main() {
	err := database.InitDB()
	if err != nil {
		fmt.Print("Could not init the database: ", err)
		//panic(err)
	}
	fmt.Println(database.DB)
	defer database.DB.Close()

	e := routes.SetupRouter()
	e.Logger.Fatal(e.Start(":8000"))
}
