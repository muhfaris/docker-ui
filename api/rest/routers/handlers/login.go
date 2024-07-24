package handlers

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/muhfaris/docker-ui/pkg/authentication"
)

// LoginReq represents the login request payload
// @Description Login request payload
// @Description Contains the username and password for authentication
// @Description Please provide valid credentials
// @Description Use username: "testuser" and password: "testpassword"
// @Description for a successful response.
// @Description Returns JWT token upon successful login
type LoginReq struct {
	// Username is the user's login name
	Username string `json:"username"`
	// Password is the user's login password
	Password string `json:"password"`
}

// Login handles user login
// @Summary User login
// @Description Authenticates user and returns JWT token
// @Tags auth
// @Accept json
// @Produce json
// @Param login body LoginReq true "Login request"
// @Success 200 {object} map[string]any
// @Failure 400 {object} map[string]any
// @Failure 401 {object} map[string]any
// @Failure 500 {object} map[string]any
// @Router /login [post]
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
