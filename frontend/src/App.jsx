import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GroupDetails from "./pages/GroupDetails";
import PublicLeaderboard from "./pages/PublicLeaderboard";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:id/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/group/:id" element={<ProtectedRoute><GroupDetails /></ProtectedRoute>} />
          <Route path="/leaderboard/:id" element={<ProtectedRoute><PublicLeaderboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;