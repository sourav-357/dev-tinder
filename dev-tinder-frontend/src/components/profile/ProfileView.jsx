// Importing required modules
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, deleteAccount } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

/**
 * ProfileView component to display user profile information
 * Shows user details and provides options to edit or delete account
 */
export default function ProfileView() {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // Auth context to access user and logout function
  const { user: authUser, logout } = useAuth();

  // State to store profile data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /**
   * Fetch user profile data on component mount
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.user) {
          setUser(response.user);
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
   * Handle account deletion
   * Confirms deletion and calls delete API
   */
  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      // Logout user after account deletion
      await logout();
      // Redirect to login page
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete account. Please try again."
      );
      setDeleting(false);
      setShowDeleteConfirm(false);
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

  // Show error state
  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Show profile data
  return (
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </button>
            <button
              className="btn btn-error"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            {/* Profile Photo and Basic Info */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="avatar">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={user?.photoUrl || "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"} alt="Profile" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="card-title text-2xl">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-base-content/70">{user?.emailID}</p>
                {user?.age && (
                  <p className="text-base-content/70">Age: {user.age}</p>
                )}
                {user?.gender && (
                  <p className="text-base-content/70 capitalize">
                    Gender: {user.gender}
                  </p>
                )}
              </div>
            </div>

            {/* About Section */}
            {user?.about && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">About</h3>
                <p className="text-base-content/80">{user.about}</p>
              </div>
            )}

            {/* Skills Section */}
            {user?.skills && user.skills.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <div key={index} className="badge badge-primary badge-lg">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Update Password Link */}
        <div className="mt-4">
          <button
            className="btn btn-outline btn-primary w-full"
            onClick={() => navigate("/profile/update-password")}
          >
            Update Password
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Delete Account</h3>
              <p className="py-4">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mt-4">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

