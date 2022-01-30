package handlers

import (
	"wv-server/models"
	"wv-server/utils"

	"github.com/labstack/echo"
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

	return c.JSON(200, groups)
}

// Create creates a transaction
func (h GroupHandler) CreateGroup(c echo.Context) error {
	// Get the createGroupRequest from the body
	group, cerr := getCreateGroupPayload(c)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Create the group
	if cerr = group.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Get the userId from the token and the groupId
	userId := c.Get("claims").(utils.JwtClaims).UserID
	groupId := group.ID

	// Create userGroup (intermediate Table)
	userGroup := models.NewUserGroup(userId, groupId)
	if cerr = userGroup.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, group)
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

/*func createMultipleGroupInvitations(emails []string, userId int, groupId int) *utils.Cerr {
	for _, email := range emails {
		user, cerr := models.GetUserByEmail(email)
		if cerr == nil {
			groupInvitation := models.NewGroupInvitation(user.ID, userId, groupId)
			if cerr = groupInvitation.Save(); cerr != nil {
				return cerr
			}
		}
	}
	return nil
}*/

///////////////////
// Request Types //
///////////////////

////////////////////
// Response Types //
////////////////////
