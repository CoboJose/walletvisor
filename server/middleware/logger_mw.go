package middleware

import (
	"server/util"

	"github.com/labstack/echo"
)

func Logger(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		util.RequestLog.Println(c.Request().RemoteAddr + " " + c.Request().Method + " " + c.Request().URL.String())

		return next(c)
	}
}
