package handlers

import (
	"fmt"
	"server/models"
	"server/utils"

	"github.com/labstack/echo"
	"golang.org/x/crypto/bcrypt"
)

type UserHandler struct{}

// Get returns the the user of the provided token, hiding the password
func (h UserHandler) Get(c echo.Context) error {
	// Get user
	userId := c.Get("claims").(utils.JwtClaims).UserId
	user, cerr := models.GetUserById(userId)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	user.Password = ""

	response := map[string]interface{}{
		"user": user,
	}

	return c.JSON(200, response)
}

// Get returns the the user of the provided token, hiding the password
func (h UserHandler) Update(c echo.Context) error {
	// Get the user payload from the body
	updatePayload := &updatePayload{}
	if err := c.Bind(&updatePayload); err != nil {
		return c.JSON(400, utils.NewCerr("GE002", err).Response())
	}
	fmt.Println(updatePayload.NewPassword)

	// Get Database user
	dbUser, cerr := models.GetUserById(c.Get("claims").(utils.JwtClaims).UserId)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	// Check old password
	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(updatePayload.OldPassword)); err != nil {
		return c.JSON(400, utils.NewCerr("AU002", err).Response())
	}

	// Save the changes to the database
	dbUser.Email = updatePayload.Email
	dbUser.Name = updatePayload.Name
	if updatePayload.NewPassword != "" {
		dbUser.Password = updatePayload.NewPassword
	} else {
		dbUser.Password = updatePayload.OldPassword
	}
	if cerr := dbUser.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	dbUser.Password = ""
	response := map[string]interface{}{
		"user": dbUser,
	}

	return c.JSON(200, response)
}

type updatePayload struct {
	Email       string `json:"email" binding:"required"`
	OldPassword string `json:"oldPassword" binding:"required"`
	NewPassword string `json:"newPassword"`
	Name        string `json:"name" binding:"required"`
}
