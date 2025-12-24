// importing axios module for making HTTP requests to backend
import axios from "axios";

// getting base URL from environment variable
// in development, use localhost
// in production, this will be your deployed backend URL
// import.meta.env.VITE_API_URL is a Vite environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// configuring axios to send credentials (cookies) with every request
// this is needed because we store authentication token in cookies
// without this, cookies won't be sent to backend
axios.defaults.withCredentials = true;

// adding response interceptor to handle errors
// this runs for every response from backend
axios.interceptors.response.use(
  (response) => response, // if response is successful, just return it
  (error) => {
    // if error is 401 (unauthorized), don't log it to console
    // 401 errors are expected when user is not logged in, so we don't want console spam
    if (error.response && error.response.status === 401) {
      return Promise.reject(error); // return error without logging
    }
    // for other errors, return them normally (they might be logged elsewhere)
    return Promise.reject(error);
  }
);

// ==================== Authentication API Functions ==================== //

// signup function - sends user data to backend to create new account
// userData should contain: firstName, lastName, emailID, password, age, gender, photoUrl, about, skills
export const signup = async (userData) => {
  // making POST request to /auth/signup endpoint
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
  // returning only the data part of response (not headers, status, etc.)
  return response.data;
};

// login function - sends email and password to backend to authenticate
// emailID is the user's email address
// password is the user's password
export const login = async (emailID, password) => {
  // making POST request to /auth/login endpoint
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    emailID,
    password,
  });
  return response.data;
};

// logout function - tells backend to clear authentication cookie
export const logout = async () => {
  // making POST request to /auth/logout endpoint
  const response = await axios.post(`${API_BASE_URL}/auth/logout`);
  return response.data;
};

// ==================== Profile API Functions ==================== //

// getProfile function - gets the logged in user's profile data
export const getProfile = async () => {
  // making GET request to /profile/view endpoint
  const response = await axios.get(`${API_BASE_URL}/profile/view`);
  return response.data;
};

// updateProfile function - updates the logged in user's profile
// updateData should contain fields to update: firstName, lastName, age, gender, photoUrl, about, skills
export const updateProfile = async (updateData) => {
  // making PUT request to /profile/edit endpoint
  const response = await axios.put(`${API_BASE_URL}/profile/edit`, updateData);
  return response.data;
};

// updatePassword function - changes the logged in user's password
// oldPassword is the current password
// newPassword is the new password to set
export const updatePassword = async (oldPassword, newPassword) => {
  // making PUT request to /profile/updatePassword endpoint
  const response = await axios.put(`${API_BASE_URL}/profile/updatePassword`, {
    oldPassword,
    newPassword,
  });
  return response.data;
};

// deleteAccount function - deletes the logged in user's account
export const deleteAccount = async () => {
  // making DELETE request to /profile/delete endpoint
  const response = await axios.delete(`${API_BASE_URL}/profile/delete`);
  return response.data;
};

// ==================== User Feed API Functions ==================== //

// getUserFeed function - gets list of users for discovery feed
// page is the page number (default 1)
// limit is how many users per page (default 10)
export const getUserFeed = async (page = 1, limit = 10) => {
  // making GET request to /user/feed with page and limit as query parameters
  const response = await axios.get(`${API_BASE_URL}/user/feed`, {
    params: { page, limit }, // params adds ?page=1&limit=10 to URL
  });
  return response.data;
};

// ==================== Connection Request API Functions ==================== //

// sendConnectionRequest function - sends a connection request to another user
// toUserId is the ID of the user to send request to
// status is either "interested" or "ignored"
export const sendConnectionRequest = async (toUserId, status) => {
  // making POST request to /request/send/:status/:toUserId endpoint
  const response = await axios.post(
    `${API_BASE_URL}/request/send/${status}/${toUserId}`
  );
  return response.data;
};

// reviewConnectionRequest function - accepts or rejects an incoming connection request
// fromUserId is the ID of the user who sent the request
// status is either "accepted" or "rejected"
export const reviewConnectionRequest = async (fromUserId, status) => {
  // making POST request to /request/review/:status/:fromUserId endpoint
  const response = await axios.post(
    `${API_BASE_URL}/request/review/${status}/${fromUserId}`
  );
  return response.data;
};

// ==================== User API Functions ==================== //

// getConnectionRequests function - gets all pending connection requests received by logged in user
export const getConnectionRequests = async () => {
  // making GET request to /user/requests endpoint
  const response = await axios.get(`${API_BASE_URL}/user/requests`);
  return response.data;
};

// getConnections function - gets all accepted connections of logged in user
export const getConnections = async () => {
  // making GET request to /user/connections endpoint
  const response = await axios.get(`${API_BASE_URL}/user/connections`);
  return response.data;
};

// deleteConnection function - removes a connection with another user
// userId is the ID of the user to disconnect from
export const deleteConnection = async (userId) => {
  // making DELETE request to /user/deleteconnections/:userId endpoint
  const response = await axios.delete(
    `${API_BASE_URL}/user/deleteconnections/${userId}`
  );
  return response.data;
};

// exporting axios instance in case we need it for custom requests
export default axios;

