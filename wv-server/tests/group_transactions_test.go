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

//TODO

/////////
// GET //
/////////

func TestGetAllGroupTransactionsOk(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"grouptransactions?groupId="+strconv.Itoa(group1.ID), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "groupTransaction")
	assert.Contains(t, rec.Body.String(), "userDTOs")
}

func TestGetAllGroupTransactionsBadGroupIdk(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"grouptransactions?groupId="+strconv.Itoa(999), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.NotContains(t, rec.Body.String(), "groupTransaction")
	assert.NotContains(t, rec.Body.String(), "userDTOs")
}

////////////
// CREATE //
////////////
func TestCreateGroupTransactionOk(t *testing.T) {
	groupTransaction := fmt.Sprintf(`{"id":%d, "name":"%s", "kind":"%s", "category":"%s", "amount":%d, "date":%d, "groupId":%d}`, -1, "grpTrnCreated", "expense", "home", 16, 1625097600, group1.ID)
	user1DTO := fmt.Sprintf(`{"user":{"id": %d, "email":"%s", "password":"%s", "name":"%s", "role":"%s"}, "isCreator":true, "hasPayed":true}`, user1.ID, user1.Email, user1.Password, user1.Name, user1.Role)
	user4DTO := fmt.Sprintf(`{"user":{"id": %d, "email":"%s", "password":"%s", "name":"%s", "role":"%s"}, "isCreator":true, "hasPayed":true}`, user4.ID, user4.Email, user4.Password, user4.Name, user4.Role)
	body := strings.NewReader(fmt.Sprintf(`{"groupTransaction":%s, "userDTOs":[%s, %s], "isActive":false}`, groupTransaction, user1DTO, user4DTO))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"grouptransactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "grpTrnCreated")
}

func TestCreateGroupTransactionOnlyOneUser(t *testing.T) {
	groupTransaction := fmt.Sprintf(`{"id":%d, "name":"%s", "kind":"%s", "category":"%s", "amount":%d, "date":%d, "groupId":%d}`, -1, "grpTrnCreated", "expense", "home", 16, 1625097600, group1.ID)
	user1DTO := fmt.Sprintf(`{"user":{"id": %d, "email":"%s", "password":"%s", "name":"%s", "role":"%s"}, "isCreator":true, "hasPayed":true}`, user1.ID, user1.Email, user1.Password, user1.Name, user1.Role)
	body := strings.NewReader(fmt.Sprintf(`{"groupTransaction":%s, "userDTOs":[%s], "isActive":false}`, groupTransaction, user1DTO))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"grouptransactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GT003")
}

////////////
// UPDATE //
////////////
func TestUpdateGroupTransactionOk(t *testing.T) {
	// Create the group transaction
	groupTrnUpdate := models.NewGroupTransaction("groupTrnUpdate", "income", "salary", 60, 1700000000, group1.ID)
	groupTrnUpdate.Save()
	groupTransactionUser1 := models.NewGroupTransactionUsers(user1.ID, groupTrnUpdate.ID, true, true)
	groupTransactionUser1.Save(false)
	groupTrnTrn1 := models.NewTransaction(groupTrnUpdate.Name, groupTrnUpdate.Kind, groupTrnUpdate.Category, groupTrnUpdate.Amount/2, groupTrnUpdate.Date, user1.ID)
	groupTrnTrn1.GroupTransactionID = null.IntFrom(int64(groupTrnUpdate.ID))
	groupTrnTrn1.Save()
	groupTransactionUser4 := models.NewGroupTransactionUsers(user4.ID, groupTrnUpdate.ID, false, false)
	groupTransactionUser4.Save(false)

	body := strings.NewReader(fmt.Sprintf(`{"id":%d, "name":"%s", "kind":"%s", "category":"%s", "amount":%d, "date":%d, "groupId":%d}`, groupTrnUpdate.ID, "grpTrnUpdated", "expense", "home", 16, 1625097600, group1.ID))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"grouptransactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "grpTrnUpdated")
	groupTrnTrn1, _ = models.GetTransactionByID(groupTrnTrn1.ID, user1.ID)
	assert.Equal(t, "grpTrnUpdated", groupTrnTrn1.Name)
}

