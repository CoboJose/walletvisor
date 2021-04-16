package echo

import (
	"fmt"
	"os"

	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
)

// W is a pointer to the Echo framework instance
var W *echo.Echo

// Init inits the Echo server
func Init() {
	W = echo.New()

	W.Logger.SetLevel(log.DEBUG)
	W.Logger.SetHeader("[${time_rfc3339} | ${level} | ${short_file}:${line}]:")

	W.HideBanner = true
	fmt.Println(banner)

	setupRouter()

	W.Logger.Fatal(W.Start(":" + os.Getenv("PORT")))
}

var banner string = `
 _       __      ____     __ _    __                
| |     / /___ _/ / /__  / /| |  / (_)________  _____
| | /| / / __ '/ / / _ \/ __/ | / / / ___/ __ \/ ___/
| |/ |/ / /_/ / / /  __/ /_ | |/ / (__  ) /_/ / /    
|__/|__/\__,_/_/_/\___/\__/ |___/_/____/\____/_/       v1     

Go/Echo  ·  github.com/CoboJose											  
`
