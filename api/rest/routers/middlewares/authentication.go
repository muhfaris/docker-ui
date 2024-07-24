package middlewares

import (
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/muhfaris/docker-ui/pkg/authentication"
)

func Authentication() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		tokenHeader := c.Get("Authorization")
		if tokenHeader == "" {
			return c.Status(http.StatusUnauthorized).JSON(&fiber.Map{
				"message": "unauthorized",
			})
		}

		tokenHeaders := strings.Split(tokenHeader, " ")
		if len(tokenHeaders) != 2 || tokenHeaders[0] != "Bearer" {
			return c.Status(http.StatusUnauthorized).JSON(&fiber.Map{
				"message": "invalid format toknen",
			})
		}

		token := tokenHeaders[1]
		_, err := authentication.New().ValidateJWT(token)
		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(&fiber.Map{
				"message": "invalid token",
			})
		}
		return c.Next()
	}
}
