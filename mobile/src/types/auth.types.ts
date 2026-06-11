export interface User {
  userId: string;
  email: string;
  role: 'ROLE_CLIENT' | 'ROLE_DISPATCHER' | 'ROLE_DRIVER';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
  fullName: string;
  phone: string;
  clientId?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  userId: string;
}