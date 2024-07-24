package handlers

import "github.com/gofiber/fiber/v2"

type Response struct {
	Data    any    `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
	Message string `json:"message,omitempty"`
}

func (h *Handler) success(c *fiber.Ctx, status int, data any) error {
	return c.Status(status).JSON(Response{
		Data: data,
	})
}

func (h *Handler) failed(c *fiber.Ctx, status int, err error, msg string) error {
	return c.Status(status).JSON(Response{
		Error:   err.Error(),
		Message: msg,
	})
}
