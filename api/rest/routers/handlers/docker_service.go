package handlers

import (
	"net/http"

	"github.com/docker/docker/api/types/filters"
	"github.com/gofiber/fiber/v2"
	"github.com/muhfaris/docker-ui/api/rest/routers/models"
)

func (h *Handler) DockerListServices() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		var (
			ctx      = c.Context()
			services []models.Service
		)

		dockerServices, err := h.docker.ListServices(ctx, filters.NewArgs())
		if err != nil {
			return c.Status(500).JSON(err)
		}

		for _, dockerService := range dockerServices {
			service := models.Service{
				ID:     dockerService.ID,
				Name:   dockerService.Spec.Name,
				Labels: dockerService.Spec.Labels,
				Metadata: models.Metadata{
					CreatedAt: dockerService.CreatedAt,
					UpdatedAt: dockerService.UpdatedAt,
				},
			}

			services = append(services, service)

		}

		return h.success(c, http.StatusOK, services)
	}
}

func (h *Handler) DockerUpdateServices() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		var (
			ctx      = c.Context()
			services []models.Service
		)

		err := c.BodyParser(&services)
		if err != nil {
			return h.failed(c, http.StatusBadRequest, err, err.Error())
		}

		for _, service := range services {
			err := h.docker.UpdateServiceLabel(ctx, service.ID, service.Labels)
			if err != nil {
				return h.failed(c, http.StatusInternalServerError, err, err.Error())
			}
		}

		return h.success(c, http.StatusOK, services)
	}
}
