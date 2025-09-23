// src/hooks/useTravellerAPI.js
import { useState, useEffect } from 'react';
import { 
  authAPI, 
  destinationsAPI, 
  itinerariesAPI, 
  categoriesAPI, 
  ratingsAPI 
} from '../services/api';

// Generic hook for API calls
const useApiCall = (apiFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && apiFunction) {
      execute(...dependencies);
    }
  }, dependencies);

  return { data, loading, error, execute };
};

// Auth hooks
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());

  const login = async (credentials) => {
    try {
      const result = await authAPI.login(credentials);
      setIsAuthenticated(true);
      return result;
    } catch (error) {
      throw error;
    }
  };

   const signup = async (userData) => {
    try {
      const result = await authAPI.signup(userData);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
  };
};

// Trending destinations hook
export const useTrendingDestinations = () => {
  return useApiCall(destinationsAPI.getTrendingDestinations, [], true);
};

export const useAllDestination=()=>{
  return useApiCall(destinationsAPI.getAllDestination,[],true);
}

// Single destination hook
export const useDestination = (slug) => {
  const { data, loading, error, execute } = useApiCall(
    destinationsAPI.getDestination, 
    [slug], 
    !!slug,
  );


  const recordView = () => destinationsAPI.recordView(slug);
  const recordDwell = (dwellTime) => destinationsAPI.recordDwell(slug, dwellTime);
  const recordClick = (clickTarget) => destinationsAPI.recordClick(slug, clickTarget);

  return {
    destination: data,
    loading,
    error,
    refresh: execute,
    recordView,
    recordDwell,
    recordClick,
  };
};

// Itinerary hook
export const useItinerary = (slug) => {
  return useApiCall(
    itinerariesAPI.getItinerary,
    [slug],
    !!slug
  );
};

// Search hooks
export const useSearchByTag = (tag, immediate = false) => {
  return useApiCall(
    categoriesAPI.searchByTag,
    [tag],
    immediate && !!tag
  );
};

export const useSearchByType = (type, immediate = false) => {
  return useApiCall(
    categoriesAPI.searchByType,
    [type],
    immediate && !!type
  );
};

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchByTag = async (tag) => {
    setLoading(true);
    setError(null);
    try {
      const results = await categoriesAPI.searchByTag(tag);
      setSearchResults(results);
      return results;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchByType = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const results = await categoriesAPI.searchByType(type);
      setSearchResults(results);
      return results;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchByTypeAndDestination = async (type, destination) => {
    setLoading(true);
    setError(null);
    try {
      const results = await categoriesAPI.searchByTypeAndDestination(type, destination);
      setSearchResults(results);
      return results;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setSearchResults(null);
    setError(null);
  };

  return {
    searchResults,
    loading,
    error,
    searchByTag,
    searchByType,
    searchByTypeAndDestination,
    clearResults,
  };
};

// Ratings hook
export const useRatings = (itineraryId) => {
  const [ratings, setRatings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addRating = async (rating, review) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ratingsAPI.addRating(itineraryId, rating, review);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRatings = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await ratingsAPI.getRatings(itineraryId);
      setRatings(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    ratings,
    loading,
    error,
    addRating,
    getRatings,
  };
};

// Analytics hook for tracking user interactions
export const useAnalytics = () => {
  const trackView = async (slug) => {
    try {
      await destinationsAPI.recordView(slug);
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  const trackDwell = async (slug, startTime) => {
    const dwellTime = Math.floor((Date.now() - startTime) / 1000);
    try {
      await destinationsAPI.recordDwell(slug, dwellTime);
    } catch (error) {
      console.error('Failed to track dwell time:', error);
    }
  };

  const trackClick = async (slug, target) => {
    try {
      await destinationsAPI.recordClick(slug, target);
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  return {
    trackView,
    trackDwell,
    trackClick,
  };
};