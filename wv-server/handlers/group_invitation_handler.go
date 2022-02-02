package handlers

import (
	"errors"
	"strconv"
	"wv-server/models"
	"wv-server/utils"

	"github.com/labstack/echo"
)

// GroupHandler holds all the groups handlers
type GroupInvitationHandler struct{}

// GetGroupInvitations returns all the groupInvitations for the group provided
func (h GroupInvitationHandler) GetGroupInvitations(c echo.Context) error {
	groupId, err := strconv.Atoi(c.QueryParam("groupId"))
	if err != nil {
		return c.JSON(400, utils.NewCerr("GE001", errors.New("could not get the groupId from the request")).Response())
	}

	// Get the groups invitations of that group from the database
	groupInvitations, cerr := models.GetGroupInvitationsByGroupId(groupId)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	response := []GroupInvitationResponse{}
	for _, gi := range groupInvitations {
		// Get the Groups Names
		group, cerr := models.GetGroupByID(gi.GroupId)
		if cerr != nil {
			return c.JSON(400, utils.NewCerr("GE000", nil))
		}
		// Get the Invited User
		invitedUser, cerr := models.GetUserByID(gi.InvitedUserId)
		if cerr != nil {
			return c.JSON(400, utils.NewCerr("GE000", nil))
		}
		// Get the Inviter User
		inviterUser, cerr := models.GetUserByID(gi.InviterUserId)
		if cerr != nil {
			return c.JSON(400, utils.NewCerr("GE000", nil))
		}

		response = append(response, GroupInvitationResponse{
			ID:               gi.ID,
			InvitedUserId:    gi.InvitedUserId,
			InvitedUserEmail: invitedUser.Email,
			InvitedUserName:  invitedUser.Name,
			InviterUserId:    gi.InviterUserId,
			InviterUserEmail: inviterUser.Email,
			InviterUserName:  inviterUser.Name,
			GroupId:          gi.GroupId,
			GroupName:        group.Name,
		})
	}

	return c.JSON(200, response)
}

// GetUserInvitations returns all the groupInvitations for the logged user
func (h GroupInvitationHandler) GetUserInvitations(c echo.Context) error {
	// Get the userId from the token
	userID := c.Get("claims").(utils.JwtClaims).UserID

	// Get the groups invitations of that group from the database
	groupInvitations, cerr := models.GetGroupInvitationsByUserId(userID)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	response := []GroupInvitationResponse{}
	for _, gi := range groupInvitations {
		// Get the Groups Names
		group, cerr := models.GetGroupByID(gi.GroupId)
		if cerr != nil {
			return c.JSON(400, utils.NewCerr("GE000", nil))
		}
		// Get the Invited User
		invitedUser, cerr := models.GetUserByID(gi.InvitedUserId)
		if cerr != nil {
			return c.JSON(400, utils.NewCerr("GE000", nil))
		}
		// Get the Inviter User
		inviterUser, cerr := models.GetUserByID(gi.InviterUserId)
		if cerr != nil {
			return c.JSON(400, utils.NewCerr("GE000", nil))
		}

		response = append(response, GroupInvitationResponse{
			ID:               gi.ID,
			InvitedUserId:    gi.InvitedUserId,
			InvitedUserEmail: invitedUser.Email,
			InvitedUserName:  invitedUser.Name,
			InviterUserId:    gi.InviterUserId,
			InviterUserEmail: inviterUser.Email,
			InviterUserName:  inviterUser.Name,
			GroupId:          gi.GroupId,
			GroupName:        group.Name,
		})
	}

	return c.JSON(200, response)
}

// JoinGroup joins in the logged user in the passed group
func (h GroupInvitationHandler) JoinGroup(c echo.Context) error {
	// Get the createGroupRequest from the body
	groupInvitation, cerr := getGroupInvitationPayload(c)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Create userGroup (intermediate Table)
	userGroup := models.NewUserGroup(groupInvitation.InvitedUserId, groupInvitation.GroupId)
	if cerr = userGroup.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Delete the transaction in the database
	if cerr := groupInvitation.Delete(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(200, "Joined successfully")
}

// CreatetGroupInvitation creates a groupInvitation
func (h GroupInvitationHandler) CreateGroupInvitation(c echo.Context) error {
	// Get the createGroupRequest from the body
	groupInvitationPayload, cerr := getCreateInvitationPayload(c)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Get the invitedUser
	invitedUser, cerr := models.GetUserByEmail(groupInvitationPayload.Email)
	if cerr != nil {
		return c.JSON(400, utils.NewCerr("US001", errors.New("no user found with that email")).Response())
	}

	// Get the userId from the token and the groupId
	userId := c.Get("claims").(utils.JwtClaims).UserID

	// Create the Group Invitation
	groupInvitation := models.NewGroupInvitation(invitedUser.ID, userId, groupInvitationPayload.GroupId)
	if cerr = groupInvitation.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, groupInvitation)
}

//Delete deletes a groupInvitation
func (h GroupInvitationHandler) Delete(c echo.Context) error {
	// Get the groupInvitation id from the query
	groupInvitationID, err := strconv.Atoi(c.QueryParam("groupInvitationId"))
	if err != nil {
		return c.JSON(400, utils.NewCerr("GE001", errors.New("could not get the groupInvitationId from the request")).Response())
	}

	groupInvitation := models.GroupInvitation{ID: groupInvitationID}

	// Delete the transaction in the database
	if cerr := groupInvitation.Delete(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, "Group Invitation deleted succesfully")
}

/////////////
// HELPERS //
/////////////

func getCreateInvitationPayload(c echo.Context) (*createInvitationPayload, *utils.Cerr) {
	createInvitationPayload := new(createInvitationPayload)
	err := c.Bind(&createInvitationPayload)
	if err != nil {
		return nil, utils.NewCerr("GE001", err)
	}
	if createInvitationPayload.Email == "" || createInvitationPayload.GroupId == 0 {
		return nil, utils.NewCerr("GE002", nil)
	}
	return createInvitationPayload, nil
}

func getGroupInvitationPayload(c echo.Context) (*models.GroupInvitation, *utils.Cerr) {
	groupInvitationPayload := new(models.GroupInvitation)
	err := c.Bind(&groupInvitationPayload)
	if err != nil {
		return nil, utils.NewCerr("GE001", err)
	}
	if groupInvitationPayload.InviterUserId == 0 || groupInvitationPayload.GroupId == 0 {
		return nil, utils.NewCerr("GE002", nil)
	}
	return groupInvitationPayload, nil
}

///////////////////
// Request Types //
///////////////////
type createInvitationPayload struct {
	Email   string `json:"email" binding:"required"`
	GroupId int    `json:"groupId" binding:"required"`
}

////////////////////
// Response Types //
////////////////////
type GroupInvitationResponse struct {
	ID               int    `json:"id"`
	InvitedUserId    int    `json:"invitedUserId"`
	InvitedUserEmail string `json:"invitedUserEmail"`
	InvitedUserName  string `json:"invitedUserName"`
	InviterUserId    int    `json:"inviterUserId"`
	InviterUserEmail string `json:"inviterUserEmail"`
	InviterUserName  string `json:"inviterUserName"`
	GroupId          int    `json:"groupId"`
	GroupName        string `json:"groupName"`
}
