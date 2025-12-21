// Importing required modules
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

/**
 * Login component for user authentication
 * Handles form submission, user login, and navigation to feed page
 */
export default function Login() {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // Auth context to access login function
  const { login } = useAuth();

  // Form state management
  const [emailID, setEmailID] = useState("");
  const [password, setPassword] = useState("");
  
  // UI state management
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Handle form submission
   * Validates form data and calls login API
   * @param {Event} e - Form submit event
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission and page refresh
    setMessage("");
    setError("");
    setLoading(true);

    try {
      // Call login API
      const response = await loginAPI(emailID, password);
      
      // Set success message
      setMessage(response.message || "Login successful!");
      
      // Update auth context with user data
      if (response.user) {
        login(response.user);
        // Redirect to feed page after 1 second
        setTimeout(() => {
          navigate("/feed");
        }, 1000);
      }
    } catch (err) {
      // Handle errors
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <div className="w-full max-w-md bg-base-200 rounded-box p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email Input */}
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={emailID}
              placeholder="you@example.com"
              className="input input-bordered w-full"
              onChange={(e) => setEmailID(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              className="input input-bordered w-full"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Success Message */}
        {message && (
          <div className="alert alert-success mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{message}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Signup Link */}
        <div className="divider">OR</div>
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="link link-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

