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
	e    *echo.Echo
	host string

	user1      *models.User
	user1Token string

	user2      *models.User
	user2Token string

	userUpdate      *models.User
	userUpdateToken string

	password = "c0mplexPa$$"
)

func TestMain(m *testing.M) {
	//Setup Echo
	e = echo.New()
	routes.Init(e)
	host = "http://localhost:" + os.Getenv("PORT") + "/v1/"

	//Setup DB
	// users
	user1 = models.NewUser("user1@test.com", password, "user1", "user")
	user1.Save()
	user1Token, _, _ = utils.GenerateTokens(user1.ID, user1.Email, user1.Role)

	user2 = models.NewUser("user2@test.com", password, "user2", "user")
	user2.Save()
	user2Token, _, _ = utils.GenerateTokens(user2.ID, user2.Email, user2.Role)

	userUpdate = models.NewUser("userUpdate@test.com", password, "userUpdate", "user")
	userUpdate.Save()
	userUpdateToken, _, _ = utils.GenerateTokens(userUpdate.ID, userUpdate.Email, userUpdate.Role)

	// transactions
	trn1 := models.NewTransaction("trn1", "expense", "food", 50.5, 1600000000, user1.ID)
	trn1.Save()

	trn2 := models.NewTransaction("trn2", "income", "salary", 60, 1700000000, user1.ID)
	trn2.Save()

	trn3 := models.NewTransaction("trn3", "income", "salary", 100, 1800000000, user2.ID)
	trn3.Save()

	//Run Tests
	code := m.Run()

	//Teardown
	database.Get().Exec(`TRUNCATE TABLE users, transactions RESTART IDENTITY CASCADE`)
	database.Close()

	//Exit Tests
	os.Exit(code)
}
