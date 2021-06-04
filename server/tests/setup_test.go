package tests

import (
	"os"
	"server/database"
	"server/models"
	"server/routes"
	"server/utils"

	"testing"

	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo"
)

var (
	e          *echo.Echo
	host       string
	user1      *models.User
	password   = "c0mplexPa$$"
	user1Token string
)

func TestMain(m *testing.M) {
	//Setup Echo
	e = echo.New()
	routes.Init(e)

	host = "http://localhost:" + os.Getenv("PORT") + "/v1/"
	//Setup DB
	user1 = models.NewUser("user1@test.com", password, "user1", "user")
	user1.Save()
	user1Token, _, _ = utils.GenerateTokens(user1.Id, user1.Email, user1.Role)
	//Run Tests
	code := m.Run()
	//Teardown
	database.Get().Exec(`TRUNCATE TABLE users, transactions RESTART IDENTITY CASCADE`)
	database.Close()
	//Exit Tests
	os.Exit(code)
}
