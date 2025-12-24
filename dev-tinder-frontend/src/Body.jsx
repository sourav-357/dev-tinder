// importing React
import React from "react";
// importing NavBar component for navigation
import NavBar from "./NavBar";
// importing Outlet from react-router-dom - this renders child routes
import { Outlet } from "react-router-dom";
// importing Footer component
import Footer from "./Footer";

// Body component - this is the layout wrapper for all pages
// it contains NavBar at top, Outlet in middle (where page content goes), Footer at bottom
const Body = () => {
  return (
    // flex flex-col makes it a vertical flexbox (stacked vertically)
    // min-h-screen makes it at least full screen height
    <div className="flex flex-col min-h-screen">
      {/* navigation bar at the top */}
      <NavBar />
      
      {/* main content area - Outlet renders whatever child route is active */}
      {/* flex-1 makes it take up remaining space between NavBar and Footer */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* footer at the bottom */}
      <Footer />
    </div>
  );
};

export default Body;
