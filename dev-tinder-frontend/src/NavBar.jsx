// importing React
import React from "react";
// importing Link and useNavigate from react-router-dom for navigation
import { Link, useNavigate } from "react-router-dom";
// importing useAuth hook to access user data and logout function
import { useAuth } from "./context/AuthContext";

// NavBar component - shows navigation links at the top of every page
// shows different links based on whether user is logged in or not
const NavBar = () => {
  // useNavigate hook allows us to programmatically navigate to different pages
  const navigate = useNavigate();
  
  // getting user data and logout function from AuthContext
  // user will be null if not logged in, or user object if logged in
  const { user, logout } = useAuth();

  // function to handle logout when user clicks logout button
  const handleLogout = async () => {
    // calling logout function from context (this clears user data and calls backend)
    await logout();
    // redirecting to home page after logout
    navigate("/");
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      {/* Logo/Brand */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl mx-7">
          👨‍🎓 DevTinder🌴
        </Link>
      </div>

      {/* Navigation Links */}
      {user ? (
        <>
          {/* Authenticated User Navigation */}
          <div className="flex-none gap-2">
            <Link to="/feed" className="btn btn-ghost">
              Feed
            </Link>
            <Link to="/requests" className="btn btn-ghost">
              Requests
            </Link>
            <Link to="/connections" className="btn btn-ghost">
              Connections
            </Link>
            
            {/* User Dropdown Menu */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    src={
                      user?.photoUrl ||
                      "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Guest User Navigation */}
          <div className="flex-none gap-2">
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;
