package middlewares

import (
	"net/http"
	"server/utils"
	"strings"

	"github.com/labstack/echo"
)

//CheckToken checks if its a valid token with correct type and role
func CheckToken(role string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			//Get token
			token := c.Request().Header.Get("Authorization")

			//Validate token and get claims
			claims, err := utils.ValidateToken(token)
			if err != nil {
				c.JSON(http.StatusUnauthorized, err.Error())
				return echo.ErrUnauthorized
			}

			//Token roles should contain the received param
			if !strings.Contains(claims["roles"].(string), role) {
				c.JSON(http.StatusUnauthorized, "This user has not access to this site")
				return echo.ErrUnauthorized
			}

			return next(c)
		}
	}
}

//APIKey checks if the valid API Key is provided
func APIKey(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		apiKey := c.Request().Header.Get("APIKey")
		if apiKey != "apikey" {
			c.JSON(http.StatusUnauthorized, "Incorrect API KEY, if you want to get it contact with: cobogue@gmail.com")
			return echo.ErrUnauthorized
		}

		return next(c)
	}
}
