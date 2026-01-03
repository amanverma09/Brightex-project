import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import CeoSidebar from "../components/CeoSidebar";

const CeoLayout = ({ children }) => {
  const navigate = useNavigate();

  /* ========== SIDEBAR STATE (RESPONSIVE) ========== */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ========== PROFILE STATES ========== */
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  /* ========== SEARCH STATE ========== */
  const [searchQuery, setSearchQuery] = useState("");

  /* ========== FETCH PROFILE ========== */
  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setProfile({
        name: res.data.user.name,
        email: res.data.user.email,
        password: "",
      });
    } catch (e) {
      console.error("Profile fetch failed", e);
    }
  };

  /* ========== UPDATE PROFILE ========== */
  const updateProfile = async (e) => {
    e.preventDefault();
    setProfileError("");

    try {
      setProfileLoading(true);
      const payload = {
        name: profile.name,
        email: profile.email,
      };

      if (profile.password) payload.password = profile.password;

      await api.put("/auth/update-profile", payload);
      setProfileOpen(false);
    } catch (err) {
      setProfileError(err.response?.data?.message || "Profile update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex bg-white min-h-screen overflow-hidden font-sans">
      {/* SIDEBAR */}
      <CeoSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ================= HEADER ================= */}
        <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b border-[#8a8a8a]/10 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-[#8a8a8a] hover:bg-[#8a8a8a]/10 rounded-lg"
            >
              <span className="text-xl">☰</span>
            </button>

            {/* SEARCH BAR */}
            <div className="relative max-w-md w-full hidden sm:block">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a8a] text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search tasks, employees or records..."
                className="w-full bg-[#8a8a8a]/5 border border-transparent focus:border-[#00bba3]/30 focus:bg-white focus:ring-0 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium text-[#333] transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* NOTIFICATION DOT (UI ONLY) */}
            <div className="relative p-2 text-[#8a8a8a] cursor-pointer hover:bg-[#8a8a8a]/5 rounded-full">
              <span className="text-lg">🔔</span>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#00bba3] rounded-full border-2 border-white"></span>
            </div>

            {/* SEPARATOR */}
            <div className="h-8 w-px bg-[#8a8a8a]/10 hidden xs:block"></div>

            {/* PROFILE SECTION */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black text-[#333] uppercase tracking-tighter leading-none">
                  {profile.name || "Administrator"}
                </p>
                <p className="text-[9px] font-bold text-[#00bba3] uppercase tracking-widest mt-1">
                  CEO
                </p>
              </div>

              <button
                onClick={() => setProfileOpen(true)}
                className="w-10 h-10 rounded-xl bg-[#00bba3] flex items-center justify-center text-white shadow-lg shadow-[#00bba3]/20 hover:scale-105 transition-transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button
                onClick={logout}
                className="hidden md:block text-[10px] font-black uppercase tracking-widest text-[#8a8a8a] hover:text-red-500 transition-colors ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#8a8a8a]/5">
          <div className="">{children}</div>
        </main>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {profileOpen && (
        <div className="fixed inset-0 bg-[#8a8a8a]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={updateProfile}
            className="bg-white border-2 border-[#00bba3] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
          >
            <div className="bg-[#00bba3] p-6 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-3">
                {profile.name?.charAt(0)?.toUpperCase()}
              </div>
              <h2 className="text-lg font-black uppercase tracking-tighter">
                Account Settings
              </h2>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">
                Update your administrative profile
              </p>
            </div>

            <div className="p-6 space-y-4">
              {profileError && (
                <p className="text-red-500 text-[10px] font-bold bg-red-50 p-3 rounded-lg border border-red-100 uppercase tracking-widest text-center">
                  ⚠️ {profileError}
                </p>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[#8a8a8a] tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-3 bg-white text-[#333] border border-[#8a8a8a]/20 rounded-xl focus:border-[#00bba3] outline-none text-sm transition-all font-medium"
                  placeholder="Name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[#8a8a8a] tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white text-[#333] border border-[#8a8a8a]/20 rounded-xl focus:border-[#00bba3] outline-none text-sm transition-all font-medium"
                  placeholder="Email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[#8a8a8a] tracking-widest ml-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-white text-[#333] border border-[#8a8a8a]/20 rounded-xl focus:border-[#00bba3] outline-none text-sm transition-all font-medium"
                  placeholder="Leave blank to keep current"
                  value={profile.password}
                  onChange={(e) =>
                    setProfile({ ...profile, password: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="w-1/2 py-3 text-[#8a8a8a] font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>

                <button
                  disabled={profileLoading}
                  className="w-1/2 py-3 bg-[#00bba3] text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-[#00bba3]/20 hover:bg-[#00a38d] transition-all"
                >
                  {profileLoading ? "Syncing..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CeoLayout;
