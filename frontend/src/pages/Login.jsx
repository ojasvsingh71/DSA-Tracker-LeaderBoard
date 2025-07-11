import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/admin/login", { email, password });
      console.log(res.data);
      login(res.data.user, res.data.token);
      navigate(`/${res.data.user.adminId}/dashboard`);
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 px-4 py-10">
      <div className="bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-gray-700 p-8 rounded-xl shadow-xl w-full max-w-md space-y-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-white tracking-tight">
            Admin Login
          </h2>

          {errMsg && (
            <div className="text-sm text-red-500 bg-red-100 dark:bg-red-900 p-2 rounded">
              {errMsg}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
          >
            🔐 Login
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          📝 Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline dark:text-indigo-400 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;