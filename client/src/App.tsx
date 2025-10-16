import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./features/Auth/Login";
import Register from "./features/Auth/Register";
import Library from "./pages/Library";
import LandingPage from "./pages/LandingPage";
import ReadingView from "./components/ReadingView";
import BooksList from "./components/BooksList";
import DashboardLayout from "./layouts/DashboardLayout"; 

// PrivateRoute to protect routes
const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="text-center p-10">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/library" element={<Library />} />
        <Route path="/bookslist" element={<BooksList />} />
        <Route path="/history" element={<div>History Page Coming Soon...</div>} />
      </Route>

      <Route
        path="/read/:sessionId"
        element={
          <PrivateRoute>
            <ReadingView userToken={token} />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
