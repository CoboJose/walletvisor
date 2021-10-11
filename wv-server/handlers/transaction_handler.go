package handlers

import (
	"errors"
	"strconv"
	"wv-server/models"
	"wv-server/utils"

	"github.com/labstack/echo"
)

// TransactionHandler holds all the transactions handlers
type TransactionHandler struct{}

// GetUserTransactions returns all the transactions amde by the user defined in the token
func (h TransactionHandler) GetUserTransactions(c echo.Context) error {
	// Get the userId from the token
	userID := c.Get("claims").(utils.JwtClaims).UserID
	// Get date range from query
	from, err := strconv.Atoi(c.QueryParam("from"))
	if err != nil {
		return c.JSON(400, utils.NewCerr("GE001", errors.New("could not parse the query params")).Response())
	}
	to, err := strconv.Atoi(c.QueryParam("to"))
	if err != nil {
		return c.JSON(400, utils.NewCerr("GE001", errors.New("could not parse the query params")).Response())
	}

	// Get the transactions from the database
	transactions, cerr := models.GetUserTransactions(userID, from, to)
	if cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(200, transactions)
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
	trn.UserID = claims.UserID

	// Save the transaction to the database
	if cerr := trn.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, trn)
}

//Update updates a transaction
func (h TransactionHandler) Update(c echo.Context) error {
	// Get the transaction from the body
	trn := &models.Transaction{}
	if err := c.Bind(&trn); err != nil {
		return c.JSON(400, utils.NewCerr("GE002", err).Response())
	}

	// Set the user_id from token
	trn.UserID = c.Get("claims").(utils.JwtClaims).UserID

	// Update the transaction in the database
	if cerr := trn.Save(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, trn)
}

//Delete deletes a transaction
func (h TransactionHandler) Delete(c echo.Context) error {
	// Get the transaction id from the query
	trnID, err := strconv.Atoi(c.QueryParam("transactionId"))
	if err != nil {
		return c.JSON(400, utils.NewCerr("GE001", errors.New("could not get the transactionId from the request")).Response())
	}

	trn := models.Transaction{ID: trnID, UserID: c.Get("claims").(utils.JwtClaims).UserID}

	// Delete the transaction in the database
	if cerr := trn.Delete(); cerr != nil {
		return c.JSON(400, cerr.Response())
	}

	return c.JSON(201, "Transaction deleted succesfully")
}
