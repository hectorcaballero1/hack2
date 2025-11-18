import { api } from './api'
import type { LoginResponse, AuthResponse, RegisterRequest, LoginRequest, User } from '../types'

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);

    return {
      token: response.data.access_token,
      user: response.data.user,
    };
  },

  async register(data: RegisterRequest): Promise<void> {
    await api.post('/auth/register', data);
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
};
