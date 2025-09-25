import axios from 'axios';
import { toast } from 'react-hot-toast';

// API Base URL - change this to your Django backend URL
const API_BASE_URL ='https://lead-analysis-with-ai.onrender.com/';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token helpers
const getToken = () => localStorage.getItem('auth_token');
const setToken = (token) => {
  localStorage.setItem('auth_token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
const removeToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  delete api.defaults.headers.common['Authorization'];
};

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log all requests
  console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
  
  return config;
});

// Auto refresh setup
let refreshPromise = null;

// Handle responses and errors with automatic token refresh
api.interceptors.response.use(
  (response) => {
    // Log all responses
    console.log(`✅ Response from ${response.config.url}:`, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log('❌ API Error:', error);
    
    // Handle 401 errors with automatic token refresh
    if (error.response?.status === 401 && !originalRequest._retry && getToken()) {
      originalRequest._retry = true;
      
      try {
        // Prevent multiple refresh calls
        if (!refreshPromise) {
          refreshPromise = apiService.refreshToken();
        }
        
        await refreshPromise;
        refreshPromise = null;
        
        // Retry the original request with new token
        const token = getToken();
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        refreshPromise = null;
        console.log('❌ Token refresh failed:', refreshError);
        
        // Refresh failed, clear tokens and redirect
        removeToken();
        toast.error('Session expired. Please login again.');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    
    // Show error message for other errors
    if (error.response?.status !== 401) {
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

/**
 *API Service
 */
const apiService = {
  /**
   * User Authentication
   */
  
  // Login user
  async login(username, password) {
    try {
      const response = await api.post('/auth/login/', { username, password });
      
      if (response.data.access) {
        setToken(response.data.access);
        if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
        }
        // Start auto-refresh for new login
        this.startAutoRefresh();
        toast.success('Login successful!');
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sign up new user
  async signup(username, email, password) {
    try {
      const response = await api.post('/auth/register/', { 
        username, 
        email, 
        password 
      });
      
      if (response.data.access) {
        setToken(response.data.access);
        if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
        }
        // Start auto-refresh for new signup
        this.startAutoRefresh();
        toast.success('Account created successfully!');
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh access token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await api.post('/auth/token/refresh/', { 
        refresh: refreshToken 
      });
      
      if (response.data.access) {
        setToken(response.data.access);
        return response.data.access;
      }
      
      throw new Error('Token refresh failed');
    } catch (error) {
      removeToken();
      throw error;
    }
  },

  // Logout user
  logout() {
    this.stopAutoRefresh();
    removeToken();
    toast.success('Logged out successfully');
  },

  /**
   * Lead Qualification Features
   */
  
  // Get results (array of objects)
  async getResults() {
    try {
      const response = await api.get('intent/results/');
      return response.data; // Should be an array of result objects
    } catch (error) {
      throw error;
    }
  },

  async getOffers(){
    try {
      const response = await api.get('intent/offer/');
      toast.success('Offer fetched successfully!');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Post offer/product information
  async postOffer(offerData) {
    try {
      const response = await api.post('intent/offer/', offerData);
      toast.success('Offer saved successfully!');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getLeads(){
    try {
      const response = await api.get('intent/leads/upload/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload CSV file of leads
  async uploadCsvFile(file, onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('intent/leads/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }});
      toast.success('CSV file uploaded successfully!');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Post to score endpoint
  async getAiScore(offerId) {
    try {
      const response = await api.get('intent/score/',{
          params: {
            offer_id: offerId
          }
        }  
      );
      toast.success('Leads scored successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data || "Failed to score leads.");
      throw error;
    }
  },

  /**
   * Utility Methods
   */
  
  // Check if user is logged in
  isLoggedIn() {
    return !!getToken();
  },

  // Get current token
  getCurrentToken() {
    return getToken();
  },

  // Initialize auth and start auto-refresh (call this on app start)
  initAuth() {
    const token = getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      this.startAutoRefresh();
    }
  },

  // Start automatic token refresh every 50 minutes
  startAutoRefresh() {
    // Clear any existing interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    // Set up automatic refresh every 50 minutes (before 1-hour expiry)
    this.refreshInterval = setInterval(async () => {
      try {
        console.log('🔄 Auto-refreshing token...');
        await this.refreshToken();
        console.log('✅ Token auto-refreshed successfully');
      } catch (error) {
        console.log('❌ Auto-refresh failed:', error);
        this.stopAutoRefresh();
        removeToken();
      }
    }, 50 * 60 * 1000); // 50 minutes
  },

  // Stop automatic token refresh
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  },
};

// Initialize auth on service creation
apiService.initAuth();

export default apiService;