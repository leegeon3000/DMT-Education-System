import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001', // Base URL for the API
    timeout: 10000, // Request timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
http.interceptors.request.use(
    (config) => {
        // Add any custom logic before sending the request
        const token = localStorage.getItem('token'); // Example for token retrieval
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
http.interceptors.response.use(
    (response) => {
        return response.data; // Return only the data from the response
    },
    (error) => {
        // Handle errors globally
        if (error.response) {
            // Handle specific error responses
            console.error('Error response:', error.response);
        } else {
            console.error('Error message:', error.message);
        }
        return Promise.reject(error);
    }
);

// Common API functions
export const fetchTasks = async () => {
    return await http.get('/tasks');
};

export const fetchReports = async () => {
    return await http.get('/reports');
};

// Export API client as named export too
export const api = http;
export const apiClient = http;

export default http;