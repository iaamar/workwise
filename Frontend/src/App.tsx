import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import the ToastContainer component

// Import different page components
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProjectsPage from "./pages/ProjectsPage";
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import BoardView from "./pages/BoardView";
import ProjectSettings from "./pages/ProjectSettings";
import ProjectLayout from "./components/ProjectLayout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PasswordResetPage from "./pages/PasswordResetPage";

// Main App component
function App() {
  return (
    <>
      {/* Define application routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId/*" element={<ProjectLayout />}>
            <Route index element={<Navigate to="board" />} />
            <Route path="board" element={<BoardView />} />
            <Route path="settings" element={<ProjectSettings />} />
          </Route>
        </Route>
      </Routes>

      {/* Display a ToastContainer for notifications */}
      <ToastContainer />
    </>
  );
}

export default App;
