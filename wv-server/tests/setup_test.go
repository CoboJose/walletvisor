package tests

import (
	"os"
	"wv-server/database"
	"wv-server/models"
	"wv-server/routes"
	"wv-server/utils"

	"testing"

	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo"
	"gopkg.in/guregu/null.v3"
)

var (
	e    *echo.Echo
	host string

	user1           *models.User
	user1Token      string
	user2           *models.User
	user2Token      string
	user3           *models.User
	user3Token      string
	user4           *models.User
	user4Token      string
	userUpdate      *models.User
	userUpdateToken string

	group1           *models.Group
	groupInvitation1 *models.GroupInvitation

	password = "c0mplexPa$$"
)

func TestMain(m *testing.M) {
	//Setup Echo
	e = echo.New()
	routes.Init(e)
	host = "http://localhost:" + os.Getenv("PORT") + "/v1/"

	//Setup DB
	// Users
	user1 = models.NewUser("user1@test.com", password, "user1", "user")
	user1.Save()
	user1Token, _, _ = utils.GenerateTokens(user1.ID, user1.Email, user1.Role)

	user2 = models.NewUser("user2@test.com", password, "user2", "user")
	user2.Save()
	user2Token, _, _ = utils.GenerateTokens(user2.ID, user2.Email, user2.Role)

	user3 = models.NewUser("user3@test.com", password, "user3", "user")
	user3.Save()
	user3Token, _, _ = utils.GenerateTokens(user3.ID, user3.Email, user3.Role)

	user4 = models.NewUser("user4@test.com", password, "user4", "user")
	user4.Save()
	user4Token, _, _ = utils.GenerateTokens(user4.ID, user4.Email, user4.Role)

	userUpdate = models.NewUser("userUpdate@test.com", password, "userUpdate", "user")
	userUpdate.Save()
	userUpdateToken, _, _ = utils.GenerateTokens(userUpdate.ID, userUpdate.Email, userUpdate.Role)

	// Transactions
	trn1 := models.NewTransaction("trn1", "expense", "food", 50.5, 1600000000, user1.ID)
	trn1.Save()

	trn2 := models.NewTransaction("trn2", "income", "salary", 60, 1700000000, user1.ID)
	trn2.Save()

	trn3 := models.NewTransaction("trn3", "income", "salary", 100, 1800000000, user2.ID)
	trn3.Save()

	// Groups
	group1 = models.NewGroup("Group1", "#000000")
	group1.Save()
	userGroup11 := models.NewUserGroup(user1.ID, group1.ID)
	userGroup11.Save()
	userGroup14 := models.NewUserGroup(user4.ID, group1.ID)
	userGroup14.Save()
	groupInvitation1 = models.NewGroupInvitation(user2.ID, user1.ID, group1.ID)
	groupInvitation1.Save()

	// Group Transactions
	groupTrn1 := models.NewGroupTransaction("groupTrn1", "income", "salary", 60, 1700000000, group1.ID)
	groupTrn1.Save()
	groupTransactionUser1 := models.NewGroupTransactionUsers(user1.ID, groupTrn1.ID, true, true)
	groupTransactionUser1.Save(false)
	groupTrnTrn1 := models.NewTransaction(groupTrn1.Name, groupTrn1.Kind, groupTrn1.Category, groupTrn1.Amount/2, groupTrn1.Date, user1.ID)
	groupTrnTrn1.GroupTransactionID = null.IntFrom(int64(groupTrn1.ID))
	groupTrnTrn1.Save()
	groupTransactionUser4 := models.NewGroupTransactionUsers(user4.ID, groupTrn1.ID, false, false)
	groupTransactionUser4.Save(false)

	//Run Tests
	code := m.Run()

	//Teardown
	database.Get().Exec(`TRUNCATE TABLE users, transactions, groups, group_invitations, group_transaction_users, group_transactions, user_groups RESTART IDENTITY CASCADE`)
	database.Close()

	//Exit Tests
	os.Exit(code)
}
