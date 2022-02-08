package utils

import (
	"os"

	_ "github.com/joho/godotenv/autoload" // Load environment variables
)

// Cerr (Custom error) holds the code of an error (Defined in utils/error_util), and the error itself
type Cerr struct {
	Code string
	Err  error
}

// ErrorResponse is the response the server will emit
type ErrorResponse struct {
	Code         string `json:"code"`
	DebugMessage string `json:"debugMessage"`
	Message      string `json:"message"`
}

// NewCerr creates a new Cerr
func NewCerr(code string, err error) *Cerr {
	return &Cerr{Code: code, Err: err}
}

// Response returns the custom error in JSON format with the code messageto sent it to the client
func (cerr *Cerr) Response() ErrorResponse {
	var debugMessage string

	if (os.Getenv("DEBUG") == "true") && (cerr.Err != nil) {
		debugMessage = cerr.Err.Error()
	} else {
		debugMessage = ""
	}

	response := ErrorResponse{
		Code:         cerr.Code,
		DebugMessage: debugMessage,
		Message:      errorMessages[cerr.Code], // errorMessages[cerr.Code],
	}

	return response
}

// ToString converts the Cerr to string
func (cerr *Cerr) ToString() string {
	var errMsg string

	if cerr.Err != nil {
		errMsg = cerr.Err.Error()
	}
	return "Error: [Code: " + cerr.Code + " | Message: " + errorMessages[cerr.Code] + " | Error: " + errMsg + "]"
}

var errorMessages = map[string]string{
	// General
	"GE000": "Unexpected error, please contact with: cobogue@gmail.com",
	"GE001": "Could not parse the request",
	"GE002": "Incorrect payload",
	"GE003": "Missing values",

	// Authentication
	"AU000": "The given email is already in use",
	"AU001": "No account with the given email",
	"AU002": "Incorrect password",
	"AU003": "Invalid email",
	"AU004": "Invalid password, it must have at least one of each: lowercase, uppercase, special character, and more than 8 characters",
	"AU005": "No Token provided",
	"AU006": "Not a Refresh Token",
	"AU007": "This user is not allowed to access this site",
	"AU008": "The token has expired",
	"AU009": "Invalid token",
	"AU010": "Not an Access Token",

	// User
	"US000": "There is no user with that id",
	"US001": "There is no user with that email",

	// Transactions
	"TR000": "Invalid Transaction, check that, 1:(kind=income OR kind=expense,) 2:(If kind=income then category IN ['salary', 'business', 'gifts', 'loan', 'other']. If kind=expense then category IN ['food','home', 'shopping', 'transport', 'bills', 'leisure', 'health', 'education', 'groceries', 'sport', 'other']), 3:(amount and date >=0)",
	"TR001": "This user has not any transaction",
	"TR002": "There are no transactions with that id for that user",
	"TR003": "There are no transactions with that groupTransaction id",

	// Group
	"GR000": "There is no group with that id",
	"GR001": "Invalid color",
	"GR002": "This user has no groups",
	"GR003": "This group has no users",

	// Group Invitation
	"GI000": "There is no group invitation with that id",
	"GI001": "There are no group invitations for that group",
	"GI002": "This user is already invited in this group",
	"GI003": "There are no group invitations for that user",
	"GI004": "This user already belongs in this group",

	// Group Transactions
	"GT000": "There is no group transaction with that id",
	"GT001": "There are no group transactions in that group",
	"GT002": "Invalid Transaction, check that, 1:(kind=income OR kind=expense,) 2:(If kind=income then category IN ['salary', 'business', 'gifts', 'loan', 'other']. If kind=expense then category IN ['food','home', 'shopping', 'transport', 'bills', 'leisure', 'health', 'education', 'groceries', 'sport', 'other']), 3:(amount and date >=0)",
	"GT003": "There should be at least two users in the group to create a groupTransaction",
	"GT004": "Only active group transactions can be modified",

	// Expense Limits
	"EL000": "There is no expense limit with that id",
	"EL001": "There are no expense limits for that group id",
	"EL002": "Invalid Expense Limit, check the category is correct, or all, and the amount is greater than 0",
}
