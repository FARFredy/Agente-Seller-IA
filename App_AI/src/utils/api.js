// src/utils/api.js

// Mock API for development - no external dependencies
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const MOCK_MODE = !import.meta.env.VITE_API_URL; // Use mock mode if no API URL is configured

// Simulate API delay
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
const mockResponses = {
  '/auth/login': { success: true, message: 'Login successful' },
  '/auth/register': { success: true, message: 'Registration successful' },
  '/ai/process': { message: 'Mock AI response', conversationId: 'mock-conv-id' },
  '/analytics': { message: 'Mock analytics data' }
};

export const api = {
  request: async (endpoint, options = {}) => {
    // If in mock mode, return mock responses
    if (MOCK_MODE) {
      await simulateDelay();
      const mockResponse = mockResponses[endpoint];
      if (mockResponse) {
        return mockResponse;
      }
      throw new Error(`Mock API: No response defined for ${endpoint}`);
    }

    // Real API implementation
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'API request failed' }));
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },

  get: (endpoint, options = {}) => {
    return api.request(endpoint, { ...options, method: 'GET' });
  },

  post: (endpoint, data, options = {}) => {
    return api.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put: (endpoint, data, options = {}) => {
    return api.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: (endpoint, options = {}) => {
    return api.request(endpoint, { ...options, method: 'DELETE' });
  },

  // Helper to check if API is in mock mode
  isMockMode: () => MOCK_MODE,
  
  // Helper to get base URL
  getBaseUrl: () => API_BASE_URL
};
