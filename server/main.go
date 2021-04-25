package main

import (
	"fmt"
	"os"
	"server/database"
	"server/models"

	"github.com/joho/godotenv"
	"github.com/labstack/echo"
)

func main() {
	// Load environment variables
	godotenv.Load()

	database.Init("./walletvisor.db")
	models.CreateTables()

	/*u := models.NewUser("email1@email", "passrgrg·$feF12", "name1", "user")
	u.Id = 1
	errCode := u.Save()
	if errCode != "" {
		fmt.Println(util.GenerateError(errCode))
	}
	fmt.Println(u.Id)*/
	us := models.User.GetUserById(1)
	fmt.Println(us)

	// Init Echo Server
	//initEcho()
}

func initEcho() {
	e := echo.New()
	e.HideBanner = true
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
