package utils

import (
	"github.com/dgrijalva/jwt-go"
)

/////////////////////////////////
//////////// ERROR //////////////
/////////////////////////////////

func GenerateError(errorCode string) map[string]string {

	return map[string]string{
		"errorCode": errorCode,
		"message":   ErrorCodes[errorCode],
	}
}

const secret = "feHBE%&656nfw1&=)"

func ValidateToken(tokenString string) (err error, claims jwt.MapClaims) {

	claims = jwt.MapClaims{}

	//Validate the token (Expiration, Secret, Integrity...)
	_, err = jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	return
}
