package handlers

import (
	"server/models"
	"server/utils"

	"github.com/labstack/echo"
)

type UserHandler struct{}

// Get returns the the user of the provided token, hiding the password
func (h UserHandler) Get(c echo.Context) error {
	claims := c.Get("claims").(utils.JwtClaims)

	// Get user
	user, cerr := models.GetUserById(claims.UserId)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}
	user.Password = ""

	response := map[string]interface{}{
		"user": user,
	}

	return c.JSON(200, response)
}
