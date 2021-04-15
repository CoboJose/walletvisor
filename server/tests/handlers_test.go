package tests

import (
	"database/sql"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"server/database"
	userdb "server/database/user"
	"server/handlers"
	"strings"
	"testing"

	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
)

var (
	h  = &handlers.Handler{}
	db *sql.DB
)

func TestMain(m *testing.M) {
	//Setup
	database.InitTestDB()
	db = database.DB
	db.Exec(`INSERT INTO users(name, email, password, role) values("user1", "user1@test.com", "$2a$10$ZKGybbkMU6l0Cq3/GcKvP.sCLZIthpAOWmx.1l1VmnurCJHzwL8zO", "user")`)
	//Run Tests
	code := m.Run()
	//Teardown
	db.Exec(`DROP TABLE users`)
	db.Close()
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

	if assert.NoError(t, h.Login(c)) {
		assert.Equal(t, 200, rec.Code)
		assert.Contains(t, rec.Body.String(), "email")
		assert.Contains(t, rec.Body.String(), "expiresIn")
		assert.Contains(t, rec.Body.String(), "refreshToken")
		assert.Contains(t, rec.Body.String(), "token")
	}
}
func TestLoginBadPayload(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(`{"email":"user1@test.com"`))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.Login(c)) {
		assert.Equal(t, 400, rec.Code)
		assert.Contains(t, rec.Body.String(), "GE001")
	}
}
func TestLoginNoAccount(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(`{"email":"user100@test.com","password":"c0mplexPa$$"}`))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.Login(c)) {
		assert.Equal(t, 400, rec.Code)
		assert.Contains(t, rec.Body.String(), "AU001")
	}
}

func TestLoginBadPassword(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(`{"email":"user1@test.com","password":"badPass"}`))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.Login(c)) {
		assert.Equal(t, 401, rec.Code)
		assert.Contains(t, rec.Body.String(), "AU002")
	}
}

////////////
// SIGNUP //
////////////
func TestSignupOk(t *testing.T) {
	email := "user2@test.com"
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(fmt.Sprintf(`{"email":"%s","password":"c0mplexPa$$"}`, email)))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.Signup(c)) {
		_, user := userdb.GetUserByEmail(email)
		assert.Equal(t, 201, rec.Code)
		assert.Equal(t, user.Email, email)
		assert.Contains(t, rec.Body.String(), "email")
		assert.Contains(t, rec.Body.String(), "expiresIn")
		assert.Contains(t, rec.Body.String(), "msg")
		assert.Contains(t, rec.Body.String(), "refreshToken")
		assert.Contains(t, rec.Body.String(), "token")
	}
}
func TestSignupBadPayload(t *testing.T) {
	email := "user2@test.com"
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(fmt.Sprintf(`{"email":"%s"}`, email)))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.Signup(c)) {
		assert.Equal(t, 400, rec.Code)
		assert.Contains(t, rec.Body.String(), "GE002")
	}
}
func TestSignupNoPayload(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", nil)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.Signup(c)) {
		assert.Equal(t, 400, rec.Code)
		assert.Contains(t, rec.Body.String(), "GE001")
	}
}
func TestSignupInvalidEmail(t *testing.T) {
	email := "user2test.com"
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(fmt.Sprintf(`{"email":"%s","password":"c0mplexPa$$"}`, email)))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.Signup(c)) {
		assert.Equal(t, 400, rec.Code)
		assert.Contains(t, rec.Body.String(), "AU003")
	}
}
func TestSignupInvalidPass(t *testing.T) {
	email := "user2@test.com"
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(fmt.Sprintf(`{"email":"%s","password":"c0mplexPass"}`, email)))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.Signup(c)) {
		assert.Equal(t, 400, rec.Code)
		assert.Contains(t, rec.Body.String(), "AU004")
	}
}
func TestSignupAlreadyExists(t *testing.T) {
	email := "user1@test.com"
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(fmt.Sprintf(`{"email":"%s","password":"c0mplexPa$$"}`, email)))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.Signup(c)) {
		assert.Equal(t, 400, rec.Code)
		assert.Contains(t, rec.Body.String(), "AU000")
	}
}
