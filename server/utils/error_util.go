package utils

type Cerr struct {
	Code string
	Err  error
}

func NewCerr(code string, err error) *Cerr {
	return &Cerr{Code: code, Err: err}
}

// Response returns the custom error in JSON format with the code messageto sent it to the client
func (cerr *Cerr) Response() map[string]interface{} {
	var errMsg string
	var response map[string]interface{}

	if cerr.Err != nil {
		errMsg = cerr.Err.Error()
	}

	if true {
		response = map[string]interface{}{
			"error": map[string]interface{}{
				"code":  cerr.Code,
				"msg":   errorMessages[cerr.Code],
				"debug": errMsg,
			},
		}
	} else {
		response = map[string]interface{}{
			"error": map[string]interface{}{
				"code": cerr.Code,
				"msg":  errorMessages[cerr.Code],
			},
		}
	}

	return response
}

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
	"TR000": "Invalid Transaction, check that, 1:(kind=income OR kind=expense,) 2:(If kind=income then category IN ['salary', 'business', 'gifts', 'other']. If kind=expense then category IN ['food','home', 'shopping', 'transport', 'bills', 'entertainment', 'other']), 3:(amount and date >=0)",
}
