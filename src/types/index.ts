/* types para auth */ 

export interface RegisterRequest {
  email: string,
  password: string,
}

export interface LoginRequest {
  email: string,
  password: string
}

export interface User {
  id: number,
  email: string,
}

export interface LoginResponse {
  access_token: string,
  token_type: string,
  user: User
}

export interface AuthResponse {
    token: string;
    user: User
}