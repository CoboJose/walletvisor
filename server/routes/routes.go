package routes

import (
	"os"
	"server/handlers"
	"server/middlewares"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

var (
	api                *echo.Group
	authHandler        = &handlers.AuthHandler{}
	userHandler        = &handlers.UserHandler{}
	transactionHandler = &handlers.TransactionHandler{}
)

// Init defines the routes and their handlers
func Init(e *echo.Echo) {
	if os.Getenv("REQUEST_LOGGER") == "true" {
		e.Use(middlewares.Logger)
	}
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"https://walletvisor.netlify.app/", "http://localhost:3000", "http://192.168.1.2:3000", "http://localhost:5000", "http://192.168.1.2:5000"},
		AllowHeaders: []string{"*"},
	}))

	e.GET("/ping", func(c echo.Context) error { return c.String(200, "pong") }) // Test connectivity

	api = e.Group("/v1")

	authentication()
	user()
	transaction()
}

func authentication() {
	auth := api.Group("/auth")

	auth.POST("/signup", authHandler.Signup)
	auth.POST("/login", authHandler.Login)
	auth.GET("/refreshToken", authHandler.RefreshToken)
	auth.DELETE("/deleteAccount", authHandler.DeleteAccount, middlewares.ValidToken("user"))
}

func user() {
	user := api.Group("/user", middlewares.ValidToken("user"))

	user.GET("", userHandler.Get)
	user.PUT("", userHandler.Update)
}

func transaction() {
	transaction := api.Group("/transactions", middlewares.ValidToken("user"))

	transaction.GET("", transactionHandler.GetAll)
	transaction.POST("", transactionHandler.Create)
	transaction.PUT("", transactionHandler.Update)
	transaction.DELETE("", transactionHandler.Delete)
}
