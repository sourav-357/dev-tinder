// Importing required modules
import React, { useState, useEffect } from "react";
import { getUserFeed, sendConnectionRequest } from "../../utils/api";
import UserCard from "./UserCard";

/**
 * Feed component to display user feed with pagination
 * Shows potential connections and allows users to send connection requests
 */
export default function Feed() {
  // State management for feed data
  const [feedUsers, setFeedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // Track which user action is in progress

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  /**
   * Fetch user feed data
   * Called when component mounts or page changes
   */
  const fetchFeed = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getUserFeed(page, limit);
      if (response.feed && response.feed.length > 0) {
        setFeedUsers(response.feed);
        setTotalPages(response.totalPages || 1);
        setHasNextPage(response.hasNextPage || false);
      } else {
        setFeedUsers([]);
        setError(response.message || "No users found in feed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load feed. Please try again."
      );
      setFeedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch feed when component mounts or page changes
  useEffect(() => {
    fetchFeed();
  }, [page]);

  /**
   * Handle sending connection request (interested)
   * @param {string} userId - ID of the user to send request to
   */
  const handleInterested = async (userId) => {
    setActionLoading({ userId, type: "interested" });
    try {
      await sendConnectionRequest(userId, "interested");
      // Remove user from feed after sending request
      setFeedUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to send connection request. Please try again.";
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Handle ignoring a user
   * @param {string} userId - ID of the user to ignore
   */
  const handleIgnore = async (userId) => {
    setActionLoading({ userId, type: "ignored" });
    try {
      await sendConnectionRequest(userId, "ignored");
      // Remove user from feed after ignoring
      setFeedUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to ignore user. Please try again.";
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Handle pagination - go to next page
   */
  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * Handle pagination - go to previous page
   */
  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
  if (error && feedUsers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="alert alert-warning max-w-md">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
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
        <h1 className="text-3xl font-bold mb-6">Discover Developers</h1>

        {/* Feed Users List */}
        {feedUsers.length > 0 ? (
          <div className="space-y-6">
            {feedUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onInterested={() => handleInterested(user._id)}
                onIgnore={() => handleIgnore(user._id)}
                interestedLoading={
                  actionLoading?.userId === user._id &&
                  actionLoading?.type === "interested"
                }
                ignoreLoading={
                  actionLoading?.userId === user._id &&
                  actionLoading?.type === "ignored"
                }
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
            <span>No more users in feed. Check back later!</span>
          </div>
        )}

        {/* Pagination Controls */}
        {feedUsers.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              className="btn btn-outline"
              onClick={handlePrevPage}
              disabled={page === 1 || loading}
            >
              Previous
            </button>
            <span className="text-base-content/70">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-outline"
              onClick={handleNextPage}
              disabled={!hasNextPage || loading}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

