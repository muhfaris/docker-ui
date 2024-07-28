package models

type Service struct {
	ID       string            `json:"id"`
	Name     string            `json:"name"`
	Image    string            `json:"image"`
	Labels   map[string]string `json:"labels"`
	Status   string            `json:"status"`
	Replicas int               `json:"replicas"`
	Metadata
}

type Task struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Status string `json:"status"`
}

type TasksService struct {
	ServiceID string `json:"service_id"`
	Status    string `json:"status"`
	Tasks     []Task `json:"tasks"`
}

type StatusService struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Status string `json:"status"`
}

type SearchDockerService struct {
	Keywords []string `query:"keywords"`
}
