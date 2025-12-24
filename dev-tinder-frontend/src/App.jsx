// importing React Router modules for navigation
import { BrowserRouter, Routes, Route } from "react-router-dom";
// importing AuthProvider to wrap app with authentication context
import { AuthProvider } from "./context/AuthContext";
// importing Body component which contains NavBar and Footer
import Body from "./Body";
// importing page components
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Feed from "./components/feed/Feed";
import ProfileView from "./components/profile/ProfileView";
import ProfileEdit from "./components/profile/ProfileEdit";
import UpdatePassword from "./components/profile/UpdatePassword";
import RequestsList from "./components/requests/RequestsList";
import ConnectionsList from "./components/connections/ConnectionsList";
// importing ProtectedRoute to guard routes that need authentication
import ProtectedRoute from "./components/common/ProtectedRoute";

// main App component - sets up all the routes for our application
function App() {
  return (
    // AuthProvider wraps everything so all components can access user data
    <AuthProvider>
      {/* BrowserRouter enables routing in our app */}
      <BrowserRouter basename="/">
        <Routes>
          {/* Body component contains NavBar and Footer, all routes are children */}
          <Route path="/" element={<Body />}>
            {/* public routes - anyone can access these */}
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* protected routes - only logged in users can access these */}
            {/* ProtectedRoute checks if user is logged in, if not redirects to login */}
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
