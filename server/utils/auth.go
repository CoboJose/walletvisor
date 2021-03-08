package utils

import (
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
)

const secret = "feHBE%&656nfw1&=)"
const accessExpires = 15   //Minutes
const refreshExpires = 720 //Hours

//GenerateTokens Generate the access and refresh token
func GenerateTokens(userID int, roles string) (tokens map[string]string, err error) {
	//TOKEN
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["userID"] = userID
	claims["roles"] = roles
	claims["exp"] = time.Now().Add(time.Minute * time.Duration(accessExpires)).Unix()

	t, err := token.SignedString([]byte(secret))
	if err != nil {
		return
	}

	//REFRESH TOKEN
	refreshToken := jwt.New(jwt.SigningMethodHS256)
	rtClaims := refreshToken.Claims.(jwt.MapClaims)
	rtClaims["userID"] = userID
	rtClaims["exp"] = time.Now().Add(time.Hour * time.Duration(refreshExpires)).Unix()

	rt, err := refreshToken.SignedString([]byte(secret))
	if err != nil {
		return
	}

	tokens = map[string]string{
		"accessToken":  t,
		"refreshToken": rt,
		"expiresIn":    strconv.Itoa(accessExpires),
	}

	return
}

//ValidateToken validates the jwt token
func ValidateToken(tokenString string) (claims jwt.MapClaims, err error) {
	claims = jwt.MapClaims{}

	//Validate the token (Expiration, Secret, Integrity...)
	_, err = jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	return
}
