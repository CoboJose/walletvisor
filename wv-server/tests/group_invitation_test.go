package tests

import (
	"fmt"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"
	"wv-server/models"

	"github.com/stretchr/testify/assert"
)

/////////
// GET //
/////////
func TestGetGroupGroupInvitationsOk(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"groupinvitations/group?groupId="+strconv.Itoa(group1.ID), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "user1@test.com")
	assert.Contains(t, rec.Body.String(), "user2@test.com")
}

func TestGetUserGroupInvitationsOk(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"groupinvitations/user", nil)
	req.Header.Set("token", user2Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "user1@test.com")
	assert.Contains(t, rec.Body.String(), "user2@test.com")
}

////////////
// CREATE //
////////////
func TestCreateGroupInvitationOk(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s", "groupId":%d}`, user3.Email, group1.ID))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"groupinvitations/create", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "id")
	assert.Contains(t, rec.Body.String(), "invitedUserId")
	assert.Contains(t, rec.Body.String(), strconv.Itoa(user3.ID))
}

func TestCreateGroupInvitationNotExistingUser(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s", "groupId":%d}`, "bad@email.com", group1.ID))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"groupinvitations/create", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "US001")
}

func TestCreateGroupInvitationAlreadyInvitedUser(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s", "groupId":%d}`, user2.Email, group1.ID))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"groupinvitations/create", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GI002")
}

//////////
// JOIN //
//////////
func TestJoinGroupInvitationOk(t *testing.T) {
	group := models.NewGroup("GroupTest", "#000000")
	group.Save()
	userGroup1 := models.NewUserGroup(user1.ID, group.ID)
	userGroup1.Save()
	groupInvitation := models.NewGroupInvitation(user2.ID, user1.ID, group.ID)
	groupInvitation.Save()
	groups, _ := models.GetGroupsByUserId(user2.ID)
	groupsLength := len(groups)

	body := strings.NewReader(fmt.Sprintf(`{"id":%d, "invitedUserId":%d, "inviterUserId":%d, "groupId":%d}`, groupInvitation.ID, user2.ID, user1.ID, group.ID))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"groupinvitations/join", body)
	req.Header.Set("token", user2Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "Joined successfully")
	// Group appearing for the invited user
	groups, _ = models.GetGroupsByUserId(user2.ID)
	assert.Equal(t, groupsLength+1, len(groups))
}

////////////
// DELETE //
////////////
func TestDeleteGroupInvitationOk(t *testing.T) {
	group := models.NewGroup("GroupTest", "#000000")
	group.Save()
	userGroup1 := models.NewUserGroup(user1.ID, group.ID)
	userGroup1.Save()
	groupInvitation := models.NewGroupInvitation(user2.ID, user1.ID, group.ID)
	groupInvitation.Save()
	groupsInvitations, _ := models.GetGroupInvitationsByInvitedUserIdAndGroupId(user2.ID, group.ID)
	groupsInvitationsLength := len(groupsInvitations)

	rec := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", host+"groupinvitations/delete?groupInvitationId="+strconv.Itoa(groupInvitation.ID), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "Group Invitation deleted succesfully")
	groupsInvitations, _ = models.GetGroupInvitationsByInvitedUserIdAndGroupId(user2.ID, group.ID)
	assert.Equal(t, groupsInvitationsLength-1, len(groupsInvitations))
}
