package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
)

func main() {
	// Create a Docker client
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		log.Fatalf("Error creating Docker client: %v", err)
	}

	// Use the context for the Docker client
	ctx := context.Background()

	// Define a filter to list all services
	filter := filters.NewArgs()

	// List all services
	services, err := cli.ServiceList(ctx, types.ServiceListOptions{Filters: filter})
	if err != nil {
		log.Fatalf("Error listing Docker services: %v", err)
	}

	var result = make(map[string]any)

	// Iterate through the services and print the labels
	for _, service := range services {
		result["id"] = service.ID
		result["name"] = service.Spec.Name

		var resultLabels = make(map[string]any)
		for key, value := range service.Spec.Labels {
			fmt.Printf("  %s: %s\n", key, value)
			resultLabels[key] = value
		}

		result["labels"] = resultLabels
	}

	raw, _ := json.Marshal(result)
	fmt.Println(string(raw))
}
