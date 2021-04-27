package handlers

import (
	"server/models/user"
	"server/utils"

	"github.com/labstack/echo"
)

type AuthHandler struct{}

//Signup creates the user and return a token to access
func (h AuthHandler) Signup(c echo.Context) error {
	// Get Request Data
	payload, errCode := getAuthPayload(c)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	// Create the user
	user := user.NewUser(payload.Email, payload.Password, payload.Email, "user")
	errCode = user.Save()
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	// Create the token
	token, refreshToken, errCode := utils.GenerateTokens(user.Id, user.Email, user.Role)
	if errCode != "" {
		return c.JSON(500, utils.GenerateError(errCode))
	}

	response := map[string]interface{}{
		"token":        token,
		"refreshToken": refreshToken,
		"expiresIn":    utils.TOKEN_EXPIRES_MINUTES,
		"name":         user.Name,
		"role":         user.Role,
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

	user, errCode := user.Authenticate(payload.Email, payload.Password)
	if errCode != "" {
		return c.JSON(401, utils.GenerateError(errCode))
	}

	token, refreshToken, errCode := utils.GenerateTokens(user.Id, user.Email, user.Role)
	if errCode != "" {
		return c.JSON(500, utils.GenerateError(errCode))
	}

	response := map[string]interface{}{
		"token":        token,
		"refreshToken": refreshToken,
		"expiresIn":    utils.TOKEN_EXPIRES_MINUTES,
		"name":         user.Name,
		"role":         user.Role,
	}

	return c.JSON(200, response)
}

//RefreshToken takes a refresh token and return a pair of new tokens
func (h AuthHandler) RefreshToken(c echo.Context) error {
	//Get token
	refreshToken := c.Request().Header.Get("refreshToken")
	if refreshToken == "" || refreshToken == "null" {
		return c.JSON(400, utils.GenerateError("AU005"))
	}

	//Validate token and get claims
	claims, errCode := utils.ParseToken(refreshToken)
	if errCode != "" {
		return c.JSON(401, utils.GenerateError(errCode))
	}

	//Token type should be refresh, so it must not have the roles claims
	if claims.Type != "refresh" {
		return c.JSON(401, utils.GenerateError("AU006"))
	}

	//Generate new Tokens
	user, errCode := user.GetUserById(1)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	token, refreshToken, errCode := utils.GenerateTokens(user.Id, user.Email, user.Role)
	if errCode != "" {
		return c.JSON(500, utils.GenerateError(errCode))
	}

	response := map[string]interface{}{
		"token":        token,
		"refreshToken": refreshToken,
		"expiresIn":    utils.TOKEN_EXPIRES_MINUTES,
		"name":         user.Name,
		"role":         user.Role,
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
	err := c.Bind(&res)
	if err != nil {
		return nil, "GE001"
	}
	if res.Email == "" || res.Password == "" {
		return nil, "GE002"
	}
	return res, ""
}
