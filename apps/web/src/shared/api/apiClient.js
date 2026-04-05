import axios from 'axios';
import { getToken } from '../../features/auth/storage/tokenStorage.js';
import { apiBaseUrl } from '../config/env.js';

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (optional)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Custom error handling can go here (e.g. redirect on 401)
    return Promise.reject(error);
  }
);

export default apiClient;
