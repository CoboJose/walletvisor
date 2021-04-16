package main

import (
	"server/database"
	"server/echo"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	godotenv.Load()

	// Init Database
	database.Init("./walletvisor.db")
	defer database.Close()

	// Init Echo Server
	echo.Init()
}
