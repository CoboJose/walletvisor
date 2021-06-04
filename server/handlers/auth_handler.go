package handlers

import (
	"server/models"
	"server/utils"

	"github.com/labstack/echo"
)

type AuthHandler struct{}

//Signup creates the user and return a token to access
func (h AuthHandler) Signup(c echo.Context) error {
	// Get Request Data
	payload, cerr := getAuthPayload(c)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}
	// Create the user
	user := models.NewUser(payload.Email, payload.Password, payload.Email, "user")
	if cerr = user.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Create the token
	token, refreshToken, cerr := utils.GenerateTokens(user.Id, user.Email, user.Role)
	if cerr != nil {
		return c.JSON(500, cerr.Response())
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
	payload, cerr := getAuthPayload(c)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	user, cerr := models.GetUserByAuthentication(payload.Email, payload.Password)
	if cerr != nil {
		return c.JSON(401, cerr.Response())
	}

	token, refreshToken, cerr := utils.GenerateTokens(user.Id, user.Email, user.Role)
	if cerr != nil {
		return c.JSON(500, cerr.Response())
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
		return c.JSON(400, utils.NewCerr("AU005", nil).Response())
	}

	//Validate token and get claims
	claims, cerr := utils.ParseToken(refreshToken)
	if cerr != nil {
		return c.JSON(401, cerr.Response())
	}

	//Token type should be refresh, so it must not have the roles claims
	if claims.Type != "refresh" {
		return c.JSON(401, utils.NewCerr("AU006", nil).Response())
	}

	//Generate new Tokens
	user, cerr := models.GetUserById(claims.UserId)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	token, refreshToken, cerr := utils.GenerateTokens(user.Id, user.Email, user.Role)
	if cerr != nil {
		return c.JSON(500, cerr.Response())
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

// DeleteAccount deletes the acount indicated by the token userId
func (h AuthHandler) DeleteAccount(c echo.Context) error {
	// Get the userId from the token
	userId := c.Get("claims").(utils.JwtClaims).UserId

	user := models.User{Id: userId}
	if cerr := user.Delete(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, "Account deleted succesfully")
}

/////////////////
//// HELPERS ////
/////////////////

type authPayload struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func getAuthPayload(c echo.Context) (*authPayload, *utils.Cerr) {
	authPayload := new(authPayload)
	err := c.Bind(&authPayload)
	if err != nil {
		return nil, utils.NewCerr("GE001", err)
	}
	if authPayload.Email == "" || authPayload.Password == "" {
		return nil, utils.NewCerr("GE002", nil)
	}
	return authPayload, nil
}
