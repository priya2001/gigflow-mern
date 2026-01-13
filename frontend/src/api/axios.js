import axios from "axios";

const api = axios.create({
  baseURL: "/",
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to ensure proper JSON formatting
api.interceptors.request.use(
  (config) => {
    // Ensure Content-Type is set for JSON requests
    if ((config.method.toLowerCase() === 'post' || 
         config.method.toLowerCase() === 'put' || 
         config.method.toLowerCase() === 'patch') && 
        config.data) {
      
      // Set content-type header
      config.headers['Content-Type'] = 'application/json';
      
      // Stringify the data if it's not already a string
      if (typeof config.data !== 'string') {
        try {
          config.data = JSON.stringify(config.data);
        } catch (error) {
          console.error('Error stringifying request data:', error);
          return Promise.reject(new Error('Failed to serialize request data'));
        }
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses
api.interceptors.response.use(
  (response) => {
    // Attempt to parse JSON response safely
    if (response.data && typeof response.data === 'string') {
      try {
        response.data = JSON.parse(response.data);
      } catch (error) {
        console.warn('Could not parse response as JSON:', error);
      }
    }
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error:', error.message);
    } else {
      // Something else happened
      console.error('General error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;