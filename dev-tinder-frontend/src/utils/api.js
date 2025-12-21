// Importing required modules
import axios from "axios";

// Base URL for the backend API
const API_BASE_URL = "http://localhost:5000";

// Configure axios defaults to send credentials (cookies) with every request
axios.defaults.withCredentials = true;

// Add response interceptor to suppress 401 errors in console (they're expected when not logged in)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't log 401 errors to console (expected when user is not authenticated)
    if (error.response && error.response.status === 401) {
      // Silently return the error without logging
      return Promise.reject(error);
    }
    // Log other errors normally
    return Promise.reject(error);
  }
);

/**
 * API utility functions for making HTTP requests to the backend
 * All functions return promises that resolve with the response data
 */

// ==================== Authentication APIs ==================== //

/**
 * Sign up a new user
 * @param {Object} userData - User signup data (firstName, lastName, emailID, password, age, gender, photoUrl, about, skills)
 * @returns {Promise} Promise that resolves with the signup response
 */
export const signup = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
  return response.data;
};

/**
 * Log in an existing user
 * @param {string} emailID - User's email address
 * @param {string} password - User's password
 * @returns {Promise} Promise that resolves with the login response
 */
export const login = async (emailID, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    emailID,
    password,
  });
  return response.data;
};

/**
 * Log out the current user
 * @returns {Promise} Promise that resolves with the logout response
 */
export const logout = async () => {
  const response = await axios.post(`${API_BASE_URL}/auth/logout`);
  return response.data;
};

// ==================== Profile APIs ==================== //

/**
 * Get the profile of the logged-in user
 * @returns {Promise} Promise that resolves with the user profile data
 */
export const getProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}/profile/view`);
  return response.data;
};

/**
 * Update the profile of the logged-in user
 * @param {Object} updateData - Data to update (firstName, lastName, age, gender, photoUrl, about, skills)
 * @returns {Promise} Promise that resolves with the update response
 */
export const updateProfile = async (updateData) => {
  const response = await axios.put(`${API_BASE_URL}/profile/edit`, updateData);
  return response.data;
};

/**
 * Update the password of the logged-in user
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} Promise that resolves with the update response
 */
export const updatePassword = async (oldPassword, newPassword) => {
  const response = await axios.put(`${API_BASE_URL}/profile/updatePassword`, {
    oldPassword,
    newPassword,
  });
  return response.data;
};

/**
 * Delete the account of the logged-in user
 * @returns {Promise} Promise that resolves with the delete response
 */
export const deleteAccount = async () => {
  const response = await axios.delete(`${API_BASE_URL}/profile/delete`);
  return response.data;
};

// ==================== User Feed APIs ==================== //

/**
 * Get the user feed (potential connections) with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of users per page (default: 10)
 * @returns {Promise} Promise that resolves with the feed data
 */
export const getUserFeed = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_BASE_URL}/user/feed`, {
    params: { page, limit },
  });
  return response.data;
};

// ==================== Connection Request APIs ==================== //

/**
 * Send a connection request to another user
 * @param {string} toUserId - ID of the user to send request to
 * @param {string} status - Status of the request ("interested" or "ignored")
 * @returns {Promise} Promise that resolves with the request response
 */
export const sendConnectionRequest = async (toUserId, status) => {
  const response = await axios.post(
    `${API_BASE_URL}/request/send/${status}/${toUserId}`
  );
  return response.data;
};

/**
 * Review (accept or reject) a connection request
 * @param {string} fromUserId - ID of the user who sent the request
 * @param {string} status - Status of the review ("accepted" or "rejected")
 * @returns {Promise} Promise that resolves with the review response
 */
export const reviewConnectionRequest = async (fromUserId, status) => {
  const response = await axios.post(
    `${API_BASE_URL}/request/review/${status}/${fromUserId}`
  );
  return response.data;
};

// ==================== User APIs ==================== //

/**
 * Get all connection requests received by the logged-in user
 * @returns {Promise} Promise that resolves with the requests data
 */
export const getConnectionRequests = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/requests`);
  return response.data;
};

/**
 * Get all connections (accepted requests) of the logged-in user
 * @returns {Promise} Promise that resolves with the connections data
 */
export const getConnections = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/connections`);
  return response.data;
};

/**
 * Delete a connection with another user
 * @param {string} userId - ID of the user to delete connection with
 * @returns {Promise} Promise that resolves with the delete response
 */
export const deleteConnection = async (userId) => {
  const response = await axios.delete(
    `${API_BASE_URL}/user/deleteconnections/${userId}`
  );
  return response.data;
};

// Exporting axios instance for custom requests if needed
export default axios;

