// Importing required modules
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Get root element and render the App component
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
