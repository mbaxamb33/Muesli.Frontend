// src/services/apiClient.ts
import axios from 'axios';

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: '/api/v1', // Make sure this matches your backend API base URL
});

// Add a request interceptor to include the token in requests
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const accessToken = localStorage.getItem('accessToken');
    
    // If token exists, add it to the request headers
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refreshing
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if we're not already on the login page to avoid infinite redirects
      if (!window.location.pathname.includes('/login')) {
        // Redirect to backend login endpoint that initiates Cognito auth
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;