import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../../shared/api/client';
import { storage } from '../../../shared/lib/storage';

interface AuthState {
  user: { email: string; role: string } | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Асинхронный thunk для логина
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, email: userEmail, role } = response.data;
      await storage.setToken(token);
      await storage.setUser({ email: userEmail, role });
      return { token, user: { email: userEmail, role } };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Асинхронный thunk для регистрации
export const register = createAsyncThunk(
  'auth/register',
  async ({ 
    email, 
    password, 
    role, 
    fullName, 
    phone 
  }: { 
    email: string; 
    password: string; 
    role: string; 
    fullName: string; 
    phone: string; 
  }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/register', { 
        email, 
        password, 
        role, 
        fullName, 
        phone 
      });
      const { token, email: userEmail, role: userRole, profileId } = response.data;
      await storage.setToken(token);
      await storage.setUser({ email: userEmail, role: userRole, profileId });
      return { token, user: { email: userEmail, role: userRole, profileId } };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Асинхронный thunk для выхода
export const logout = createAsyncThunk('auth/logout', async () => {
  await storage.clear();
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Логин
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Регистрация
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Выход
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;