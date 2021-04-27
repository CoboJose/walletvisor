package routes

import (
	"server/handlers"
	"server/middlewares"

	"github.com/labstack/echo"
)

var (
	api         *echo.Group
	authHandler = &handlers.AuthHandler{}
	userHandler = &handlers.UserHandler{}
)

// Init defines the routes and their handlers
func Init(e *echo.Echo) {
	e.Use(middlewares.Logger)
	e.GET("/ping", func(c echo.Context) error { return c.String(200, "pong") }) // Test connectivity

	api = e.Group("/v1")

	authentication()
	user()
}

func authentication() {
	auth := api.Group("/auth")

	auth.POST("/signup", authHandler.Signup)
	auth.POST("/login", authHandler.Login)
	auth.POST("/refreshToken", authHandler.RefreshToken)
}

func user() {
	user := api.Group("/user", middlewares.ValidToken("user"))
	user.GET("/profile", userHandler.Profile)
}
