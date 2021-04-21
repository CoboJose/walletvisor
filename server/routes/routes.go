package routes

import (
	"server/handler"
	"server/middleware"

	"github.com/labstack/echo"
)

var (
	api         *echo.Group
	authHandler = &handler.AuthHandler{}
	userHandler = &handler.UserHandler{}
)

// SetupRouter defines the routes and their handlers
func SetupRouter(e *echo.Echo) {
	e.Use(middleware.Logger)
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
	user := api.Group("/user", middleware.CheckToken("user"))

	user.GET("/profile", userHandler.Profile)
}
