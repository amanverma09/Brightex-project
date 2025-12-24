import { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const CeoLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/ceo/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "CEO");
      navigate("/ceo/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-sky-400 mb-2">CEO Login</h2>
        <p className="text-slate-400 text-sm mb-6">
          Access Brightex Management Portal
        </p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-slate-900 font-semibold transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default CeoLogin;
