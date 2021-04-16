package echo

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
func setupRouter() {
	api = E.Group("/v1")

	authentication()
	user()
	ping()
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

func ping() {
	// Test connectivity
	api.GET("/ping", func(c echo.Context) error {
		return c.String(200, "pong")
	})
}
