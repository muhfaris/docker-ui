package docker

import "github.com/docker/docker/client"

var _client, _ = client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())

type Docker struct {
	client *client.Client
}

func NewWithOpts(opts ...client.Opt) (*Docker, error) {
	c, err := client.NewClientWithOpts(opts...)
	if err != nil {
		return nil, err
	}

	_client = c
	return &Docker{client: c}, nil
}
