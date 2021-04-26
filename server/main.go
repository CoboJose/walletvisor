package main

import (
	"fmt"
	"os"
	"server/models/user"

	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo"
)

func main() {

	nu := user.NewUser("email3@email.com", "passWOr456$", "name2", "user")
	errCode := nu.Save()
	if errCode != "" {
		fmt.Println(errCode)
	} else {
		fmt.Println(nu)
	}

	/*u, errCode := user.GetUserById(1)
	if errCode != "" {
		fmt.Println(errCode)
	} else {
		fmt.Println(u)
	}
	u.Name = "Please"
	u.Email = "fenf@fie.com"
	u.Password = "fjnejfEFJFNdj3&"
	aa := u.Save()
	fmt.Println(aa)*/

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
