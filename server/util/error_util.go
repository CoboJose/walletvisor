package util

func GenerateError(errorCode string) map[string]string {
	return map[string]string{
		"errorCode": errorCode,
		"message":   errorMessages[errorCode],
	}
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

	// User
	"US000": "There is no user with that id",
}
