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

///////////
// LOGIN //
///////////
func TestLoginOk(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s","password":"%s"}`, user1.Email, password))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"auth/login", body)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "token")
}
func TestLoginBadPayload(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s"}`, user1.Email))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"auth/login", body)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GE002")
}
func TestLoginNoAccount(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s","password":"%s"}`, "email100@test.com", password))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"auth/login", body)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 401, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU001")
}

func TestLoginBadPassword(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s","password":"%s"}`, user1.Email, "badPassword"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"auth/login", body)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 401, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU002")
}

////////////
// SIGNUP //
////////////
func TestSignupOk(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s","password":"%s"}`, "user99@test.com", password))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"auth/signup", body)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "token")
}
func TestSignupBadPayload(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s"}`, "user2@test.com"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"auth/signup", body)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GE002")
}
func TestSignupNoPayload(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"auth/signup", nil)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "GE001")
}
func TestSignupInvalidEmail(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s", "password":"%s"}`, "user2test.com", password))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"auth/signup", body)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU003")
}
func TestSignupInvalidPass(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s", "password":"%s"}`, "user2@test.com", "badPass"))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"auth/signup", body)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU004")
}
func TestSignupAlreadyExists(t *testing.T) {
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s", "password":"%s"}`, user1.Email, password))
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", host+"auth/signup", body)
	req.Header.Set("Content-Type", "application/json")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU000")
}

////////////////////
// DELETE ACCOUNT //
////////////////////
func TestDeleteAccountOk(t *testing.T) {
	// Create user to delete
	userDel := models.NewUser("userDel@test.com", password, "userDel", "user")
	userDel.Save()
	userDelToken, _, _ := utils.GenerateTokens(userDel.ID, userDel.Email, userDel.Role)

	rec := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", host+"auth/deleteAccount", nil)
	req.Header.Set("token", userDelToken)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 201, rec.Code)
	assert.Contains(t, rec.Body.String(), "Account deleted succesfully")
}

func TestDeleteAccountNotExistingId(t *testing.T) {
	// Create user to delete
	userDelToken, _, _ := utils.GenerateTokens(99, "email@test.com", "user")

	rec := httptest.NewRecorder()
	req := httptest.NewRequest("DELETE", host+"auth/deleteAccount", nil)
	req.Header.Set("token", userDelToken)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "US000")
}

/////////
// JWT //
/////////
func TestTokenOk(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"user", nil)
	req.Header.Set("token", user1Token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "name")
}
func TestNoToken(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"user", nil)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU005")
}
func TestInvalidToken(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"user", nil)
	req.Header.Set("token", "badToken")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 401, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU009")
}
func TestTokenRefreshToken(t *testing.T) {
	_, refreshToken, _ := utils.GenerateTokens(user1.ID, user1.Email, user1.Role)
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"user", nil)
	req.Header.Set("token", refreshToken)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 403, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU010")
}
func TestTokenInvalidRol(t *testing.T) {
	token, _, _ := utils.GenerateTokens(user1.ID, user1.Email, "badRol")
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"user", nil)
	req.Header.Set("token", token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 403, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU007")
}
func TestTokenAdminRolOk(t *testing.T) {
	token, _, _ := utils.GenerateTokens(user1.ID, user1.Email, "admin")
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"user", nil)
	req.Header.Set("token", token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "name")
}
func TestRefreshTokenOk(t *testing.T) {
	_, refreshToken, _ := utils.GenerateTokens(user1.ID, user1.Email, user1.Role)
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"auth/refreshToken", nil)
	req.Header.Set("refreshToken", refreshToken)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "token")
}
func TestRefreshTokenNoRefreshToken(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"auth/refreshToken", nil)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU005")
}
func TestRefreshTokenAccessToken(t *testing.T) {
	token, _, _ := utils.GenerateTokens(user1.ID, user1.Email, user1.Role)
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"auth/refreshToken", nil)
	req.Header.Set("refreshToken", token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 401, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU006")
}
