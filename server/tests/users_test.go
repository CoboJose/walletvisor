package tests

import (
	"fmt"
	"net/http/httptest"
	"server/models"
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
	// Create user
	userUpdate := models.NewUser("userUpdate@test.com", password, "userUpdate", "user")
	userUpdate.Save()
	userUpdateToken, _, _ := utils.GenerateTokens(userUpdate.Id, userUpdate.Email, userUpdate.Role)

	body := strings.NewReader(fmt.Sprintf(`{"email":"%s", "oldPassword":"%s", "newPassword":"%s", "name":"%s"}`, "updatedEmail@email.com", password, "FakePass1$", "updatedName"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("PUT", host+"user", body)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("token", userUpdateToken)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "updatedEmail@email.com")
}
