import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GroupDetails from "./pages/GroupDetails";
import PublicLeaderboard from "./pages/PublicLeaderboard";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-slate-50 dark:bg-[#0c0c14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/:id/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/group/:id" element={<ProtectedRoute><GroupDetails /></ProtectedRoute>} />
                  <Route path="/leaderboard/:id" element={<PublicLeaderboard />} />
                </Routes>
              </main>
            </div>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;