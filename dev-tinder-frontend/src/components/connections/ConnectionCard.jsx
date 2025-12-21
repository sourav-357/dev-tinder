// Importing required modules
import React from "react";

/**
 * ConnectionCard component to display a connected user card
 * Shows user information for accepted connections
 * @param {Object} props - Component props
 * @param {Object} props.user - User object containing user data
 * @param {Function} props.onDelete - Function to call when delete button is clicked
 */
export default function ConnectionCard({ user, onDelete }) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body p-4 sm:p-6">
        {/* User Photo and Basic Info */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="avatar flex-shrink-0 mx-auto sm:mx-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={
                  user?.photoUrl ||
                  "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
                }
                alt={`${user?.firstName} ${user?.lastName}`}
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="card-title text-lg sm:text-xl justify-center sm:justify-start">
              {user?.firstName} {user?.lastName}
            </h2>
            <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 mt-1">
              {user?.age && (
                <p className="text-sm sm:text-base text-base-content/70">
                  Age: {user.age}
                </p>
              )}
              {user?.gender && (
                <p className="text-sm sm:text-base text-base-content/70 capitalize">
                  Gender: {user.gender}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        {user?.about && (
          <div className="mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
              About
            </h3>
            <p className="text-sm sm:text-base text-base-content/80 leading-relaxed">
              {user.about}
            </p>
          </div>
        )}

        {/* Skills Section */}
        {user?.skills && user.skills.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Skills
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {user.skills.map((skill, index) => (
                <div
                  key={index}
                  className="badge badge-primary text-xs sm:text-sm badge-md sm:badge-lg"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Connection Section */}
        <div className="card-actions justify-center sm:justify-end mt-3 sm:mt-4">
          <button
            className="btn btn-outline btn-error btn-sm sm:btn-md w-full sm:w-auto"
            onClick={() => onDelete && onDelete(user._id)}
          >
            <span className="text-xs sm:text-base">Delete Connection</span>
          </button>
        </div>
      </div>
    </div>
  );
}
