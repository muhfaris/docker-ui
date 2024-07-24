package handlers

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/muhfaris/docker-ui/pkg/authentication"
)

type LoginReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (h *Handler) Login() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		var login LoginReq

		err := c.BodyParser(&login)
		if err != nil {
			return h.failed(c, http.StatusBadRequest, err, err.Error())
		}

		if login.Username == "" || login.Password == "" {
			err := fmt.Errorf("username and password are required")
			return h.failed(c, http.StatusBadRequest, err, err.Error())
		}

		if login.Username != os.Getenv("AUTH_USERNAME") || login.Password != os.Getenv("AUTH_PASSWORD") {
			err := fmt.Errorf("invalid credentials")
			return h.failed(c, http.StatusUnauthorized, err, err.Error())
		}

		auth := authentication.New(authentication.WithUsername(login.Username))
		token, err := auth.GenerateJWT()
		if err != nil {
			return h.failed(c, http.StatusInternalServerError, err, err.Error())
		}

		result := map[string]any{
			"access_token": token,
		}

		return h.success(c, http.StatusOK, result)
	}
}
