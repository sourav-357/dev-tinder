// importing React hooks for creating context and managing state
import React, { createContext, useContext, useState, useEffect } from "react";
// importing API functions to check if user is logged in and to logout
import { getProfile, logout as logoutAPI } from "../utils/api";

// creating AuthContext - this allows us to share user data across all components
// context is like a global state that any component can access
const AuthContext = createContext();

// custom hook to access authentication context
// we use this in components to get user data and auth functions
export const useAuth = () => {
  // getting context value
  const context = useContext(AuthContext);
  // if context is not found, it means component is not wrapped in AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component - wraps the entire app to provide authentication state
// children prop is all the components inside AuthProvider
export const AuthProvider = ({ children }) => {
  // state to store current user data
  // null means user is not logged in, user object means user is logged in
  const [user, setUser] = useState(null);
  
  // state to track if we're still checking if user is logged in
  // true means we're checking, false means we're done checking
  const [loading, setLoading] = useState(true);

  // function to check if user is authenticated
  // calls backend to get user profile - if successful, user is logged in
  const checkAuth = async () => {
    try {
      // calling backend API to get user profile
      const response = await getProfile();
      // if response has user data, user is logged in
      if (response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // if error occurs, user is probably not logged in
      // we don't log 401 errors because they're expected when not logged in
      if (error.response) {
        // server responded with error status (401, 404, etc.)
        if (error.response.status === 401 || error.response.status === 404) {
          // user is not authenticated - this is normal, don't log
          setUser(null);
        } else {
          // other server errors - log unexpected errors
          console.error("Unexpected auth error:", error.response.status);
          setUser(null);
        }
      } else {
        // network error or CORS error
        // connection refused means server isn't running (fine during development)
        if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
          console.error("Network error checking auth:", error.message);
        }
        setUser(null);
      }
    } finally {
      // always set loading to false when done checking
      setLoading(false);
    }
  };

  // function to set user data after successful login
  // called when user logs in successfully
  const login = (userData) => {
    // setting user state with logged in user's data
    setUser(userData);
    // saving flag to localStorage so we know user has logged in before
    // this helps us decide whether to check auth on page load
    localStorage.setItem('hasLoggedIn', 'true');
  };

  // function to log out the user
  // clears user data and calls backend to clear authentication cookie
  const logout = async () => {
    try {
      // calling backend API to logout (clears cookie)
      await logoutAPI();
    } catch (error) {
      // if logout API fails, still clear user data locally
      console.error("Logout error:", error);
    } finally {
      // always clear user data and localStorage flag
      setUser(null);
      localStorage.removeItem('hasLoggedIn');
    }
  };

  // useEffect runs when component first mounts (page loads)
  // checks if user is logged in by calling checkAuth
  useEffect(() => {
    // checking if user has logged in before (from localStorage)
    // this prevents unnecessary API calls if user never logged in
    const hasLoggedInBefore = localStorage.getItem('hasLoggedIn');
    
    if (hasLoggedInBefore === 'true') {
      // user has logged in before, check if session is still valid
      checkAuth();
    } else {
      // user hasn't logged in, skip auth check (set loading to false)
      setLoading(false);
    }
  }, []); // empty array means this only runs once when component mounts

  // value object contains everything we want to share with other components
  const value = {
    user,        // current user data (null if not logged in)
    loading,     // whether we're still checking auth status
    login,       // function to set user after login
    logout,      // function to log out user
    checkAuth,   // function to check if user is logged in
  };

  // AuthContext.Provider makes the value available to all child components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

