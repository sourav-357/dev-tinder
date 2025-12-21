// Importing required modules
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../../utils/api";

/**
 * UpdatePassword component for changing user password
 * Requires old password and new password
 */
export default function UpdatePassword() {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  // Form state management
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state management
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  /**
   * Handle input field changes
   * Updates the corresponding field in formData state
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error message when user starts typing
    setError("");
  };

  /**
   * Handle form submission
   * Validates passwords match and calls update password API
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate that new password and confirm password match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    // Validate password strength (basic check)
    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setUpdating(true);

    try {
      // Call update password API
      const response = await updatePassword(
        formData.oldPassword,
        formData.newPassword
      );
      
      // Set success message
      setMessage(response.message || "Password updated successfully!");
      
      // Clear form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // Redirect to profile page after 2 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      // Handle errors
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update password. Please try again.";
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Update Password</h1>
          <button
            className="btn btn-ghost"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>

        {/* Update Password Form */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Old Password */}
              <div>
                <label className="label">
                  <span className="label-text">Current Password *</span>
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  placeholder="Enter current password"
                  className="input input-bordered w-full"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* New Password */}
              <div>
                <label className="label">
                  <span className="label-text">New Password *</span>
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  placeholder="Enter new password"
                  className="input input-bordered w-full"
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <label className="label">
                  <span className="label-text-alt">
                    Must be strong (min 8 chars, uppercase, lowercase, number, symbol)
                  </span>
                </label>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="label">
                  <span className="label-text">Confirm New Password *</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="Confirm new password"
                  className="input input-bordered w-full"
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate("/profile")}
                  disabled={updating}
                >
                  Cancel
                </button>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

