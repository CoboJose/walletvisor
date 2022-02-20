package tests

import (
	"fmt"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"
	"wv-server/models"

	"github.com/stretchr/testify/assert"
	"gopkg.in/guregu/null.v3"
)

/////////
// GET //
/////////
func TestGetUserGroupsOk(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"groups", nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "Group1")
	assert.Contains(t, rec.Body.String(), "users")
	assert.Contains(t, rec.Body.String(), "balance")
}

////////////
// CREATE //
////////////
func TestCreateGroupOk(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"id":-1, "name":"%s", "color":"%s"}`, "groupCreated", "#000000"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"groups", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "groupCreated")
}

func TestCreateGroupBadPayload(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"id":-1, "name":"%s", "color":"%s"}`, "groupCreated", "#0000"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"groups", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GR001")
}

////////////
// UPDATE //
////////////
func TestUpdateGroupOk(t *testing.T) {
	// Create the group
	groupUpdate := models.NewGroup("groupUpdate", "#000000")
	groupUpdate.Save()

	body := strings.NewReader(fmt.Sprintf(`{"id":%d, "name":"%s", "color":"%s"}`, groupUpdate.ID, "groupUpdated", "#ffffff"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"groups", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "groupUpdated")
	groupUpdate.Delete()
}

func TestUpdateGroupBadId(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"id":%d, "name":"%s", "color":"%s"}`, 999, "groupUpdated", "#ffffff"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"groups", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GE000")
}

////////////
// DELETE //
////////////
func TestDeleteGroupOk(t *testing.T) {
	// Create the group
	groupDelete := models.NewGroup("groupDelete", "#000000")
	groupDelete.Save()
	userGroup1 := models.NewUserGroup(user1.ID, groupDelete.ID)
	userGroup1.Save()
	userGroup2 := models.NewUserGroup(user2.ID, groupDelete.ID)
	userGroup2.Save()
	groupTransaction := models.NewGroupTransaction("groupTrn", "income", "salary", 100, 1800000000, groupDelete.ID)
	groupTransaction.Save()
	groupTransactionUser := models.NewGroupTransactionUsers(user1.ID, groupTransaction.ID, true, true)
	groupTransactionUser.Save(false)
	trn := models.NewTransaction(groupTransaction.Name, groupTransaction.Kind, groupTransaction.Category, 50., groupTransaction.Date, user1.ID)
	trn.GroupTransactionID = null.IntFrom(int64(groupTransaction.ID))
	trn.Save()

	// Prechecks
	groups, _ := models.GetGroupsByUserId(user1.ID)
	groupsLength := len(groups)
	trns, _ := models.GetUserTransactions(user1.ID, 0, 9999999999)
	assert.Equal(t, true, trns[len(trns)-1].GroupTransactionID.Valid)

	rec := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", host+"groups?groupId="+strconv.Itoa(groupDelete.ID), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "Group deleted succesfully")
	// Group not appearing for the user
	groups, _ = models.GetGroupsByUserId(user1.ID)
	assert.Equal(t, groupsLength-1, len(groups))
	// Transaction groupTransactionId null
	trns, _ = models.GetUserTransactions(user1.ID, 0, 9999999999)
	assert.Equal(t, false, trns[len(trns)-1].GroupTransactionID.Valid)
	trns[len(trns)-1].Delete()
}

func TestRemoveUserOk(t *testing.T) {
	// Create the group
	groupDelete := models.NewGroup("groupRemove", "#000000")
	groupDelete.Save()
	userGroup1 := models.NewUserGroup(user1.ID, groupDelete.ID)
	userGroup1.Save()
	userGroup2 := models.NewUserGroup(user2.ID, groupDelete.ID)
	userGroup2.Save()

	// Prechecks
	groups1, _ := models.GetGroupsByUserId(user1.ID)
	groupsLength1 := len(groups1)
	groups2, _ := models.GetGroupsByUserId(user2.ID)
	groupsLength2 := len(groups2)

	rec := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", host+"groups/removeuser?groupId="+strconv.Itoa(groupDelete.ID)+"&userId="+strconv.Itoa(user2.ID), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "User removed succesfully")
	// Group not appearing for the removed user
	groups2, _ = models.GetGroupsByUserId(user2.ID)
	assert.Equal(t, groupsLength2-1, len(groups2))
	// Group appearing for the other user
	groups1, _ = models.GetGroupsByUserId(user1.ID)
	assert.Equal(t, groupsLength1, len(groups1))
}
