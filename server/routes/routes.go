package routes

import (
	"server/handlers"
	"server/middlewares"

	"github.com/labstack/echo"
)

var h = &handlers.Handler{}

//SetupRouter init the server and provides routing
func SetupRouter() *echo.Echo {
	e := echo.New()
	api := e.Group("/v1")

	//Test connectivity
	api.GET("/ping", func(c echo.Context) error {
		return c.String(200, "pong")
	})

	authentication(api)
	user(api)

	return e
}

func authentication(api *echo.Group) {
	auth := api.Group("/auth", middlewares.APIKey)

	auth.POST("/signup", h.Signup)
	auth.POST("/login", h.Login)
	auth.POST("/refreshToken", h.RefreshToken)
}

func user(api *echo.Group) {
	user := api.Group("/user", middlewares.CheckToken("user"))

	user.GET("/profile", h.Profile)
}
