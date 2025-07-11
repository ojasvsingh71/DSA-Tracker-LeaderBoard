import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GroupDetails from "./pages/GroupDetails";
import PublicLeaderboard from "./pages/PublicLeaderboard";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:id/dashboard" element={<Dashboard />} />
          <Route path="/group/:id" element={<GroupDetails />} />
          <Route path="/public/leaderboard/:id" element={<PublicLeaderboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;