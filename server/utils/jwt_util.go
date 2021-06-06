package utils

import (
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
)

const (
	//TokenExpiresMinutes represents the minutes that the token will be valid
	TokenExpiresMinutes = 15
	//RefreshTokenExpiresDays represents the days that the refresh token will be valid
	RefreshTokenExpiresDays = 180
)

// JwtClaims holds all the parameters stored in a jwt token
type JwtClaims struct {
	UserID int    `json:"userID"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	Type   string `json:"type"`
	jwt.StandardClaims
}

// GenerateTokens creates a jwt token and refresh token, storing in the claims the given parameters
func GenerateTokens(userId int, email string, role string) (token string, refreshToken string, cerr *Cerr) {
	// TOKEN
	claims := JwtClaims{UserID: userId, Email: email, Role: role, Type: "access", StandardClaims: jwt.StandardClaims{
		ExpiresAt: time.Now().Add(time.Minute * time.Duration(TokenExpiresMinutes)).Unix(), Issuer: "walletvisor"}}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := t.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		ErrorLog.Println(err.Error())
		return "", "", NewCerr("GE000", err)
	}

	//REFRESH TOKEN
	rClaims := JwtClaims{UserID: userId, Email: email, Role: role, Type: "refresh", StandardClaims: jwt.StandardClaims{
		ExpiresAt: time.Now().Add(time.Hour * time.Duration(RefreshTokenExpiresDays*24)).Unix(), Issuer: "walletvisor"}}

	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rClaims)
	refreshToken, err = rt.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		ErrorLog.Println(err.Error())
		return "", "", NewCerr("GE000", err)
	}

	return token, refreshToken, nil
}

// ParseToken validates the token (secret and expiration) and return the claims
func ParseToken(token string) (JwtClaims, *Cerr) {
	//Get claims and also validate the token (Expiration, Secret, Integrity...)
	parsedToken, err := jwt.ParseWithClaims(token, &JwtClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		if strings.Contains(err.Error(), "expired") {
			return JwtClaims{}, NewCerr("AU008", err)
		} else {
			return JwtClaims{}, NewCerr("AU009", err)
		}
	}
	c, _ := parsedToken.Claims.(*JwtClaims)

	return *c, nil
}
