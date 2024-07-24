package handlers

import (
	"github.com/docker/docker/client"
	"github.com/gofiber/fiber/v2"
	"github.com/muhfaris/docker-ui/pkg/docker"
)

type Handler struct {
	docker *docker.Docker
	resp   func(fiber.Ctx) error
}

func New() (*Handler, error) {
	docker, err := docker.NewWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, err
	}

	return &Handler{
		docker: docker,
	}, nil
}
