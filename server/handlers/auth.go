package handlers

import (
	"fmt"
	"regexp"
	userdb "server/database/user"
	"server/utils"
	"time"
	"unicode"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"golang.org/x/crypto/bcrypt"
)

const TOKEN_EXPIRES_MINUTES = 15
const REFRESH_TOKEN_EXPIRES_HOURS = 720

//Signup creates the user and return a token to access
func (h *Handler) Signup(c echo.Context) error {

	// Get Request Data
	errCode, payload := getAuthPayload(c)
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
	errCode, token, refreshToken := generateTokens(payload.Email, "user")
	if errCode != "" {
		return c.JSON(500, utils.GenerateError(errCode))
	}

	response := map[string]interface{}{
		"email":        payload.Email,
		"token":        token,
		"expiresIn":    TOKEN_EXPIRES_MINUTES,
		"refreshToken": refreshToken,
		"msg":          "User created succesfully",
	}

	return c.JSON(201, response)
}

//Login creates the user and return a token to access
func (h *Handler) Login(c echo.Context) error {

	// Get Data
	errCode, payload := getAuthPayload(c)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	// Check in your db if the user exists or not
	errCode, dbPassword, role := userdb.GetPasswordAndRoleFromEmail(payload.Email)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}
	if err := bcrypt.CompareHashAndPassword([]byte(dbPassword), []byte(payload.Password)); err != nil {
		return c.JSON(401, utils.GenerateError("AU002"))
	}

	errCode, token, refreshToken := generateTokens(payload.Email, role)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	response := map[string]interface{}{
		"email":        payload.Email,
		"token":        token,
		"expiresIn":    TOKEN_EXPIRES_MINUTES,
		"refreshToken": refreshToken,
	}

	return c.JSON(200, response)
}

//RefreshToken takes a refresh token and return a pair of new tokens
func (h *Handler) RefreshToken(c echo.Context) error {

	//Get token
	token := c.Request().Header.Get("Authorization")

	//Validate token and get claims
	err, claims := utils.ValidateToken(token)
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

	errCode, token, refreshToken := generateTokens(email, role)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	response := map[string]interface{}{
		"email":        email,
		"token":        token,
		"expiresIn":    TOKEN_EXPIRES_MINUTES,
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

func getAuthPayload(c echo.Context) (string, *authPayload) {

	authPayload := new(authPayload)
	if err := c.Bind(&authPayload); err != nil {
		return "GE001", nil
	}

	if authPayload.Email == "" || authPayload.Password == "" {
		return "GE002", nil
	}

	return "", authPayload
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

const secret = "feHBE%&656nfw1&=)"

func generateTokens(email, role string) (errCode string, token string, refreshToken string) {

	// TOKEN
	t := jwt.New(jwt.SigningMethodHS256)
	claims := t.Claims.(jwt.MapClaims)
	claims["email"] = email
	claims["role"] = role
	claims["exp"] = time.Now().Add(time.Minute * time.Duration(TOKEN_EXPIRES_MINUTES)).Unix()

	token, err := t.SignedString([]byte(secret))
	if err != nil {
		return "GE000", "", ""
	}

	//REFRESH TOKEN
	rt := jwt.New(jwt.SigningMethodHS256)
	rtClaims := rt.Claims.(jwt.MapClaims)
	rtClaims["email"] = email
	rtClaims["exp"] = time.Now().Add(time.Hour * time.Duration(REFRESH_TOKEN_EXPIRES_HOURS)).Unix()

	refreshToken, err = rt.SignedString([]byte(secret))
	if err != nil {
		return "GE000", "", ""
	}

	return "", token, refreshToken
}
