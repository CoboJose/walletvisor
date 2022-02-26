package handlers

import (
	"errors"
	"strconv"
	"wv-server/models"
	"wv-server/utils"

	"github.com/labstack/echo"
	"gopkg.in/guregu/null.v3"
)

// GroupTransactionHandler holds all the group transactions handlers
type GroupTransactionHandler struct{}

// Get returns all the transactions made in a group
func (h GroupTransactionHandler) Get(c echo.Context) error {
	// Get groupID from query
	groupID, err := strconv.Atoi(c.QueryParam("groupId"))
	if err != nil {
		return c.JSON(400, utils.NewCerr("GE001", errors.New("could not parse the query params")).Response())
	}

	// Get the group transactions from the database
	groupTrns, cerr := models.GetGroupTransactionsByGroupId(groupID)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	response := []groupTransactionDTO{}
	for _, groupTrn := range groupTrns {
		// Get the group transactions users from the database
		users, cerr := models.GetUsersByGroupTransactionId(groupTrn.ID)
		if cerr != nil {
			return c.JSON(400, cerr.Response())
		}

		groupTrnUsers := []groupTransactionUsersDTO{}
		for _, u := range users {
			u.Password = ""

			// Get Creator And Payed
			groupTrnUser, cerr := models.GetGroupTransactionUsersByUserIdAndGroupTransactionId(u.ID, groupTrn.ID)
			if cerr != nil {
				return c.JSON(400, cerr.Response())
			}

			groupTrnUsers = append(groupTrnUsers, groupTransactionUsersDTO{
				User:      u,
				IsCreator: groupTrnUser.IsCreator,
				HasPayed:  groupTrnUser.IsPayed,
			})
		}

		groupTransactionDTO := groupTransactionDTO{
			GroupTransaction: groupTrn,
			UserDTOs:         groupTrnUsers,
			IsActive:         groupTrn.IsActive(),
		}

		response = append(response, groupTransactionDTO)
	}

	return c.JSON(200, response)
}

// Create creates a groupTransaction
func (h GroupTransactionHandler) Create(c echo.Context) error {
	// Get the createGroupTransactionRequest from the body
	groupTrnDTO, cerr := getGroupTransactionDTOPayload(c)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}
	// Get the userId from the token
	claims := c.Get("claims").(utils.JwtClaims)
	creatingUserID := claims.UserID

	groupTrn := groupTrnDTO.GroupTransaction
	usersDTO := groupTrnDTO.UserDTOs

	// There should be at least 2 members in the group
	if len(usersDTO) < 2 {
		return c.JSON(400, utils.NewCerr("GT003", errors.New("there should be at least two users in the group to create a groupTransaction")).Response())
	}

	// Create the group Transaction
	if cerr = groupTrn.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Create the groupTransactionUsers join tables
	for _, userDTO := range usersDTO {
		isCreator := userDTO.User.ID == creatingUserID
		groupTransactionUsers := models.NewGroupTransactionUsers(userDTO.User.ID, groupTrn.ID, isCreator, isCreator)
		if cerr = groupTransactionUsers.Save(false); cerr != nil {
			return c.JSON(400, cerr.Response())
		}
	}

	// Create the Transaction
	amount := utils.Round(groupTrn.Amount/float64(len(usersDTO)), 2)
	trn := models.NewTransaction(groupTrn.Name, groupTrn.Kind, groupTrn.Category, amount, groupTrn.Date, creatingUserID)
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
	if !groupTrn.IsActive() {
		return c.JSON(400, utils.NewCerr("GT004", errors.New("only active groupTransactions can be updated")).Response())
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

	return c.JSON(201, groupTrn)
}

//Pay pays a group transaction
func (h GroupTransactionHandler) Pay(c echo.Context) error {
	// Get the GroupTransactionRequest from the body
	groupTrn, cerr := getGroupTransactionPayload(c)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}
	// Get the userId from the token
	claims := c.Get("claims").(utils.JwtClaims)
	payingUserID := claims.UserID

	// Only active groupTransactions can be payed
	if !groupTrn.IsActive() {
		return c.JSON(400, utils.NewCerr("GT004", errors.New("only active groupTransactions can be payed")).Response())
	}

	// Update the groupTransactionUsers for the user
	groupTransactionUser, cerr := models.GetGroupTransactionUsersByUserIdAndGroupTransactionId(payingUserID, groupTrn.ID)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}
	groupTransactionUser.IsPayed = true
	if cerr = groupTransactionUser.Save(true); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Create the Transaction
	users, cerr := models.GetNumberOfUsersByGroupTransactionId(groupTrn.ID)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}
	amount := utils.Round(groupTrn.Amount/float64(users), 2)
	trn := models.NewTransaction(groupTrn.Name, groupTrn.Kind, groupTrn.Category, amount, groupTrn.Date, payingUserID)
	trn.GroupTransactionID = null.IntFrom(int64(groupTrn.ID))
	if cerr = trn.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, "Group Transaction payed succesfully")
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
	if !groupTrn.IsActive() {
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

func getGroupTransactionDTOPayload(c echo.Context) (*groupTransactionDTO, *utils.Cerr) {
	payload := new(groupTransactionDTO)
	err := c.Bind(&payload)
	if err != nil {
		return nil, utils.NewCerr("GE001", err)
	}
	if payload.GroupTransaction.ID == 0 || len(payload.UserDTOs) == 0 {
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
type groupTransactionDTO struct {
	GroupTransaction models.GroupTransaction    `json:"groupTransaction"`
	UserDTOs         []groupTransactionUsersDTO `json:"userDTOs"`
	IsActive         bool                       `json:"isActive"`
}

type groupTransactionUsersDTO struct {
	User      models.User `json:"user"`
	IsCreator bool        `json:"isCreator"`
	HasPayed  bool        `json:"hasPayed"`
}