func TestUpdateGroupTransactionNotActive(t *testing.T) {
	// Create the group transaction
	groupTrnUpdate := models.NewGroupTransaction("groupTrnUpdate", "income", "salary", 60, 1700000000, group1.ID)
	groupTrnUpdate.Save()
	groupTransactionUser1 := models.NewGroupTransactionUsers(user1.ID, groupTrnUpdate.ID, true, true)
	groupTransactionUser1.Save(false)
	groupTrnTrn1 := models.NewTransaction(groupTrnUpdate.Name, groupTrnUpdate.Kind, groupTrnUpdate.Category, groupTrnUpdate.Amount/2, groupTrnUpdate.Date, user1.ID)
	groupTrnTrn1.GroupTransactionID = null.IntFrom(int64(groupTrnUpdate.ID))
	groupTrnTrn1.Save()
	groupTransactionUser4 := models.NewGroupTransactionUsers(user4.ID, groupTrnUpdate.ID, false, true)
	groupTransactionUser4.Save(false)

	body := strings.NewReader(fmt.Sprintf(`{"id":%d, "name":"%s", "kind":"%s", "category":"%s", "amount":%d, "date":%d, "groupId":%d}`, groupTrnUpdate.ID, "grpTrnUpdated", "expense", "home", 16, 1625097600, group1.ID))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"grouptransactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GT004")
}

func TestPayGroupTransactionOk(t *testing.T) {
	// Create the group transaction
	groupTrnPay := models.NewGroupTransaction("groupTrnPay", "income", "salary", 60, 1700000000, group1.ID)
	groupTrnPay.Save()
	groupTransactionUser1 := models.NewGroupTransactionUsers(user1.ID, groupTrnPay.ID, true, true)
	groupTransactionUser1.Save(false)
	groupTrnTrn1 := models.NewTransaction(groupTrnPay.Name, groupTrnPay.Kind, groupTrnPay.Category, groupTrnPay.Amount/2, groupTrnPay.Date, user1.ID)
	groupTrnTrn1.GroupTransactionID = null.IntFrom(int64(groupTrnPay.ID))
	groupTrnTrn1.Save()
	groupTransactionUser4 := models.NewGroupTransactionUsers(user4.ID, groupTrnPay.ID, false, false)
	groupTransactionUser4.Save(false)

	body := strings.NewReader(fmt.Sprintf(`{"id":%d, "name":"%s", "kind":"%s", "category":"%s", "amount":%f, "date":%d, "groupId":%d}`, groupTrnPay.ID, groupTrnPay.Name, groupTrnPay.Kind, groupTrnPay.Category, groupTrnPay.Amount, groupTrnPay.Date, groupTrnPay.GroupId))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"grouptransactions/pay", body)
	req.Header.Set("token", user4Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "Group Transaction payed succesfully")
	groupTransactionUser4, _ = models.GetGroupTransactionUsersByUserIdAndGroupTransactionId(user4.ID, groupTrnPay.ID)
	assert.Equal(t, true, groupTransactionUser4.IsPayed)
}

////////////
// DELETE //
////////////
func TestDeleteGroupTransactionOk(t *testing.T) {
	// Create the group transaction
	groupTrnDelete := models.NewGroupTransaction("groupTrnDelete", "income", "salary", 60, 1700000000, group1.ID)
	groupTrnDelete.Save()
	groupTransactionUser1 := models.NewGroupTransactionUsers(user1.ID, groupTrnDelete.ID, true, true)
	groupTransactionUser1.Save(false)
	groupTrnTrn1 := models.NewTransaction(groupTrnDelete.Name, groupTrnDelete.Kind, groupTrnDelete.Category, groupTrnDelete.Amount/2, groupTrnDelete.Date, user1.ID)
	groupTrnTrn1.GroupTransactionID = null.IntFrom(int64(groupTrnDelete.ID))
	groupTrnTrn1.Save()
	groupTransactionUser4 := models.NewGroupTransactionUsers(user4.ID, groupTrnDelete.ID, false, false)
	groupTransactionUser4.Save(false)

	rec := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", host+"grouptransactions?groupTransactionId="+strconv.Itoa(groupTrnDelete.ID), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "Group Transaction deleted succesfully")
}

func TestDeleteGroupTransactionActive(t *testing.T) {
	// Create the group transaction
	groupTrnDelete := models.NewGroupTransaction("groupTrnDelete", "income", "salary", 60, 1700000000, group1.ID)
	groupTrnDelete.Save()
	groupTransactionUser1 := models.NewGroupTransactionUsers(user1.ID, groupTrnDelete.ID, true, true)
	groupTransactionUser1.Save(false)
	groupTrnTrn1 := models.NewTransaction(groupTrnDelete.Name, groupTrnDelete.Kind, groupTrnDelete.Category, groupTrnDelete.Amount/2, groupTrnDelete.Date, user1.ID)
	groupTrnTrn1.GroupTransactionID = null.IntFrom(int64(groupTrnDelete.ID))
	groupTrnTrn1.Save()
	groupTransactionUser4 := models.NewGroupTransactionUsers(user4.ID, groupTrnDelete.ID, false, true)
	groupTransactionUser4.Save(false)

	rec := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", host+"grouptransactions?groupTransactionId="+strconv.Itoa(groupTrnDelete.ID), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GT004")
}
