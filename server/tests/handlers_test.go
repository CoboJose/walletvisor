package tests

import (
	"server/handlers"
	"testing"

	"github.com/stretchr/testify/assert"
)

var (
	h = &handlers.Handler{}
)

func TestSum(t *testing.T) {
	assert.Equal(t, 1+1, 2)
}

/*
func TestLogin(t *testing.T) {
	// Setup
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/ping", strings.NewReader(userJSON))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	h := &handler{mockDB}

	// Assertions
	if assert.NoError(t, h.createUser(c)) {
		assert.Equal(t, http.StatusCreated, rec.Code)
		assert.Equal(t, userJSON, rec.Body.String())
	}
}*/
