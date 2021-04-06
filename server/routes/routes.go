package routes

import (
	"net/http"
	"server/handlers"
	"server/middlewares"

	"github.com/labstack/echo"
)

var h = &handlers.Handler{}

//SetupRouter init the server and provides routing
func SetupRouter() *echo.Echo {
	e := echo.New()

	//Test connectivity
	e.GET("/ping", func(c echo.Context) error {
		return c.String(http.StatusOK, "pong")
	})

	api := e.Group("/v1")
	authentication(api)
	user(api)

	return e
}

func authentication(api *echo.Group) {
	auth := api.Group("/auth", middlewares.APIKey)

	auth.POST("/signup", h.Signup)
	auth.POST("/login", h.Login)
	auth.POST("/refreshToken", h.RefreshToken, middlewares.CheckToken("user"))
}

func user(api *echo.Group) {
	user := api.Group("/user", middlewares.CheckToken("user"))

	user.GET("/profile", h.Profile)
}
