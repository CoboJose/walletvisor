package tests

import (
	"fmt"
	"net/http/httptest"
	"server/utils"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

/////////
// GET //
/////////
func TestGetUserOk(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"user", nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "name")
}
func TestGetUserNotExisting(t *testing.T) {
	token, _, _ := utils.GenerateTokens(100, user1.Email, user1.Role)
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"user", nil)
	req.Header.Set("token", token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "US000")
}

/////////////
// UPDATE ///
/////////////
func TestUpdateUserOk(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s", "oldPassword":"%s", "newPassword":"%s", "name":"%s"}`, "updatedEmail@email.com", password, "FakePass1$", "updatedName"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"user", body)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("token", userUpdateToken)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "updatedEmail@email.com")
}
func TestUpdateUserBadOldPassword(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s", "oldPassword":"%s", "newPassword":"%s", "name":"%s"}`, "updatedEmail@email.com", "BadPass1$", "FakePass1$", "updatedName"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"user", body)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("token", user2Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU002")
}
func TestUpdateUserBadEmail(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s", "oldPassword":"%s", "newPassword":"%s", "name":"%s"}`, "updatedEmail", password, "FakePass1$", "updatedName"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"user", body)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("token", user2Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU003")
}
func TestUpdateUserBadNewPassword(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s", "oldPassword":"%s", "newPassword":"%s", "name":"%s"}`, "updatedEmail@test.com", password, "FakePass", "updatedName"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"user", body)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("token", user2Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU004")
}
func TestUpdateUserBadPayload(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`"oldPassword":"%s", "newPassword":"%s", "name":"%s"}`, password, "FakePass", "updatedName"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"user", body)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("token", user2Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GE002")
}
