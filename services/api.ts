import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getApiKey } from '@/utils/secureStorage';

// Create a custom axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://your-api-endpoint.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and API keys
api.interceptors.request.use(
  async (config) => {
    try {
      // Add API key if needed
      if (config.requiresApiKey) {
        const apiKey = await getApiKey(config.apiServiceName || 'default');
        if (apiKey) {
          config.headers['X-API-Key'] = apiKey;
        }
      }

      // Add auth token if needed
      const authToken = await getApiKey('auth_token');
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can process successful responses here
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Here you would typically refresh the token
        // const newToken = await refreshToken();
        // await setSecureValue(STORAGE_KEYS.AUTH_TOKEN, newToken);
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        console.error('Token refresh failed:', refreshError);
        // You might want to clear auth state and redirect to login here
      }
    }

    // Log and handle other errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
      });
    } else if (error.request) {
      // No response received
      console.error('No response from server:', error.request);
    } else {
      // Request setup error
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Helper function to make authenticated API calls
export const authenticatedRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api({
      ...config,
      requiresApiKey: true,
    });
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default api;
