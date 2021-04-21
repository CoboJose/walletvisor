package handler

import (
	"fmt"
	"regexp"
	"server/database"
	"server/utils"
	"unicode"

	"github.com/labstack/echo"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct{}

var userdb = &database.UserDB{}

//Signup creates the user and return a token to access
func (h AuthHandler) Signup(c echo.Context) error {

	// Get Request Data
	payload, errCode := getAuthPayload(c)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	// Validate email and password
	if errCode := validateAuthData(payload); errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	// Hash the password
	errCode, hashedPass := hashPassword(payload.Password)
	if errCode != "" {
		return c.JSON(500, utils.GenerateError(errCode))
	}

	// Create the user
	if errCode := userdb.CreateUser("name", payload.Email, hashedPass, "user"); errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	// Create the token
	token, refreshToken, expiresIn, errCode := utils.GenerateTokens(payload.Email, "user")
	if errCode != "" {
		return c.JSON(500, utils.GenerateError(errCode))
	}

	response := map[string]interface{}{
		"email":        payload.Email,
		"token":        token,
		"expiresIn":    expiresIn,
		"refreshToken": refreshToken,
		"msg":          "User created succesfully",
	}

	return c.JSON(201, response)
}

//Login creates the user and return a token to access
func (h AuthHandler) Login(c echo.Context) error {

	// Get Data
	payload, errCode := getAuthPayload(c)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	// Check in your db if the user exists or not
	errCode, dbPassword, role := userdb.GetPasswordAndRoleFromEmail(payload.Email) //GetPasswordAndRoleFromEmail(payload.Email)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}
	if err := bcrypt.CompareHashAndPassword([]byte(dbPassword), []byte(payload.Password)); err != nil {
		return c.JSON(401, utils.GenerateError("AU002"))
	}

	token, refreshToken, expiresIn, errCode := utils.GenerateTokens(payload.Email, role)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	response := map[string]interface{}{
		"email":        payload.Email,
		"token":        token,
		"expiresIn":    expiresIn,
		"refreshToken": refreshToken,
	}

	return c.JSON(200, response)
}

//RefreshToken takes a refresh token and return a pair of new tokens
func (h AuthHandler) RefreshToken(c echo.Context) error {

	//Get token
	token := c.Request().Header.Get("Authorization")

	//Validate token and get claims
	claims, err := utils.ValidateToken(token)
	if err != nil {
		return c.JSON(401, err.Error())
	}

	//Token type should be refresh, so it must not have the roles claims
	if claims["role"] != nil {
		return c.JSON(401, "{msg: Not a refresh token}")
	}

	//Generate new Tokens
	email := claims["email"].(string)
	role, errCode := userdb.GetRoleByUserEmail(email)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	token, refreshToken, expiresIn, errCode := utils.GenerateTokens(email, role)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	response := map[string]interface{}{
		"email":        email,
		"token":        token,
		"expiresIn":    expiresIn,
		"refreshToken": refreshToken,
	}

	return c.JSON(200, response)
}

/////////////////
//// HELPERS ////
/////////////////

type authPayload struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func getAuthPayload(c echo.Context) (res *authPayload, errCode string) {
	res = new(authPayload)
	if err := c.Bind(&res); err != nil {
		return nil, "GE001"
	}

	if res.Email == "" || res.Password == "" {
		return nil, "GE002"
	}

	return res, ""
}

func validateAuthData(payload *authPayload) string {

	// Email
	var emailRegex = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
	if !emailRegex.MatchString(payload.Email) {
		return "AU003"
	}

	// Password
	has_digit := false
	has_upper := false
	has_lower := false
	has_special := false
	pass_length := len(payload.Password)
	for _, value := range payload.Password {
		switch {
		case unicode.IsLower(value):
			has_digit = true
		case unicode.IsUpper(value):
			has_upper = true
		case unicode.IsNumber(value):
			has_lower = true
		case unicode.IsPunct(value) || unicode.IsSymbol(value):
			has_special = true
		}
	}
	if !(has_digit && has_upper && has_lower && has_special && pass_length >= 8) {
		return "AU004"
	}

	return ""
}

func hashPassword(password string) (string, string) {
	passwordBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println(err.Error())
		return "GE000", ""
	}

	return "", string(passwordBytes)
}
