package handlers

import (
	"net/http"
	"server/database/userdb"
	"server/utils"

	"github.com/labstack/echo"
)

type authPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

//Signup creates the user and return a token to access
func (h *Handler) Signup(c echo.Context) error {
	// Get Data
	payload := new(authPayload)
	if err := c.Bind(payload); err != nil {
		return err
	}

	userdb.CreateUser("email", "pass")

	return c.JSON(http.StatusCreated, payload)
}

//Login creates the user and return a token to access
func (h *Handler) Login(c echo.Context) error {
	// Get Data
	payload := new(authPayload)
	if err := c.Bind(payload); err != nil {
		return err
	}

	// Check in your db if the user exists or not
	if payload.Email == "user1@test.com" && payload.Password == "pass" {
		tokens, err := utils.GenerateTokens(1, "user")
		if err != nil {
			return err
		}

		tokens["test"] = "test"

		return c.JSON(http.StatusOK, tokens)
	}
	return echo.ErrUnauthorized
}

//RefreshToken takes a refresh token and return a pair of new tokens
func (h *Handler) RefreshToken(c echo.Context) error {
	//Get token
	token := c.Request().Header.Get("Authorization")
	//Validate token and get claims
	claims, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err.Error())
		return echo.ErrUnauthorized
	}

	//Token type should be refresh, so it must not have the roles claims
	if claims["roles"] != nil {
		c.JSON(http.StatusUnauthorized, "Not a refresh token")
		return echo.ErrUnauthorized
	}

	//Generate new Tokens
	//TODO: get user to get his roles

	userID := int(claims["userID"].(float64))
	tokens, err := utils.GenerateTokens(userID, "user")
	if err != nil {
		return err
	}

	tokens["test"] = "test"

	return c.JSON(http.StatusOK, tokens)
}
