// src/api/login.ts
import {
	DataDockerService,
	DataDockerServiceAPI,
	DockerServiceRequest,
	DockerServiceResponse,
	UpdateStatusDockerServiceRequest,
} from "../shared/types/SwarmService";
import apiRequest from "./API";

export const dockerServicesAPI = async (
	search?: DockerServiceRequest,
): Promise<DataDockerService[]> => {
	let urlAPI = "/api/dockers/services";

	if (search?.keywords && search.keywords.length > 0) {
		urlAPI += `?keywords=${search.keywords.join(",")}`;
	}
	const response = await apiRequest<DockerServiceResponse>({
		method: "GET",
		url: urlAPI,
		data: search,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("access_token")}`,
		},
	});

	const services: DataDockerService[] = response.data.map((item) => ({
		id: item.id,
		name: item.name,
		labels: Object.entries(item.labels).map(([key, value]) => ({
			id: `label_${key}`, // or another unique id generation strategy
			key,
			value,
		})),
		status: item.status,
		image: item.image,
		replicas: item.replicas,
		created_at: item.created_at,
		updated_at: item.updated_at,
	}));

	return services;
};

export const updateDockerServiceAPI = async (
	data: DataDockerService[],
): Promise<DataDockerService[]> => {
	const payload: DataDockerServiceAPI[] = data.map((item) => ({
		id: item.id,
		name: item.name,
		labels: item.labels.reduce(
			(acc, label) => {
				acc[label.key] = label.value;
				return acc;
			},
			{} as { [key: string]: string },
		),
		image: item.image,
		replicas: item.replicas,
		status: item.status,
		created_at: item.created_at,
		updated_at: item.updated_at,
	}));

	const response = await apiRequest<DockerServiceResponse>({
		method: "PATCH",
		url: "/api/dockers/services",
		data: payload,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("access_token")}`,
		},
	});

	const services: DataDockerService[] = response.data.map((item) => ({
		id: item.id,
		name: item.name,
		labels: Object.entries(item.labels).map(([key, value]) => ({
			id: `label_${key}`, // or another unique id generation strategy
			key,
			value,
		})),
		image: item.image,
		replicas: item.replicas,
		status: item.status,
		created_at: item.created_at,
		updated_at: item.updated_at,
	}));

	return services;
};

export const updateStatusDockerServiceAPI = async (
	data: UpdateStatusDockerServiceRequest,
): Promise<DataDockerService[]> => {
	return await apiRequest({
		method: "PATCH",
		url: "/api/dockers/services/status",
		data: data,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("access_token")}`,
		},
	});
};
