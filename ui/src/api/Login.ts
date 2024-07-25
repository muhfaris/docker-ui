// src/api/login.ts
import apiRequest from "./API";
import { LoginResponse } from "../types/Login";

interface LoginRequest {
  username: string;
  password: string;
}

export const loginAPI = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await apiRequest<LoginResponse>({
    method: "POST",
    url: "/api/login",
    data: credentials,
  });

  // Store the access_token in local storage
  localStorage.setItem("access_token", response.data.access_token);

  return response;
};
