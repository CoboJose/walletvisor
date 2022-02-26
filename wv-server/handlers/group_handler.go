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
type GroupHandler struct{}

// GetUserGroups returns all the groups where the user efined in the token belongs
func (h GroupHandler) GetUserGroups(c echo.Context) error {
	// Get the userId from the token
	userId := c.Get("claims").(utils.JwtClaims).UserID

	// Get the groups from the database
	groups, cerr := models.GetGroupsByUserId(userId)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	response := []groupDTO{}
	for _, group := range groups {
		// Get the group users from the database
		users, cerr := models.GetUsersByGroupId(group.ID)
		if cerr != nil {
			return c.JSON(400, cerr.Response())
		}
		for i := range users {
			users[i].Password = ""
		}

		// Get the balance of the group for the logged user
		balance := 0.0
		groupTrns, cerr := models.GetGroupTransactionsByGroupId(group.ID)
		if cerr != nil {
			return c.JSON(400, cerr.Response())
		}
		for _, groupTrn := range groupTrns {
			if groupTrn.IsActive() {
				isCreator := false
				payingRemaining := 0

				groupTrnUsers, cerr := models.GetGroupTransactionUsersByGroupTransactionId(groupTrn.ID)
				if cerr != nil {
					return c.JSON(400, cerr.Response())
				}

				isUserParticipating := false
				for _, groupTrnUser := range groupTrnUsers {
					if groupTrnUser.UserId == userId {
						isUserParticipating = true
					}
					if groupTrnUser.UserId == userId && groupTrnUser.IsCreator {
						isCreator = true
					}
					if !groupTrnUser.IsPayed {
						payingRemaining++
					}
				}

				oweAmount := (groupTrn.Amount / float64(len(users))) * float64(payingRemaining)

				if isUserParticipating {
					if isCreator {
						balance += oweAmount
					} else {
						balance -= oweAmount
					}
				}
			}
		}

		response = append(response, groupDTO{Group: group, Users: users, Balance: utils.Round(balance, 2)})
	}

	return c.JSON(200, response)
}

// Create creates a group
func (h GroupHandler) Create(c echo.Context) error {
	// Get the createGroupRequest from the body
	group, cerr := getCreateGroupPayload(c)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Create the group
	if cerr = group.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Get the userID from the token and the groupId
	userID := c.Get("claims").(utils.JwtClaims).UserID
	groupID := group.ID

	// Create userGroup (intermediate Table)
	userGroup := models.NewUserGroup(userID, groupID)
	if cerr = userGroup.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, group)
}

//Update updates a group
func (h GroupHandler) Update(c echo.Context) error {
	// Get the group from the body
	group := &models.Group{}
	if err := c.Bind(&group); err != nil {
		return c.JSON(400, utils.NewCerr("GE002", err).Response())
	}

	// Update the group in the database
	if cerr := group.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, group)
}

//Delete deletes a group
func (h GroupHandler) Delete(c echo.Context) error {
	// Get the group id from the query
	groupID, err := strconv.Atoi(c.QueryParam("groupId"))
	if err != nil {
		return c.JSON(400, utils.NewCerr("GE001", errors.New("could not get the groupId from the request")).Response())
	}

	if cerr := deleteGroup(groupID); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, "Group deleted succesfully")
}

