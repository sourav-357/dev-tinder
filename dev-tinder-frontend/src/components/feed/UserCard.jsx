// Importing required modules
import React from "react";

/**
 * UserCard component to display a user card in the feed
 * Shows user information and action buttons (Interested/Ignore)
 * @param {Object} props - Component props
 * @param {Object} props.user - User object containing user data
 * @param {Function} props.onInterested - Callback function when interested button is clicked
 * @param {Function} props.onIgnore - Callback function when ignore button is clicked
 * @param {boolean} props.loading - Loading state for buttons
 */
export default function UserCard({
  user,
  onInterested,
  onIgnore,
  interestedLoading,
  ignoreLoading,
}) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        {/* User Photo and Basic Info */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={
                  user?.photoUrl ||
                  "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
                }
                alt={`${user?.firstName} ${user?.lastName}`}
              />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="card-title">
              {user?.firstName} {user?.lastName}
            </h2>
            {user?.age && <p className="text-base-content/70">Age: {user.age}</p>}
            {user?.gender && (
              <p className="text-base-content/70 capitalize">
                Gender: {user.gender}
              </p>
            )}
          </div>
        </div>

        {/* About Section */}
        {user?.about && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-base-content/80">{user.about}</p>
          </div>
        )}

        {/* Skills Section */}
        {user?.skills && user.skills.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <div key={index} className="badge badge-primary badge-lg">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-error"
            onClick={onIgnore}
            disabled={interestedLoading || ignoreLoading}
          >
            {ignoreLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </>
            ) : (
              "Ignore"
            )}
          </button>
          <button
            className="btn btn-primary"
            onClick={onInterested}
            disabled={interestedLoading || ignoreLoading}
          >
            {interestedLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </>
            ) : (
              "Interested"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

