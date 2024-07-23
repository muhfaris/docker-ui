package main

import (
	"context"
	"fmt"

	"github.com/docker/docker/client"

	"github.com/docker/docker/api/types"
)

// Function to update a service label
func updateServiceLabel(cli *client.Client, serviceID string, labelKey string, labelValue string) error {
	// Use the context for the Docker client
	ctx := context.Background()

	// Retrieve the existing service
	service, _, err := cli.ServiceInspectWithRaw(ctx, serviceID, types.ServiceInspectOptions{})
	if err != nil {
		return fmt.Errorf("error inspecting service: %v", err)
	}

	// Modify the labels
	if service.Spec.Labels == nil {
		service.Spec.Labels = make(map[string]string)
	}
	service.Spec.Labels[labelKey] = labelValue

	// Update the service with the new specification
	updateOpts := types.ServiceUpdateOptions{
		QueryRegistry: false,
	}
	_, err = cli.ServiceUpdate(ctx, service.ID, service.Version, service.Spec, updateOpts)
	if err != nil {
		return fmt.Errorf("error updating service: %v", err)
	}

	return nil
}
