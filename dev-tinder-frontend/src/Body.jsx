// Importing required modules
import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

/**
 * Body component - Layout wrapper for all pages
 * Contains NavBar, Outlet (for child routes), and Footer
 */
const Body = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <NavBar />
      
      {/* Main Content Area - Renders child routes */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Body;
