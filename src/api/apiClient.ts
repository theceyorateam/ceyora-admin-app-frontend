import axios from 'axios';
import { getStoredAuth, removeStoredAuth } from '../utils/localStorage';

/**
 * API Client for Real Backend Integration
 * 
 * This file sets up an axios instance configured for use with your backend API.
 * It handles common concerns like:
 * - Base URL configuration
 * - Default headers
 * - Authentication token management
 * - Response error handling
 */

// Get the API base URL from environment variables
// Default to '/api' if not specified
const BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Optional: Set a timeout
  timeout: 10000, // 10 seconds
});

/**
 * Request Interceptor
 * 
 * Runs before each request is sent.
 * - Adds the authentication token to the request headers if available
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get authentication data from storage
    const auth = getStoredAuth();
    
    // If we have a token, add it to the Authorization header
    if (auth && auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request error
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * Runs after each response is received.
 * - Handles common API error scenarios like authentication failures
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific HTTP error codes
      switch (error.response.status) {
        case 401: // Unauthorized
          // Token is invalid or expired
          console.log('Authentication failed - redirecting to login');
          removeStoredAuth();
          window.location.href = '/login';
          break;
          
        default:
          console.error(`API Error: ${error.response.status}`);
      }
    } else if (error.request) {
      // Request was made but no response received (network issues)
      console.error('Network error - no response received');
    } else {
      // Something else caused the error
      console.error('API Error:', error.message);
    }
    
    // Always reject with the error for the calling code to handle
    return Promise.reject(error);
  }
);

export default apiClient;