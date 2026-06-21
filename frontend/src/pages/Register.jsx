import { useState, useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { Mail, Lock, User, Eye, EyeOff, Award, ArrowRight, Flame, Trophy, Sparkles, Terminal, Activity } from "lucide-react";

const Register = () => {
  const { showToast } = useContext(ToastContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/admin/register", form);
      showToast("Registration successful! Authorization key established.", "success");
      navigate("/");
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed. Node registration rejected.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#030307] text-[#00ffcc] relative overflow-hidden">
      {/* Laser grid overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-[0.03]" />
      
      {/* Glow Sweeps */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2.5s" }} />

      {/* Left Panel: Form Container */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative z-10 border-b lg:border-b-0 lg:border-r border-[#00ffcc]/20">
        <div className="w-full max-w-md space-y-8 bg-[#0a0a14]/80 border border-[#00ffcc]/30 p-8 rounded-2xl cyber-corners shadow-[0_0_20px_rgba(0,255,204,0.1)] relative">
          {/* Cyber decorators */}
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[#00ffcc]/50 to-transparent" />
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#00ffcc]" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#00ffcc]" />

          {/* Header branding */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-500 uppercase tracking-widest text-neon-magenta">
              <Terminal className="w-4 h-4 animate-pulse" />
              <span>// register_new_node</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider text-neon-cyan flex items-center gap-2">
              <Activity className="w-6 h-6 text-[#00ffcc]" />
              <span>Register Node</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Initialize admin credentials to configure new telemetry tracking structures.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-transparent font-mono text-sm">
            {/* Full Name prompt */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                [USER_DISPLAY_NAME]
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#00ffcc]/60">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Ojasv Singh"
                  className="w-full pl-10 pr-4 py-3 bg-black/60 border border-[#00ffcc]/35 text-[#00ffcc] placeholder-[#00ffcc]/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00ffcc] focus:border-[#00ffcc] font-mono text-sm transition-all"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email prompt */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                [COMMUNICATION_LINK / EMAIL]
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#00ffcc]/60">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="name@command_node.org"
                  className="w-full pl-10 pr-4 py-3 bg-black/60 border border-[#00ffcc]/35 text-[#00ffcc] placeholder-[#00ffcc]/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00ffcc] focus:border-[#00ffcc] font-mono text-sm transition-all"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password prompt */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                [CREATE_ACCESS_KEY]
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#00ffcc]/60">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-black/60 border border-[#00ffcc]/35 text-[#00ffcc] placeholder-[#00ffcc]/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00ffcc] focus:border-[#00ffcc] font-mono text-sm transition-all"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#00ffcc]/60 hover:text-[#00ffcc] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 bg-transparent hover:bg-[#00ffcc]/10 border border-[#00ffcc] hover:shadow-[0_0_15px_rgba(0,255,204,0.3)] text-white hover:text-[#00ffcc] rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Transmitting credentials...</span>
                </div>
              ) : (
                <>
                  <span>Create Command Node</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#00ffcc]/10 text-center text-xs font-mono text-slate-400">
            Link verified?{" "}
            <Link
              to="/"
              className="text-fuchsia-500 hover:text-fuchsia-400 hover:underline font-bold text-neon-magenta"
            >
              Log in at command gate
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel: Holographic features showcase */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-black items-center justify-center p-12">
        <div className="absolute inset-0 bg-[#06060c] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(#00ffcc_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-[0.02]" />

        <div className="relative w-full max-w-lg space-y-6 z-10">
          <div className="text-center space-y-2 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-bold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 rounded-md uppercase tracking-widest text-neon-magenta">
              <Sparkles className="w-3.5 h-3.5" />
              <span>[HOLOGRAPHIC DATASTREAM]</span>
            </span>
            <h3 className="text-2xl font-black uppercase text-white tracking-widest text-neon-cyan font-display">
              LEADERBOARD PROTOCOL
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto font-mono">
              Consolidated real-time telemetry metrics compiled from external DSA database clusters.
            </p>
          </div>

          {/* Sci-Fi Ranks Grid */}
          <div className="space-y-4 font-mono">
            {/* Rank 1 */}
            <div className="bg-black/80 border border-[#00ffcc]/35 p-4 rounded-xl flex items-center justify-between shadow-[0_0_12px_rgba(0,255,204,0.05)] transform -translate-x-4 border-l-4 border-l-amber-400">
              <div className="flex items-center gap-3">
                <span className="text-[#00ffcc] font-bold text-sm">[01]</span>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Ojasv Singh</h4>
                  <span className="text-[10px] text-slate-500">// LC: ojasvsingh71</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#00ffcc] block text-neon-cyan">340 SOLVED</span>
                <span className="text-[9px] text-[#00ffcc]/60 uppercase tracking-widest">Contest: 2145</span>
              </div>
            </div>

            {/* Rank 2 */}
            <div className="bg-black/80 border border-[#00ffcc]/35 p-4 rounded-xl flex items-center justify-between shadow-[0_0_12px_rgba(0,255,204,0.05)] border-l-4 border-l-cyan-400">
              <div className="flex items-center gap-3">
                <span className="text-[#00ffcc] font-bold text-sm">[02]</span>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Aditya Vardhan</h4>
                  <span className="text-[10px] text-slate-500">// CF: adityav</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#00ffcc] block text-neon-cyan">212 SOLVED</span>
                <span className="text-[9px] text-cyan-400 uppercase tracking-widest">CF: 1540</span>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="bg-black/80 border border-[#00ffcc]/35 p-4 rounded-xl flex items-center justify-between shadow-[0_0_12px_rgba(0,255,204,0.05)] transform translate-x-4 border-l-4 border-l-rose-500">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-rose-500/10 text-rose-500 rounded">
                  <Flame className="w-4 h-4 animate-pulse text-neon-magenta" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Daily Streaks</h4>
                  <span className="text-[10px] text-slate-500">// Consistency monitoring modules</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-rose-400 block text-neon-magenta">45 DAYS</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">[ONLINE]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;