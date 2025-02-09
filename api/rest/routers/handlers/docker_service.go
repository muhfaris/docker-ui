package handlers

import (
	"net/http"

	"github.com/docker/docker/api/types/filters"
	"github.com/gofiber/fiber/v2"
	"github.com/muhfaris/docker-ui/api/rest/routers/models"
	"github.com/muhfaris/docker-ui/pkg/utils"
)

// DockerListServices returns a list of Docker services
// @Summary List Docker services
// @Description Retrieves a list of Docker services with their details
// @Tags docker
// @Produce json
// @Param keywords query models.SearchDockerService false "Search keywords"
// @Success 200 {array} models.Service
// @Failure 500 {object} map[string]any
// @Router /docker/services [get]
func (h *Handler) DockerListServices() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		var (
			ctx         = c.Context()
			services    = []models.Service{}
			searchParam models.SearchDockerService
		)

		if err := c.QueryParser(&searchParam); err != nil {
			return err
		}

		dockerServices, err := h.docker.ListServices(ctx, filters.NewArgs())
		if err != nil {
			return c.Status(500).JSON(err)
		}

		for _, dockerService := range dockerServices {
			if len(searchParam.Keywords) > 0 {
				if exists := utils.Contains(dockerService.Spec.Name, searchParam.Keywords); !exists {
					continue
				}
			}

			tasks, err := h.docker.GetActiveTasksInfo(ctx, dockerService.Spec.Name)
			if err != nil {
				return err
			}

			service := models.Service{
				ID:       dockerService.ID,
				Name:     dockerService.Spec.Name,
				Labels:   dockerService.Spec.Labels,
				Status:   tasks.Status,
				Image:    dockerService.Spec.TaskTemplate.ContainerSpec.Image,
				Replicas: len(tasks.Tasks),
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

// DockerUpdateServices updates labels for multiple Docker services
// @Summary Update Docker service labels
// @Description Updates labels for the specified Docker services
// @Tags docker
// @Accept json
// @Produce json
// @Param services body []models.Service true "Services to update"
// @Success 200 {array} models.Service
// @Failure 400 {object} map[string]any
// @Failure 500 {object} map[string]any
// @Router /docker/services [put]
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
			err := h.docker.UpdateServiceLabel(ctx, service)
			if err != nil {
				return h.failed(c, http.StatusInternalServerError, err, err.Error())
			}
		}

		return h.success(c, http.StatusOK, services)
	}
}

// DockerUpdateStatusService updates the status of a Docker service
// @Summary Update Docker service status
// @Description Updates the status of the specified Docker service
// @Tags docker
// @Accept json
// @Produce json
// @Param service body models.StatusService true "Service to update"
// @Success 204
// @Failure 400 {object} map[string]any
// @Failure 500 {object} map[string]any
// @Router /docker/services [patch]
func (h *Handler) DockerUpdateStatusService() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		var (
			ctx     = c.Context()
			service models.StatusService
		)

		err := c.BodyParser(&service)
		if err != nil {
			return h.failed(c, http.StatusBadRequest, err, err.Error())
		}

		err = h.docker.UpdateStatusService(ctx, service.ID, service.Status)
		if err != nil {
			return h.failed(c, http.StatusInternalServerError, err, err.Error())
		}

		return h.success(c, http.StatusNoContent, nil)
	}
}
