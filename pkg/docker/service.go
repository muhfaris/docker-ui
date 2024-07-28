package docker

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/swarm"
	"github.com/muhfaris/docker-ui/api/rest/routers/models"
)

// List all services
func (d *Docker) ListServices(ctx context.Context, filters filters.Args) ([]swarm.Service, error) {
	// List all services
	services, err := d.client.ServiceList(ctx, types.ServiceListOptions{Filters: filters})
	if err != nil {
		return nil, fmt.Errorf("Error listing Docker services: %v", err)
	}

	return services, nil
}

func (d *Docker) GetActiveTasksInfo(ctx context.Context, serviceName string) (*models.TasksService, error) {
	tasks, err := d.client.TaskList(ctx, types.TaskListOptions{
		Filters: filters.NewArgs(
			filters.KeyValuePair{
				Key:   "desired-state",
				Value: "running",
			},
			filters.KeyValuePair{
				Key:   "service",
				Value: serviceName,
			},
		),
	})

	if err != nil {
		return nil, err
	}

	var tasksService = &models.TasksService{}
	for _, task := range tasks {
		if task.Status.State != "running" {
			continue
		}

		tasksService.ServiceID = task.ServiceID
		tasksService.Status = string(task.Status.State)

		tasksService.Tasks = append(tasksService.Tasks, models.Task{
			ID:     task.ID,
			Name:   task.ServiceID,
			Status: string(task.Status.State),
		})
	}
	return tasksService, nil
}

// Function to update a service label
func (d *Docker) UpdateServiceLabel(ctx context.Context, reqService models.Service) error {
	// Retrieve the existing service
	service, _, err := d.client.ServiceInspectWithRaw(ctx, reqService.ID, types.ServiceInspectOptions{})
	if err != nil {
		return fmt.Errorf("error inspecting service: %v", err)
	}

	// Modify the labels
	if service.Spec.Labels == nil {
		service.Spec.Labels = make(map[string]string)
	}
	service.Spec.Labels = reqService.Labels

	// Update the service with the new specification
	updateOpts := types.ServiceUpdateOptions{
		QueryRegistry: false,
	}

	// Update replicas
	replicas := uint64(reqService.Replicas)
	service.Spec.Mode.Replicated.Replicas = &replicas

	_, err = d.client.ServiceUpdate(ctx, service.ID, service.Version, service.Spec, updateOpts)
	if err != nil {
		return fmt.Errorf("error updating service: %v", err)
	}

	return nil
}

// Function to update a status service
func (d *Docker) UpdateStatusService(ctx context.Context, serviceName, status string) error {
	var (
		inactiveStatus uint64 = 0
		activeStatus   uint64 = 1
	)
	// Retrieve the existing service
	service, _, err := d.client.ServiceInspectWithRaw(ctx, serviceName, types.ServiceInspectOptions{})
	if err != nil {
		return fmt.Errorf("error inspecting service: %v", err)
	}

	switch status {
	case "inactive":
		service.Spec.Mode.Replicated.Replicas = &inactiveStatus

	case "active":
		service.Spec.Mode.Replicated.Replicas = &activeStatus
	}

	_, err = d.client.ServiceUpdate(ctx, service.ID, service.Version, service.Spec, types.ServiceUpdateOptions{})
	if err != nil {
		return fmt.Errorf("error updating status service: %v", err)
	}

	return nil
}
