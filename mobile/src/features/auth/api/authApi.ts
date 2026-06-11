import { apiClient } from '../../../shared/api/client';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../../types';

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> => 
    apiClient.post('/auth/login', data).then(res => res.data),
  
  register: (data: RegisterRequest): Promise<AuthResponse> => 
    apiClient.post('/auth/register', data).then(res => res.data),
  
  logout: (): Promise<void> => 
    apiClient.post('/auth/logout').then(() => {}),
};