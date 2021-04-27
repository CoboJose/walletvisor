package utils

import (
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

const (
	TOKEN_EXPIRES_MINUTES      = 15
	REFRESH_TOKEN_EXPIRES_DAYS = 180
)

type JwtClaims struct {
	UserId int    `json:"userId"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	Type   string `json:"type"`
	jwt.StandardClaims
}

func GenerateTokens(userId int, email string, role string) (token string, refreshToken string, errCode string) {
	// TOKEN
	claims := JwtClaims{UserId: userId, Email: email, Role: role, Type: "access", StandardClaims: jwt.StandardClaims{
		ExpiresAt: time.Now().Add(time.Minute * time.Duration(TOKEN_EXPIRES_MINUTES)).Unix(), Issuer: "walletvisor"}}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := t.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", "", "GE000"
	}

	//REFRESH TOKEN
	rClaims := JwtClaims{UserId: userId, Email: email, Role: role, Type: "refresh", StandardClaims: jwt.StandardClaims{
		ExpiresAt: time.Now().Add(time.Hour * time.Duration(REFRESH_TOKEN_EXPIRES_DAYS*24)).Unix(), Issuer: "walletvisor"}}

	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rClaims)
	refreshToken, err = rt.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", "", "GE000"
	}

	return token, refreshToken, ""
}

// ParseToken validates the token (secret and expiration) and return the claims
func ParseToken(token string) (claims JwtClaims, errCode string) {
	//Get claims and also validate the token (Expiration, Secret, Integrity...)
	parsedToken, err := jwt.ParseWithClaims(token, &JwtClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		if err.Error() == "Token is expired" {
			return JwtClaims{}, "AU008"
		} else {
			return JwtClaims{}, "AU009"
		}
	}
	c, _ := parsedToken.Claims.(*JwtClaims)

	return *c, ""
}