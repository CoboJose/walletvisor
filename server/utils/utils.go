package utils

import (
	"os"

	"github.com/dgrijalva/jwt-go"
)

/////////////////////////////////
//////////// TOKEN //////////////
/////////////////////////////////

func ValidateToken(tokenString string) (err error, claims jwt.MapClaims) {

	claims = jwt.MapClaims{}

	//Validate the token (Expiration, Secret, Integrity...)
	_, err = jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET")), nil
	})

	return
}
