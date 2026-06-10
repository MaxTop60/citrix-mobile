import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.2:8080/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    console.log('🔑 Токен для запроса:', token ? `${token.substring(0, 20)}...` : 'НЕТ ТОКЕНА');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // Редирект на логин будет в AppNavigator
    }
    return Promise.reject(error);
  }
);

export const fetchClients = async () => {
  const response = await apiClient.get('/auth/clients');
  return response.data;
};

