package main

import (
	"fmt"
	"os"
	"server/database"
	"server/routes"

	"github.com/joho/godotenv"
	"github.com/labstack/echo"
)

func main() {
	// Load environment variables
	godotenv.Load()

	// Init Database
	database.Init("./walletvisor.db")
	defer database.Close()

	// Init Echo Server
	initEcho()
}

func initEcho() {
	e := echo.New()
	e.HideBanner = true
	routes.SetupRouter(e)
	fmt.Println(banner)

	e.Start(":" + os.Getenv("PORT"))
}

var banner string = `
 _       __      ____     __ _    __                
| |     / /___ _/ / /__  / /| |  / ( )____ ___  ____
| | /| / / __ '/ / / _ \/ __/ | / / / ___/ __ \/ __/
| |/ |/ / /_/ / / /  __/ /_ | |/ / (__  ) /_/ / /    
|__/|__/\__,_/_/_/\___/\__/ |___/_/____/\____/_/ v1     

Go/Echo  ·  github.com/CoboJose											  
`
