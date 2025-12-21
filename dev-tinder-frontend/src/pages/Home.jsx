// Importing required modules
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Home page component
 * Landing page that shows different content based on authentication status
 */
export default function Home() {
  // Auth context to check if user is logged in
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <h1 className="text-5xl font-bold mb-4">👨‍🎓 DevTinder 🌴</h1>
        <p className="text-xl mb-8 text-base-content/70">
          Connect with developers, build your network, and grow together!
        </p>

        {/* Action Buttons */}
        {user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/feed" className="btn btn-primary btn-lg">
              Discover Developers
            </Link>
            <Link to="/profile" className="btn btn-outline btn-lg">
              My Profile
            </Link>
            <Link to="/requests" className="btn btn-outline btn-lg">
              Connection Requests
            </Link>
            <Link to="/connections" className="btn btn-outline btn-lg">
              My Connections
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Login
            </Link>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">🔍 Discover</h2>
              <p>Find developers with similar interests and skills</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">🤝 Connect</h2>
              <p>Send connection requests and build your network</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">🚀 Grow</h2>
              <p>Collaborate and grow together as developers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

