package handlers

import (
	"errors"
	"net/http"

	"github.com/labstack/echo"
)

//Profile returns the profile of the user
func (h *Handler) Profile(c echo.Context) error {

	c.JSON(http.StatusAccepted, "pepe")

	return errors.New("aaa")
}