//RemoveUser remove the user from a group
func (h GroupHandler) RemoveUser(c echo.Context) error {
	// Get the group id from the query
	groupId, err := strconv.Atoi(c.QueryParam("groupId"))
	if err != nil {
		return c.JSON(400, utils.NewCerr("GE001", errors.New("could not get the groupId from the request")).Response())
	}
	// Get the user id from the query
	userId, err := strconv.Atoi(c.QueryParam("userId"))
	if err != nil {
		return c.JSON(400, utils.NewCerr("GE001", errors.New("could not get the userId from the request")).Response())
	}

	// If this is the last user of the group, delete it, else, remove the user
	groupUsers, cerr := models.GetUsersByGroupId(groupId)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}
	if len(groupUsers) == 1 && groupUsers[0].ID == userId {
		if cerr := deleteGroup(groupId); cerr != nil {
			return c.JSON(400, cerr.Response())
		}
	} else {
		// Delete the UserGroups Join Tables
		userGroup, cerr := models.GetUserGroupByID(userId, groupId)
		if cerr != nil {
			return c.JSON(400, cerr.Response())
		}
		if cerr := userGroup.Delete(); cerr != nil {
			return c.JSON(400, cerr.Response())
		}
		// Delete the user from the Active Group Transactions
		groupTransactions, cerr := models.GetActiveGroupTransactionsByUserIdAndGroupId(userId, groupId)
		if cerr != nil {
			return c.JSON(400, cerr.Response())
		}
		for _, gt := range groupTransactions {
			// Delete the User GroupTransactionUsers Join Tables
			groupTransactionsUsersTable, cerr := models.GetGroupTransactionUsersByUserIdAndGroupTransactionId(userId, gt.ID)
			if cerr != nil {
				return c.JSON(400, cerr.Response())
			}
			if cerr := groupTransactionsUsersTable.Delete(); cerr != nil {
				return c.JSON(400, cerr.Response())
			}
			// Delete the transactions for the user
			transactions, cerr := models.GetTransactionsByUserIdAndGroupTransactionId(userId, gt.ID)
			if cerr != nil {
				return c.JSON(400, cerr.Response())
			}
			for _, t := range transactions {
				if cerr := t.Delete(); cerr != nil {
					return c.JSON(400, cerr.Response())
				}
			}
			// Update the transactions amounts for the remaining users
			transactions, cerr = models.GetTransactionsByGroupTransactionId(gt.ID)
			if cerr != nil {
				return c.JSON(400, cerr.Response())
			}
			// Get the users participating in that groupTransaction
			users, cerr := models.GetUsersByGroupTransactionId(gt.ID)
			if cerr != nil {
				return c.JSON(400, cerr.Response())
			}
			for _, t := range transactions {
				t.Amount = utils.Round(gt.Amount/float64(len(users)), 2)
				if cerr := t.Save(); cerr != nil {
					return c.JSON(400, cerr.Response())
				}
			}
		}
	}

	return c.JSON(201, "User removed succesfully")
}

/////////////
// HELPERS //
/////////////

func getCreateGroupPayload(c echo.Context) (*models.Group, *utils.Cerr) {
	createGroupPayload := new(models.Group)
	err := c.Bind(&createGroupPayload)
	if err != nil {
		return nil, utils.NewCerr("GE001", err)
	}
	if createGroupPayload.Name == "" || createGroupPayload.Color == "" {
		return nil, utils.NewCerr("GE002", nil)
	}
	return createGroupPayload, nil
}

func deleteGroup(groupID int) *utils.Cerr {
	group := models.Group{ID: groupID}

	// Delete the UserGroups Join Tables
	userGroups, cerr := models.GetUserGroupsByGroupId(group.ID)
	if cerr != nil {
		return cerr
	}
	for _, ug := range userGroups {
		if cerr := ug.Delete(); cerr != nil {
			return cerr
		}
	}

	// Delete the Group Invitations
	groupInvitations, cerr := models.GetGroupInvitationsByGroupId(group.ID)
	if cerr != nil {
		return cerr
	}
	for _, gi := range groupInvitations {
		if cerr := gi.Delete(); cerr != nil {
			return cerr
		}
	}

	// Delete the Group Transactions
	groupTransactions, cerr := models.GetGroupTransactionsByGroupId(group.ID)
	if cerr != nil {
		return cerr
	}
	for _, gt := range groupTransactions {
		// Delete the active Group Transactions Transactions
		if gt.IsActive() {
			transactions, cerr := models.GetTransactionsByGroupTransactionId(gt.ID)
			if cerr != nil {
				return cerr
			}
			for _, t := range transactions {
				if cerr := t.Delete(); cerr != nil {
					return cerr
				}
			}
		} else {
			// Set the group_transaction_id in the inactive groupTransactions Transactions to null
			transactions, cerr := models.GetTransactionsByGroupTransactionId(gt.ID)
			if cerr != nil {
				return cerr
			}
			for _, t := range transactions {
				t.GroupTransactionID = null.IntFromPtr(nil)
				if cerr := t.Save(); cerr != nil {
					return cerr
				}
			}
		}

		// Delete the GroupTransactionUsers Join Tables
		groupTransactionsUsers, cerr := models.GetGroupTransactionUsersByGroupTransactionId(gt.ID)
		if cerr != nil {
			return cerr
		}
		for _, gtu := range groupTransactionsUsers {
			if cerr := gtu.Delete(); cerr != nil {
				return cerr
			}
		}

		// Delete the Group Transaction
		if cerr := gt.Delete(); cerr != nil {
			return cerr
		}
	}

	// Delete the group in the database
	if cerr := group.Delete(); cerr != nil {
		return cerr
	}

	return nil
}

///////////
// Types //
///////////

type groupDTO struct {
	Group   models.Group  `json:"group"`
	Users   []models.User `json:"users"`
	Balance float64       `json:"balance"`
}
