package tests

import (
	"net/http"
	"net/http/httptest"
	"os"
	"server/database"
	"server/handlers"
	"server/models/user"
	"strings"
	"testing"

	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
)

var (
	authHandler = &handlers.AuthHandler{}
)

func TestMain(m *testing.M) {
	//Setup
	u1 := user.NewUser("user1@test.com", "c0mplexPa$$", "user1", "user")
	u1.Save()
	//Run Tests
	code := m.Run()
	//Teardown
	database.Get().Exec(`TRUNCATE TABLE users`)
	database.Close()
	//Exit Tests
	os.Exit(code)
}

///////////
// LOGIN //
///////////
func TestLoginOk(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(`{"email":"user1@test.com","password":"c0mplexPa$$"}`))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, authHandler.Login(c)) {
		assert.Equal(t, 200, rec.Code)
		assert.Contains(t, rec.Body.String(), "email")
		assert.Contains(t, rec.Body.String(), "expiresIn")
		assert.Contains(t, rec.Body.String(), "refreshToken")
		assert.Contains(t, rec.Body.String(), "token")
	}
}
