// Importing required modules
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

/**
 * Signup component for user registration
 * Handles form submission, validation, and user signup
 */
export default function Signup() {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // Auth context to access login function
  const { login } = useAuth();

  // Form state management
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailID: "",
    password: "",
    age: "",
    gender: "",
    photoUrl: "",
    about: "",
    skills: "",
  });

  // UI state management
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
   * Validates form data and calls signup API
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      // Convert skills string to array (comma-separated)
      const skillsArray = formData.skills
        ? formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [];

      // Prepare signup data
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailID: formData.emailID,
        password: formData.password,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        photoUrl: formData.photoUrl || undefined,
        about: formData.about || undefined,
        skills: skillsArray.length > 0 ? skillsArray : undefined,
      };

      // Call signup API
      const response = await signup(signupData);
      
      // Set success message
      setMessage(response.message || "Signup successful!");
      
      // Auto-login after successful signup
      if (response.user) {
        login(response.user);
        // Redirect to profile page after 1.5 seconds
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      }
    } catch (err) {
      // Handle errors
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 py-8">
      <div className="w-full max-w-2xl bg-base-200 rounded-box p-6 shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Create Your Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* First Name and Last Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">First Name *</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                placeholder="John"
                className="input input-bordered w-full"
                onChange={handleChange}
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                placeholder="Doe"
                className="input input-bordered w-full"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email and Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Email *</span>
              </label>
              <input
                type="email"
                name="emailID"
                value={formData.emailID}
                placeholder="you@example.com"
                className="input input-bordered w-full"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Password *</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="••••••••"
                className="input input-bordered w-full"
                onChange={handleChange}
                required
              />
              <label className="label">
                <span className="label-text-alt">
                  Must be strong 
                </span>
              </label>
            </div>
          </div>

          {/* Age and Gender Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Age</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                placeholder="25"
                className="input input-bordered w-full"
                onChange={handleChange}
                min={18}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                className="select select-bordered w-full"
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="label">
              <span className="label-text">Photo URL</span>
            </label>
            <input
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              placeholder="https://example.com/photo.jpg"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          {/* About */}
          <div>
            <label className="label">
              <span className="label-text">About</span>
            </label>
            <textarea
              name="about"
              value={formData.about}
              placeholder="Tell us about yourself..."
              className="textarea textarea-bordered w-full"
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Skills */}
          <div>
            <label className="label">
              <span className="label-text">Skills (comma-separated, 1-5 skills)</span>
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              placeholder="React, Node.js, MongoDB"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
            <label className="label">
              <span className="label-text-alt">
                Enter skills separated by commas (e.g., React, Node.js, MongoDB)
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Signing up...
              </>
            ) : (
              "Sign Up"
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

        {/* Login Link */}
        <div className="divider">OR</div>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

