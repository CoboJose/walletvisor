package middleware

import (
	"net/http"
	"server/util"
	"strings"

	"github.com/labstack/echo"
)

//CheckToken checks if its a valid token with correct type and role
func CheckToken(role string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			//Get token
			token := c.Request().Header.Get("Authorization")

			//Validate token and get claims. Already validates that the secret is correct and it is not expired
			claims, err := util.ValidateToken(token)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, err.Error())
			}

			//Token roles should contain the received param
			if !strings.Contains(claims["role"].(string), role) {
				c.JSON(http.StatusUnauthorized, "This user has not access to this site")
				return echo.ErrUnauthorized
			}

			return next(c)
		}
	}
}