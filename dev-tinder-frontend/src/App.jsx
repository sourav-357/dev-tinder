// Importing required modules
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Body from "./Body";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Feed from "./components/feed/Feed";
import ProfileView from "./components/profile/ProfileView";
import ProfileEdit from "./components/profile/ProfileEdit";
import UpdatePassword from "./components/profile/UpdatePassword";
import RequestsList from "./components/requests/RequestsList";
import ConnectionsList from "./components/connections/ConnectionsList";
import ProtectedRoute from "./components/common/ProtectedRoute";

/**
 * Main App component
 * Sets up routing and authentication context
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/">
        <Routes>
          {/* Layout Route with NavBar and Footer */}
          <Route path="/" element={<Body />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes - Require Authentication */}
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <ProfileEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/update-password"
              element={
                <ProtectedRoute>
                  <UpdatePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <RequestsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/connections"
              element={
                <ProtectedRoute>
                  <ConnectionsList />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
