import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-80 dark:bg-gray-800"
      >
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-white">Admin Login</h2>

        {errMsg && <p className="text-red-500 text-sm mb-3">{errMsg}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;