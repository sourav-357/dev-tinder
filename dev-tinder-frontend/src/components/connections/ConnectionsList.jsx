// Importing required modules
import React, { useState, useEffect } from "react";
import { getConnections, deleteConnection } from "../../utils/api";
import ConnectionCard from "./ConnectionCard";

/**
 * ConnectionsList component to display all connected users
 * Shows users who have accepted connection requests
 */
export default function ConnectionsList() {
  // State management for connections data
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Fetch connections data
   * Called when component mounts
   */
  const fetchConnections = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getConnections();
      if (response.connections && response.connections.length > 0) {
        setConnections(response.connections);
      } else {
        setConnections([]);
        setError(response.message || "No connections found.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load connections. Please try again."
      );
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle deleting a connection
   * @param {string} userId - ID of the user to delete connection with
   */
  const handleDeleteConnection = async (userId) => {
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this connection?")) {
      return;
    }

    try {
      await deleteConnection(userId);
      // Remove the deleted connection from the list
      setConnections((prevConnections) =>
        prevConnections.filter((user) => user._id !== userId)
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete connection. Please try again."
      );
    }
  };

  // Fetch connections when component mounts
  useEffect(() => {
    fetchConnections();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Show error state
  if (error && connections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4">
        <div className="alert alert-info max-w-md w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
          My Connections
        </h1>

        {/* Connections List */}
        {connections.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {connections.map((user) => (
              <ConnectionCard
                key={user._id}
                user={user}
                onDelete={handleDeleteConnection}
              />
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>No connections yet. Start connecting with developers!</span>
          </div>
        )}
      </div>
    </div>
  );
}

