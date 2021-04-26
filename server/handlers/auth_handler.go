package handlers

import (
	"server/models/user"
	"server/util"

	"github.com/labstack/echo"
)

type AuthHandler struct{}

//Signup creates the user and return a token to access
func (h AuthHandler) Signup(c echo.Context) error {

	// Get Request Data
	payload, errCode := getAuthPayload(c)
	if errCode != "" {
		return c.JSON(400, util.GenerateError(errCode))
	}

	// Create the user
	user := user.NewUser(payload.Email, payload.Password, payload.Email, "user")
	if errCode := user.Save(); errCode != "" {
		return c.JSON(400, util.GenerateError(errCode))
	}

	// Create the token
	token, refreshToken, expiresIn, errCode := util.GenerateTokens(payload.Email, "user")
	if errCode != "" {
		return c.JSON(500, util.GenerateError(errCode))
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
		return c.JSON(400, util.GenerateError(errCode))
	}

	_, errCode = user.Authenticate(payload.Email, payload.Password)
	if errCode != "" {
		return c.JSON(400, util.GenerateError(errCode))
	}

	token, refreshToken, expiresIn, errCode := util.GenerateTokens(payload.Email, "user")
	if errCode != "" {
		return c.JSON(400, util.GenerateError(errCode))
	}

	response := map[string]interface{}{
		"email":        payload.Email,
		"token":        token,
		"expiresIn":    expiresIn,
		"refreshToken": refreshToken,
	}

	return c.JSON(200, response)
}

/*
//RefreshToken takes a refresh token and return a pair of new tokens
func (h AuthHandler) RefreshToken(c echo.Context) error {

	//Get token
	token := c.Request().Header.Get("Authorization")

	//Validate token and get claims
	claims, err := util.ValidateToken(token)
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
		return c.JSON(400, util.GenerateError(errCode))
	}

	token, refreshToken, expiresIn, errCode := util.GenerateTokens(email, role)
	if errCode != "" {
		return c.JSON(400, util.GenerateError(errCode))
	}

	response := map[string]interface{}{
		"email":        email,
		"token":        token,
		"expiresIn":    expiresIn,
		"refreshToken": refreshToken,
	}

	return c.JSON(200, response)
}
*/
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
