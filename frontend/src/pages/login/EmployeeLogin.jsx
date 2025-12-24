import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/employee/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "EMPLOYEE");

      navigate("/employee/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-emerald-400 mb-2">
          Employee Login
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Login to view your tasks and update work status
        </p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Employee Email"
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold transition"
          >
            Login
          </button>
        </form>

        {/* Optional helper link */}
        <div className="mt-6 text-center">
          <a href="/ceo-login" className="text-sm text-slate-400 hover:text-sky-400">
            Login as CEO instead
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
