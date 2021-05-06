package tests

import (
	"net/http/httptest"
	"server/utils"
	"testing"

	"github.com/stretchr/testify/assert"
)

///////////
// Profile //
///////////
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
