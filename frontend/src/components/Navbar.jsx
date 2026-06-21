import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, LogOut, LayoutDashboard, Terminal, Activity } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const adminId = user?.adminId || user?._id;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-[#00ffcc]/20 bg-white/95 dark:bg-[#05050a]/90 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link
              to={user ? `/${adminId}/dashboard` : "/"}
              className="flex items-center gap-2.5 group"
            >
              <div className="p-2 bg-transparent border border-indigo-500/30 dark:border-[#00ffcc]/40 text-indigo-600 dark:text-[#00ffcc] hover:shadow-[0_0_10px_rgba(0,255,204,0.3)] rounded-lg transition-transform">
                <Terminal className="w-5 h-5 animate-pulse" />
              </div>
              <span className="font-black tracking-widest text-slate-900 dark:text-[#00ffcc] dark:text-neon-cyan uppercase text-lg sm:text-xl font-display">
                DSA_TRACKER
              </span>
            </Link>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-slate-200 dark:border-[#00ffcc]/20 hover:border-slate-400 dark:hover:border-[#00ffcc]/50 hover:bg-slate-50 dark:hover:bg-[#00ffcc]/5 rounded-xl transition cursor-pointer text-slate-600 dark:text-[#00ffcc]"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {user ? (
              <>
                {/* Dashboard Link */}
                <Link
                  to={`/${adminId}/dashboard`}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-[#00ffcc]/25 hover:border-slate-400 dark:hover:border-[#00ffcc] hover:bg-slate-50 dark:hover:bg-[#00ffcc]/5 text-slate-700 dark:text-[#00ffcc] rounded-xl transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>DASHBOARD</span>
                </Link>

                {/* User Welcome */}
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">// admin_active</span>
                  <span className="text-slate-800 dark:text-white font-bold tracking-wider">
                    {user.name}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 border border-rose-500/30 hover:border-rose-500 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl transition cursor-pointer font-bold"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">DISCONNECT</span>
                </button>
              </>
            ) : (
              <Link
                to="/"
                className="px-4 py-2 border border-slate-300 dark:border-[#00ffcc] hover:bg-slate-50 dark:hover:bg-[#00ffcc]/10 hover:shadow-[0_0_12px_rgba(0,255,204,0.3)] text-slate-700 dark:text-white rounded-xl transition font-bold"
              >
                CONNECT_NODE
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
