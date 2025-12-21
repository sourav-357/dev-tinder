// Importing required modules
import React, { useState, useEffect } from "react";
import { getConnectionRequests, reviewConnectionRequest } from "../../utils/api";
import RequestCard from "./RequestCard";

/**
 * RequestsList component to display and manage connection requests
 * Shows pending connection requests and allows users to accept or reject them
 */
export default function RequestsList() {
  // State management for requests data
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // Track which request action is in progress

  /**
   * Fetch connection requests data
   * Called when component mounts
   */
  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getConnectionRequests();
      if (response.requests && response.requests.length > 0) {
        setRequests(response.requests);
      } else {
        setRequests([]);
        setError(response.message || "No connection requests found.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load connection requests. Please try again."
      );
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch requests when component mounts
  useEffect(() => {
    fetchRequests();
  }, []);

  /**
   * Handle accepting a connection request
   * @param {string} fromUserId - ID of the user who sent the request
   */
  const handleAccept = async (fromUserId) => {
    setActionLoading(fromUserId);
    try {
      await reviewConnectionRequest(fromUserId, "accepted");
      // Remove request from list after accepting
      setRequests((prev) =>
        prev.filter((req) => req.fromUserId._id !== fromUserId)
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to accept connection request. Please try again.";
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Handle rejecting a connection request
   * @param {string} fromUserId - ID of the user who sent the request
   */
  const handleReject = async (fromUserId) => {
    setActionLoading(fromUserId);
    try {
      await reviewConnectionRequest(fromUserId, "rejected");
      // Remove request from list after rejecting
      setRequests((prev) =>
        prev.filter((req) => req.fromUserId._id !== fromUserId)
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to reject connection request. Please try again.";
      alert(errorMessage);
    } finally {
      setActionLoading(null);
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
  if (error && requests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="alert alert-info max-w-md">
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
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6">Connection Requests</h1>

        {/* Requests List */}
        {requests.length > 0 ? (
          <div className="space-y-6">
            {requests.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                onAccept={() => handleAccept(request.fromUserId._id)}
                onReject={() => handleReject(request.fromUserId._id)}
                loading={actionLoading === request.fromUserId._id}
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
            <span>No pending connection requests.</span>
          </div>
        )}
      </div>
    </div>
  );
}

