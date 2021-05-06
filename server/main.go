package main

import (
	"fmt"
	"os"
	"server/routes"

	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	e := echo.New()

	// CORS
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"https://labstack.net"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept"},
	}))

	routes.Init(e)

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
