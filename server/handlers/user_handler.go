package handlers

import (
	"server/models"
	"server/utils"

	"github.com/labstack/echo"
)

type UserHandler struct{}

//Profile returns the profile of the user
func (h UserHandler) Profile(c echo.Context) error {
	claims := c.Get("claims").(utils.JwtClaims)

	// Get user
	user, errCode := models.GetUserById(claims.UserId)
	if errCode != "" {
		return c.JSON(400, utils.GenerateError(errCode))
	}
	user.Password = ""

	response := map[string]interface{}{
		"user": user,
	}

	return c.JSON(200, response)
}
