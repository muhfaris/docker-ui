package docker

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/swarm"
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

// Function to update a service label
func (d *Docker) UpdateServiceLabel(ctx context.Context, serviceID string, labels map[string]string) error {
	// Retrieve the existing service
	service, _, err := d.client.ServiceInspectWithRaw(ctx, serviceID, types.ServiceInspectOptions{})
	if err != nil {
		return fmt.Errorf("error inspecting service: %v", err)
	}

	// Modify the labels
	if service.Spec.Labels == nil {
		service.Spec.Labels = make(map[string]string)
	}
	service.Spec.Labels = labels

	// Update the service with the new specification
	updateOpts := types.ServiceUpdateOptions{
		QueryRegistry: false,
	}

	_, err = d.client.ServiceUpdate(ctx, service.ID, service.Version, service.Spec, updateOpts)
	if err != nil {
		return fmt.Errorf("error updating service: %v", err)
	}

	return nil
}
