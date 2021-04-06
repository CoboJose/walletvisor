package handlers

import (
	"fmt"
	userdb "server/database/user"
	"server/utils"

	"github.com/labstack/echo"
)

//Profile returns the profile of the user
func (h *Handler) Profile(c echo.Context) error {

	//Get token
	token := c.Request().Header.Get("Authorization")

	//Validate token and get claims
	err, claims := utils.ValidateToken(token)
	if err != nil {
		return c.JSON(401, err.Error())
	}
	email := claims["email"].(string)

	// Get user
	errCode, user := userdb.GetUserByEmail(email)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}

	fmt.Println(user)

	return c.JSON(200, user)
}
