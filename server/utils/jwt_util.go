package utils

import (
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func GenerateTokens(email, role string) (token string, refreshToken string, expiresIn int, errCode string) {
	tokenExpires, _ := strconv.Atoi(os.Getenv("TOKEN_EXPIRES"))
	refreshTokenExpires, _ := strconv.Atoi(os.Getenv("REFRESH_TOKEN_EXPIRES"))

	// TOKEN
	t := jwt.New(jwt.SigningMethodHS256)
	claims := t.Claims.(jwt.MapClaims)
	claims["email"] = email
	claims["role"] = role
	claims["exp"] = time.Now().Add(time.Minute * time.Duration(tokenExpires)).Unix()

	token, err := t.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		return "", "", 0, "GE000"
	}

	//REFRESH TOKEN
	rt := jwt.New(jwt.SigningMethodHS256)
	rtClaims := rt.Claims.(jwt.MapClaims)
	rtClaims["email"] = email
	rtClaims["exp"] = time.Now().Add(time.Minute * time.Duration(refreshTokenExpires)).Unix()

	refreshToken, err = rt.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		return "", "", 0, ""
	}

	return token, refreshToken, tokenExpires, ""
}

func ValidateToken(tokenString string) (claims jwt.MapClaims, err error) {
	claims = jwt.MapClaims{}

	//Validate the token (Expiration, Secret, Integrity...)
	_, err = jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET")), nil
	})

	return
}
