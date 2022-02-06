package handlers

import (
	"errors"
	"strconv"
	"wv-server/models"
	"wv-server/utils"

	"github.com/labstack/echo"
	"gopkg.in/guregu/null.v3"
)

// GroupHandler holds all the groups handlers
type GroupTransactionHandler struct{}

// GetUserTransactions returns all the transactions amde by the user defined in the token
func (h GroupTransactionHandler) Get(c echo.Context) error {
	// Get groupId from query
	groupId, err := strconv.Atoi(c.QueryParam("groupId"))
	if err != nil {
		return c.JSON(400, utils.NewCerr("GE001", errors.New("could not parse the query params")).Response())
	}

	// Get the group transactions from the database
	groupTrns, cerr := models.GetGroupTransactionsByGroupId(groupId)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	response := []groupTransactionWithUsers{}
	for _, groupTrn := range groupTrns {
		// Get the group transactions users from the database
		users, cerr := models.GetUsersByGroupTransactionId(groupTrn.ID)
		if cerr != nil {
			return c.JSON(400, cerr.Response())
		}
		for _, u := range users {
			u.Password = ""
		}
		response = append(response, groupTransactionWithUsers{GroupTransaction: groupTrn, Users: users})
	}

	return c.JSON(200, response)
}

// Create creates a groupTransaction
func (h GroupTransactionHandler) Create(c echo.Context) error {
	// Get the createGroupTransactionRequest from the body
	groupTrnWithUsers, cerr := getGroupTransactionWithUsersPayload(c)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}
	// Get the userId from the token
	claims := c.Get("claims").(utils.JwtClaims)
	creatingUserId := claims.UserID

	groupTrn := groupTrnWithUsers.GroupTransaction
	users := groupTrnWithUsers.Users

	// There should be at least 2 members in the group
	if len(users) < 2 {
		return c.JSON(400, utils.NewCerr("GT003", errors.New("there should be at least two users in the group to create a groupTransaction")).Response())
	}

	// Create the group Transaction
	groupTrn.Active = true
	if cerr = groupTrn.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Create the groupTransactionUsers join tables
	for _, user := range users {
		groupTransactionUsers := models.NewGroupTransactionUsers(user.ID, groupTrn.ID)
		if cerr = groupTransactionUsers.Save(); cerr != nil {
			return c.JSON(400, cerr.Response())
		}
	}

	// Create the Transaction
	amount := utils.Round(groupTrn.Amount/float64(len(users)), 2)
	trn := models.NewTransaction(groupTrn.Name, groupTrn.Kind, groupTrn.Category, amount, groupTrn.Date, creatingUserId)
	trn.GroupTransactionID = null.IntFrom(int64(groupTrn.ID))
	if cerr = trn.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, groupTrn)
}

//Update updates a group transaction
func (h GroupTransactionHandler) Update(c echo.Context) error {
	// Get the GroupTransactionRequest from the body
	groupTrn, cerr := getGroupTransactionPayload(c)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Only active groupTransactions can be updated
	if !groupTrn.Active {
		return c.JSON(400, utils.NewCerr("GT004", errors.New("only active groupTransactions can be deleted")).Response())
	}

	// Update the generated transactions
	groupNumberOfParticipants, cerr := models.GetNumberOfUsersByGroupTransactionId(groupTrn.ID)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	trns, cerr := models.GetTransactionsByGroupTransactionId(groupTrn.ID)
	if cerr != nil {
		return c.JSON(400, utils.NewCerr("GE000", cerr.Err).Response())
	}
	for _, t := range trns {
		t.Name = groupTrn.Name
		t.Kind = groupTrn.Kind
		t.Category = groupTrn.Category
		t.Date = groupTrn.Date
		t.Amount = groupTrn.Amount / float64(groupNumberOfParticipants)

		if cerr = t.Save(); cerr != nil {
			return c.JSON(400, cerr.Response())
		}
	}

	// Update the group transaction in the database
	if cerr := groupTrn.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, "Group Transaction updated succesfully")
}

//Delete deletes a group transaction
func (h GroupTransactionHandler) Delete(c echo.Context) error {
	// Get the group transaction id from the query
	groupTrnID, err := strconv.Atoi(c.QueryParam("groupTransactionId"))
	if err != nil {
		return c.JSON(400, utils.NewCerr("GE001", errors.New("could not get the transactionId from the request")).Response())
	}

	groupTrn, cerr := models.GetGroupTransactionByID(groupTrnID)
	if cerr != nil {
		return c.JSON(400, utils.NewCerr("GE000", cerr.Err).Response())
	}

	// Only active groupTransactions can be deleted
	if !groupTrn.Active {
		return c.JSON(400, utils.NewCerr("GT004", errors.New("only active groupTransactions can be deleted")).Response())
	}

	// Delete the generated transactions
	trns, cerr := models.GetTransactionsByGroupTransactionId(groupTrnID)
	if cerr != nil {
		return c.JSON(400, utils.NewCerr("GE000", cerr.Err).Response())
	}
	for _, t := range trns {
		if cerr := t.Delete(); cerr != nil {
			return c.JSON(400, cerr.Response())
		}
	}

	// Delete the group transaction in the database
	if cerr := groupTrn.Delete(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, "Group Transaction deleted succesfully")
}

/////////////
// HELPERS //
/////////////

func getGroupTransactionWithUsersPayload(c echo.Context) (*groupTransactionWithUsers, *utils.Cerr) {
	payload := new(groupTransactionWithUsers)
	err := c.Bind(&payload)
	if err != nil {
		return nil, utils.NewCerr("GE001", err)
	}
	if payload.GroupTransaction.ID == 0 || len(payload.Users) == 0 {
		return nil, utils.NewCerr("GE002", nil)
	}
	return payload, nil
}

func getGroupTransactionPayload(c echo.Context) (*models.GroupTransaction, *utils.Cerr) {
	payload := new(models.GroupTransaction)
	err := c.Bind(&payload)
	if err != nil {
		return nil, utils.NewCerr("GE001", err)
	}
	if payload.ID == 0 || payload.GroupId == 0 {
		return nil, utils.NewCerr("GE002", nil)
	}
	return payload, nil
}

///////////
// Types //
///////////
type groupTransactionWithUsers struct {
	GroupTransaction models.GroupTransaction `json:"groupTransaction"`
	Users            []models.User           `json:"users"`
}
