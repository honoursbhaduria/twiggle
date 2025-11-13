// src/services/api.js
import axios from 'axios';

// Base URL configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');
const setTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
  // Store token timestamp for proactive refresh
  localStorage.setItem('token_timestamp', Date.now().toString());
};
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_timestamp');
};

// Proactive token refresh - refresh 2 minutes before expiry (13 min for 15 min tokens)
let refreshTimer = null;
const scheduleTokenRefresh = () => {
  if (refreshTimer) clearTimeout(refreshTimer);

  const tokenTimestamp = localStorage.getItem('token_timestamp');
  if (!tokenTimestamp) return;

  // Refresh after 13 minutes (780 seconds) - 2 min before 15 min expiry
  const refreshInterval = 13 * 60 * 1000; // 13 minutes in milliseconds
  const elapsed = Date.now() - parseInt(tokenTimestamp);
  const timeUntilRefresh = Math.max(0, refreshInterval - elapsed);

  refreshTimer = setTimeout(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const response = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, {
          refresh: refreshToken
        });
        const { access, refresh: rotatedRefresh } = response.data;
        setTokens(access, rotatedRefresh || refreshToken);
        scheduleTokenRefresh(); // Schedule next refresh
      } catch (error) {
        console.error('Proactive token refresh failed:', error);
        clearTokens();
        window.location.href = '/auth';
      }
    }
  }, timeUntilRefresh);
};

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken
          });

          const { access, refresh: rotatedRefresh } = response.data;
          setTokens(access, rotatedRefresh || refreshToken);
          originalRequest.headers.Authorization = `Bearer ${access}`;

          return api(originalRequest);
        } catch (refreshError) {
          clearTokens();
          window.location.href = '/auth';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Sign up
  signup: async (userData) => {
    const response = await api.post('/api/auth/signup/', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/api/auth/login/', credentials);
    const { access, refresh } = response.data;
    setTokens(access, refresh);
    scheduleTokenRefresh(); // Start proactive refresh after login
    return response.data;
  },

  // Logout
  logout: async () => {
    if (refreshTimer) clearTimeout(refreshTimer); // Clear refresh timer on logout
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await api.post('/api/auth/logout/', { refresh: refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    clearTokens();
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = getRefreshToken();
    const response = await api.post('/api/auth/token/refresh/', {
      refresh: refreshToken
    });
    const { access, refresh: rotatedRefresh } = response.data;
    setTokens(access, rotatedRefresh || refreshToken);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const hasToken = !!getToken();
    if (hasToken && !refreshTimer) {
      // Resume refresh schedule if page reloads with valid token
      scheduleTokenRefresh();
    }
    return hasToken;
  },
};

// Destinations API calls
export const destinationsAPI = {

  //get all destination
  getAllDestination: async () => {
    const response = await api.get('/api/destinations/');
    return response.data;
  },

  // Get trending destinations
  getTrendingDestinations: async () => {
    const response = await api.get('/api/trending-destinations/');
    return response.data;
  },

  // Get destination by slug
  getDestination: async (slug) => {
    const response = await api.get(`/api/destinations/${slug}/`);
    return response.data;
  },


  // Record view
  recordView: async (slug) => {
    const response = await api.post(`/api/destination/${slug}/view/`);
    return response.data;
  },

  // Record dwell time
  recordDwell: async (slug, dwellTime) => {
    const response = await api.post(`/api/destination/${slug}/dwell/`, {
      dwell_time: dwellTime
    });
    return response.data;
  },

  // Record click
  recordClick: async (slug, clickTarget) => {
    const response = await api.post(`/api/destination/${slug}/click/`, {
      click_target: clickTarget
    });
    return response.data;
  },
};

// Itineraries API calls
export const itinerariesAPI = {
  // Get itinerary by slug
  getItinerary: async (slug) => {
    const response = await api.get(`/api/itineraries/${slug}/`);
    return response.data;
  },
};

// Categories/Search API calls
export const categoriesAPI = {
  // Search by tag
  searchByTag: async (tag) => {
    const response = await api.get(`/api/categories/tag/${tag}/`);
    return response.data;
  },

  // Search by type
  searchByType: async (type) => {
    const response = await api.get(`/api/categories/type/${type}/`);
    return response.data;
  },

  // Search by type and destination
  searchByTypeAndDestination: async (type, destination) => {
    const response = await api.get(`/api/categories/type/${type}/`, {
      params: { destination }
    });
    return response.data;
  },
};

// Ratings API calls
export const ratingsAPI = {
  // Add rating to itinerary
  addRating: async (itineraryId, rating, review) => {
    const response = await api.post(`/api/ratings/itinerary/${itineraryId}/add/`, {
      rating,
      review
    });
    return response.data;
  },

  // Get ratings (placeholder - URL not provided in collection)
  getRatings: async (itineraryId) => {
    const response = await api.get(`/api/ratings/itinerary/${itineraryId}/`);
    return response.data;
  },
};

// Generic API helper for custom calls
export const customAPI = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

// Export the axios instance for direct use if needed
export default api;




