// Importing required modules
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../../utils/api";

/**
 * ProfileEdit component for editing user profile
 * Allows users to update their profile information
 */
export default function ProfileEdit() {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  // Form state management
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    photoUrl: "",
    about: "",
    skills: "",
  });

  // UI state management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /**
   * Fetch user profile data on component mount
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.user) {
          const user = response.user;
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            age: user.age || "",
            gender: user.gender || "",
            photoUrl: user.photoUrl || "",
            about: user.about || "",
            skills: user.skills ? user.skills.join(", ") : "",
          });
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
   * Validates form data and calls update profile API
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      // Convert skills string to array (comma-separated)
      const skillsArray = formData.skills
        ? formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [];

      // Prepare update data
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        photoUrl: formData.photoUrl || undefined,
        about: formData.about || undefined,
        skills: skillsArray.length > 0 ? skillsArray : undefined,
      };

      // Call update profile API
      const response = await updateProfile(updateData);
      
      // Set success message
      setMessage(response.message || "Profile updated successfully!");
      
      // Redirect to profile view after 1.5 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      // Handle errors
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile. Please try again.";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <button
            className="btn btn-ghost"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>

        {/* Edit Form */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
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
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate("/profile")}
                  disabled={saving}
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

