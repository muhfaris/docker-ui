import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
const baseURL = import.meta.env.VITE_API_URL;

// Axios instance with default settings
const apiClient = axios.create({
	baseURL: baseURL,
	timeout: 10000, // Optional: set a timeout for requests
});

// Helper function to handle API requests
const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
	try {
		// add baseurl to request url from env
		config.url = baseURL + config.url;
		const response: AxiosResponse<T> = await apiClient(config);
		return response.data;
	} catch (error: any) {
		// Throw an error with a descriptive message
		throw new Error(error.response?.data?.message || "An error occurred");
	}
};

export default apiRequest;
