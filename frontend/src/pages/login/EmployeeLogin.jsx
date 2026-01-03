import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api";

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
        err.response?.data?.message || "Authorization failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT SIDE: BRAND HERO (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#00bba3] items-center justify-center p-12 relative overflow-hidden">
        {/* Subtle background pattern decoration */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-3xl mb-8 backdrop-blur-md border border-white/20">
            <img
              src="/Brightex-logo.png"
              alt="Brightex"
              className="h-14 w-14 object-contain brightness-0 invert"
            />
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Brightex <span className="font-light opacity-70">Team</span>
          </h1>
          <p className="text-white/60 text-sm font-bold uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed">
            Standard Operating Portal for Workforce & Task Management
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-[#f8fafc]">
        <div className="w-full max-w-md">
          {/* MOBILE ONLY LOGO */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 bg-[#00bba3] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00bba3]/20">
              <img
                src="/Brightex-logo.png"
                alt="Logo"
                className="h-10 w-10 brightness-0 invert"
              />
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
              Employee Login
            </h2>
            <p className="text-[#8a8a8a] text-xs font-bold uppercase tracking-widest mt-2">
              Identity Verification Required
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl animate-in slide-in-from-top-2">
              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-tight">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* EMAIL INPUT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#8a8a8a] uppercase tracking-[0.2em] ml-1">
                Employee Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  📧
                </span>
                <input
                  type="email"
                  placeholder="name@brightex.com"
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm focus:outline-none focus:border-[#00bba3] focus:ring-4 focus:ring-[#00bba3]/5 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD INPUT WITH EYE TOGGLE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#8a8a8a] uppercase tracking-[0.2em] ml-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm focus:outline-none focus:border-[#00bba3] focus:ring-4 focus:ring-[#00bba3]/5 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00bba3] transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#00bba3] hover:bg-[#00a38d] text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#00bba3]/30 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
            >
              {loading ? "Authenticating..." : "Login to Workspace"}
            </button>
          </form>

          {/* PORTAL SWITCHER */}
          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Administrative Personnel?
            </p>
            <Link
              to="/ceo-login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#00bba3]/20 text-[#00bba3] text-[10px] font-black uppercase tracking-widest hover:bg-[#00bba3]/5 transition-all"
            >
              💼 Login as CEO
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col items-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
              Secured Workspace Environment
            </p>
            <div className="flex gap-2 mt-4">
              <div className="w-1 h-1 rounded-full bg-[#00bba3]"></div>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;