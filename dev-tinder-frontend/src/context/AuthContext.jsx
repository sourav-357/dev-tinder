// Importing required modules
import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile, logout as logoutAPI } from "../utils/api";

// Creating AuthContext to manage authentication state globally
const AuthContext = createContext();

/**
 * Custom hook to access authentication context
 * @returns {Object} Auth context value containing user, loading, login, logout functions
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * AuthProvider component that wraps the app and provides authentication state
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  // State to store the current user data
  const [user, setUser] = useState(null);
  
  // State to track if authentication check is in progress
  const [loading, setLoading] = useState(true);

  /**
   * Function to check if user is authenticated by fetching profile
   * Called on component mount and when user logs in
   * Silently handles 401 errors (expected when user is not logged in)
   */
  const checkAuth = async () => {
    try {
      const response = await getProfile();
      if (response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Silently handle authentication errors (401, 404, network errors)
      // These are expected when user is not logged in
      // We don't log these errors to avoid console spam
      if (error.response) {
        // Server responded with error status (401, 404, etc.)
        if (error.response.status === 401 || error.response.status === 404) {
          // User is not authenticated - this is normal, don't log
          setUser(null);
        } else {
          // Other server errors - only log unexpected errors
          console.error("Unexpected auth error:", error.response.status);
          setUser(null);
        }
      } else {
        // Network error or CORS error - only log if it's not a connection refused
        // Connection refused means server isn't running, which is fine during development
        if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
          console.error("Network error checking auth:", error.message);
        }
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Function to set user data after successful login
   * @param {Object} userData - User data from login response
   */
  const login = (userData) => {
    setUser(userData);
    // Set flag to indicate user has logged in
    localStorage.setItem('hasLoggedIn', 'true');
  };

  /**
   * Function to log out the user
   * Clears user state and calls logout API
   */
  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      // Clear the login flag
      localStorage.removeItem('hasLoggedIn');
    }
  };

  // Check authentication status when component mounts
  // Only check if we have a flag indicating a previous login attempt
  useEffect(() => {
    // Check if there's a flag indicating user might be logged in
    // This prevents unnecessary API calls when user hasn't logged in yet
    const hasLoggedInBefore = localStorage.getItem('hasLoggedIn');
    
    if (hasLoggedInBefore === 'true') {
      // User has logged in before, check if session is still valid
      checkAuth();
    } else {
      // User hasn't logged in, skip auth check
      setLoading(false);
    }
  }, []);

  // Context value containing user state and auth functions
  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

