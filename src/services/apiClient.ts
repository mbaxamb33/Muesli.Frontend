// src/services/apiClient.ts
import axios from 'axios';

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: '',
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
    // If the error is 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Clear tokens as they're invalid
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('refreshToken');
      
      // Get the current path to use as returnUrl
      const currentPath = window.location.pathname + window.location.search;
      const encodedReturnUrl = encodeURIComponent(currentPath);
      
      // Redirect to backend login with return URL
      window.location.href = `http://localhost:8080/login?returnUrl=${encodedReturnUrl}`;
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;