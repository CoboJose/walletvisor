package handlers

import (
	"wv-server/models"
	"wv-server/utils"

	"github.com/labstack/echo"
	"golang.org/x/crypto/bcrypt"
)

// UserHandler holds all the user handlers
type UserHandler struct{}

// Get returns the the user of the provided token, hiding the password
func (h UserHandler) Get(c echo.Context) error {
	// Get user
	userID := c.Get("claims").(utils.JwtClaims).UserID
	user, cerr := models.GetUserByID(userID)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	user.Password = ""

	return c.JSON(200, user)
}

// Update updates the user, returning it after the operation
func (h UserHandler) Update(c echo.Context) error {
	// Get the user payload from the body
	updatePayload := &updatePayload{}
	if err := c.Bind(&updatePayload); err != nil {
		return c.JSON(400, utils.NewCerr("GE002", err).Response())
	}

	// Get Database user
	dbUser, cerr := models.GetUserByID(c.Get("claims").(utils.JwtClaims).UserID)
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

	return c.JSON(200, dbUser)
}

type updatePayload struct {
	Email       string `json:"email" binding:"required"`
	OldPassword string `json:"oldPassword" binding:"required"`
	NewPassword string `json:"newPassword"`
	Name        string `json:"name" binding:"required"`
}
