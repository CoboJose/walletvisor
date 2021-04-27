package middlewares

import (
	"server/utils"

	"github.com/labstack/echo"
)

func Logger(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		utils.RequestLog.Println(c.Request().RemoteAddr + " " + c.Request().Method + " " + c.Request().URL.String())

		return next(c)
	}
}
