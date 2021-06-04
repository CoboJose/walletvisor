package handlers

import (
	"errors"
	"server/models"
	"server/utils"
	"strconv"

	"github.com/labstack/echo"
)

type TransactionHandler struct{}

// GetAll get all the transactions
func (h TransactionHandler) GetAll(c echo.Context) error {
	// Get the userId from the token
	userId := c.Get("claims").(utils.JwtClaims).UserId

	// Get the transactions from the database
	transactions, cerr := models.GetTransactions(userId)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	response := map[string]interface{}{
		"transactions": transactions,
	}

	return c.JSON(201, response)
}

// Create creates a transaction
func (h TransactionHandler) Create(c echo.Context) error {
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

	response := map[string]interface{}{
		"transaction": trn,
	}

	return c.JSON(201, response)
}

//Update updates a transaction
func (h TransactionHandler) Update(c echo.Context) error {
	// Get the transaction from the body
	trn := &models.Transaction{}
	if err := c.Bind(&trn); err != nil {
		return c.JSON(400, utils.NewCerr("GE002", err).Response())
	}

	// Set the user_id from token
	trn.UserId = c.Get("claims").(utils.JwtClaims).UserId

	// Update the transaction in the database
	if cerr := trn.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	response := map[string]interface{}{
		"transaction": trn,
	}

	return c.JSON(201, response)
}

//Delete deletes a transaction
func (h TransactionHandler) Delete(c echo.Context) error {
	// Get the transaction id from the query
	trnId, err := strconv.Atoi(c.QueryParam("transactionId"))
	if err != nil {
		return c.JSON(400, utils.NewCerr("GE001", errors.New("could not get the transactionId from the request")).Response())
	}

	trn := models.Transaction{Id: trnId, UserId: c.Get("claims").(utils.JwtClaims).UserId}

	// Delete the transaction in the database
	if cerr := trn.Delete(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, "Transaction deleted succesfully")
}
