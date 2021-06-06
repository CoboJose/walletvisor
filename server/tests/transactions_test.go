package tests

import (
	"fmt"
	"math"
	"net/http/httptest"
	"server/models"
	"strconv"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

/////////
// GET //
/////////
func TestGetAllTransactionsOk(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"transactions?from="+strconv.Itoa(1)+"&to="+strconv.Itoa(math.MaxInt64), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "trn1")
	assert.Contains(t, rec.Body.String(), "trn2")
	assert.NotContains(t, rec.Body.String(), "trn3")
}
func TestGetTransactionsDateOk(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"transactions?from="+strconv.Itoa(1600000000)+"&to="+strconv.Itoa(1600050000), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "trn1")
	assert.NotContains(t, rec.Body.String(), "trn2")
}
func TestGetTransactionsBadParameters(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"transactions?from="+strconv.Itoa(1600000000), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GE001")
}

////////////
// CREATE //
////////////
func TestCreateTransactionOk(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"name":"%s", "kind":"%s", "category":"%s", "amount":%d, "date":%d}`, "trnCreated", "expense", "home", 16, 1625097600))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"transactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "trnCreated")
}
func TestCreateTransactionBadPayload(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"name":null, "kind":"%s", "category":"%s", "amount":%d, "date":%d}`, "expense", "home", 16, 1625097600))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"transactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GE003")
}
func TestCreateTransactionBadKind(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"name":"%s", "kind":"%s", "category":"%s", "amount":%d, "date":%d}`, "trnCreated", "bad", "home", 16, 1625097600))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"transactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "TR000")
}
func TestCreateTransactionBadCategory(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"name":"%s", "kind":"%s", "category":"%s", "amount":%d, "date":%d}`, "trnCreated", "expense", "bad", 16, 1625097600))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"transactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "TR000")
}
func TestCreateTransactionCategoryNoMatchKind(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"name":"%s", "kind":"%s", "category":"%s", "amount":%d, "date":%d}`, "trnCreated", "expense", "salary", 16, 1625097600))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"transactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "TR000")
}
func TestCreateTransactionNegativeAmount(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"name":"%s", "kind":"%s", "category":"%s", "amount":%d, "date":%d}`, "trnCreated", "expense", "food", -16, 1625097600))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"transactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "TR000")
}

////////////
// UPDATE //
////////////
func TestUpdateTransactionOk(t *testing.T) {
	// Create the transaction
	trnUpdate := models.NewTransaction("trnUpdate", "income", "salary", 100, 1800000000, user1.ID)
	trnUpdate.Save()

	body := strings.NewReader(fmt.Sprintf(`{"id":%d, "name":"%s", "kind":"%s", "category":"%s", "amount":%d, "date":%d, "userId":%d}`, trnUpdate.ID, "trnUpdated", "expense", "home", 16, 1625097600, user1.ID))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"transactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "trnUpdated")
}
func TestUpdateTransactionBadId(t *testing.T) {
	// Create the transaction
	trnUpdate := models.NewTransaction("trnUpdate", "income", "salary", 100, 1800000000, user1.ID)
	trnUpdate.Save()

	body := strings.NewReader(fmt.Sprintf(`{"id":%d, "name":"%s", "kind":"%s", "category":"%s", "amount":%d, "date":%d, "userId":%d}`, 548265, "trnUpdated", "expense", "home", 16, 1625097600, user1.ID))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"transactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "TR002")
}
func TestUpdateTransactionAnotherUser(t *testing.T) {
	// Create the transaction
	trnUpdate := models.NewTransaction("trnUpdate", "income", "salary", 100, 1800000000, user2.ID)
	trnUpdate.Save()

	body := strings.NewReader(fmt.Sprintf(`{"id":%d, "name":"%s", "kind":"%s", "category":"%s", "amount":%d, "date":%d, "userId":%d}`, trnUpdate.ID, "trnUpdated", "expense", "home", 16, 1625097600, user2.ID))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"transactions", body)
	req.Header.Set("token", user1Token)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "TR002")
}

////////////
// DELETE //
////////////
func TestDeleteTransactionOk(t *testing.T) {
	// Create the transaction
	trnDelete := models.NewTransaction("trnDelete", "income", "salary", 100, 1800000000, user1.ID)
	trnDelete.Save()

	rec := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", host+"transactions?transactionId="+strconv.Itoa(trnDelete.ID), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "Transaction deleted succesfully")
}
func TestDeleteBadPayload(t *testing.T) {
	// Create the transaction
	trnDelete := models.NewTransaction("trnDelete", "income", "salary", 100, 1800000000, user1.ID)
	trnDelete.Save()

	rec := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", host+"transactions", nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GE001")
}
func TestDeleteTransactionNotExistingId(t *testing.T) {
	// Create the transaction
	trnDelete := models.NewTransaction("trnDelete", "income", "salary", 100, 1800000000, user1.ID)
	trnDelete.Save()

	rec := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", host+"transactions?transactionId="+strconv.Itoa(45128), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "TR002")
}
func TestDeleteTransactionAnotherUser(t *testing.T) {
	// Create the transaction
	trnDelete := models.NewTransaction("trnDelete", "income", "salary", 100, 1800000000, user2.ID)
	trnDelete.Save()

	rec := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", host+"transactions?transactionId="+strconv.Itoa(trnDelete.ID), nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "TR002")
}
