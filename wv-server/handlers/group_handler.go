package handlers

import (
	"wv-server/models"
	"wv-server/utils"

	"github.com/labstack/echo"
)

// GroupHandler holds all the groups handlers
type GroupHandler struct{}

// Create creates a transaction
func (h GroupHandler) CreateGroup(c echo.Context) error {
	// Get the createGroupRequest from the body
	createGroupRequest, cerr := getCreateGroupPayload(c)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Create the group
	group := models.NewGroup(createGroupRequest.Name, createGroupRequest.Color)
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

	// Create Group Invitations if emails presents
	if cerr = createMultipleGroupInvitations(createGroupRequest.InvitedEmails, userId, groupId); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, "Group created succesfully")
}

/////////////
// HELPERS //
/////////////

func getCreateGroupPayload(c echo.Context) (*createGroupRequest, *utils.Cerr) {
	createGroupPayload := new(createGroupRequest)
	err := c.Bind(&createGroupPayload)
	if err != nil {
		return nil, utils.NewCerr("GE001", err)
	}
	if createGroupPayload.Name == "" || createGroupPayload.Color == "" {
		return nil, utils.NewCerr("GE002", nil)
	}
	return createGroupPayload, nil
}

func createMultipleGroupInvitations(emails []string, userId int, groupId int) *utils.Cerr {
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
}

///////////////////
// Request Types //
///////////////////
type createGroupRequest struct {
	Name          string   `json:"name" binding:"required"`
	Color         string   `json:"color" binding:"required"`
	InvitedEmails []string `json:"invitedEmails"`
}

////////////////////
// Response Types //
////////////////////
