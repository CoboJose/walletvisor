package handlers

import (
	"server/models"
	"server/utils"

	"github.com/labstack/echo"
)

type TransactionHandler struct{}

//CreateTransaction creates a transaction
func (h TransactionHandler) CreateTransaction(c echo.Context) error {
	// Get the transaction from the body
	trn := &models.Transaction{}
	if err := c.Bind(&trn); err != nil {
		return c.JSON(400, utils.NewCerr("GE002", err).Response())
	}

	// Set the userId from the token
	claims := c.Get("claims").(utils.JwtClaims)
	trn.UserId = claims.UserId

	// Save the transaction to the database
	if cerr := trn.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, trn)
}
