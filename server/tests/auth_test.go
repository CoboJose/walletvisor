package tests

import (
	"fmt"
	"net/http/httptest"
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
	body := strings.NewReader(fmt.Sprintf(`{"email":"%s","password":"%s"}`, "user2@test.com", password))
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

/////////
// JWT //
/////////
func TestTokenOk(t *testing.T) {
	token, _, _ := utils.GenerateTokens(user1.Id, user1.Email, user1.Role)
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"user/profile", nil)
	req.Header.Set("token", token)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 200, rec.Code)
	assert.Contains(t, rec.Body.String(), "name")
}
func TestNoToken(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"user/profile", nil)
	e.ServeHTTP(rec, req)

	assert.Equal(t, 400, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU005")
}
func TestBadToken(t *testing.T) {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", host+"user/profile", nil)
	req.Header.Set("token", "badToken")
	e.ServeHTTP(rec, req)

	assert.Equal(t, 401, rec.Code)
	assert.Contains(t, rec.Body.String(), "AU009")
}
