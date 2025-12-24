// importing React modules
import { StrictMode } from "react";
// importing createRoot function for rendering React app
import { createRoot } from "react-dom/client";
// importing CSS file for styling
import "./index.css";
// importing main App component
import App from "./App.jsx";

// getting the root element from HTML (the div with id="root")
// then rendering our App component inside it
// StrictMode helps find potential problems in development
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
