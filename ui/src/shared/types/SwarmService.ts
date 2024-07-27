// src/types/SwarmService.ts
export interface LabelDockerService {
  id: string;
  key: string;
  value: string;
}

export interface DataDockerService {
  id: string;
  name: string;
  labels: LabelDockerService[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DataDockerServiceAPI {
  id: string;
  name: string;
  labels: { [key: string]: string };
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DockerServiceResponse {
  data: DataDockerServiceAPI[];
}

export interface DockerServiceRequest {
  search: string;
}
