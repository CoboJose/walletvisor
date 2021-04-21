package handler

import (
	"server/utils"

	"github.com/labstack/echo"
)

type UserHandler struct{}

//Profile returns the profile of the user
func (h UserHandler) Profile(c echo.Context) error {

	//Get token
	token := c.Request().Header.Get("Authorization")

	//Validate token and get claims
	claims, err := utils.ValidateToken(token)
	if err != nil {
		return c.JSON(401, err.Error())
	}
	email := claims["email"].(string)

	// Get user
	user, errCode := userdb.GetUserByEmail(email)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	response := map[string]interface{}{
		"userId": user.UserId,
		"name":   user.Name,
		"email":  user.Email,
	}

	return c.JSON(200, response)
}
