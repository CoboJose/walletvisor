package tests

import (
	"os"
	"server/database"
	"server/models"
	"server/routes"

	"testing"

	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo"
)

var (
	e        *echo.Echo
	host     string
	user1    *models.User
	password = "c0mplexPa$$"
)

func TestMain(m *testing.M) {
	//Setup
	e = echo.New()
	routes.Init(e)
	host = "http://localhost:" + os.Getenv("HOST") + "/v1/"
	//Populate DB
	user1 = models.NewUser("user1@test.com", password, "user1", "user")
	user1.Save()
	//Run Tests
	code := m.Run()
	//Teardown
	database.Get().Exec(`TRUNCATE TABLE users RESTART IDENTITY CASCADE`)
	database.Close()
	//Exit Tests
	os.Exit(code)
}
