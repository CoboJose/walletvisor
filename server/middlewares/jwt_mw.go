package middlewares

import (
	"server/utils"
	"strings"

	"github.com/labstack/echo"
)

//ValidToken checks if its a valid token with valid type and role
func ValidToken(roles string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Get token
			token := c.Request().Header.Get("token")
			if token == "" || token == "null" {
				return c.JSON(400, utils.NewCerr("AU005", nil).Response())
			}

			// Validate token and get claims. Already validates that the secret is correct and it is not expired
			claims, cerr := utils.ParseToken(token)
			if cerr != nil {
				return c.JSON(401, cerr.Response())
			}

			// Should be an access token
			if claims.Type != "access" {
				return c.JSON(403, utils.NewCerr("AU010", nil).Response())
			}

			// Token roles should contain the received param
			if !strings.Contains(claims.Role, roles) {
				return c.JSON(403, utils.NewCerr("AU007", nil).Response())
			}

			// Set the claims in the context to access them in the handlers
			c.Set("claims", claims)

			return next(c)
		}
	}
}
