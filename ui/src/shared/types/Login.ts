// src/types/Login.ts
export interface LoginResponse {
  data: {
    access_token: string;
  };
}

export interface Login {
  username: string;
  password: string;
}
