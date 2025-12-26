import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import EmployeeSidebar from "../components/EmployeeSidebar";

const EmployeeLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ===== PROFILE STATES (MOVED FROM DASHBOARD) ===== */
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  /* ===== FETCH PROFILE ===== */
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

  /* ===== UPDATE PROFILE ===== */
  const updateProfile = async (e) => {
    e.preventDefault();
    setProfileError("");

    try {
      setProfileLoading(true);

      const payload = {
        name: profile.name,
        email: profile.email,
      };

      if (profile.password.trim()) {
        payload.password = profile.password;
      }

      await api.put("/auth/update-profile", payload);
      setProfileOpen(false);
      setProfile({ ...profile, password: "" });
    } catch (err) {
      setProfileError(
        err.response?.data?.message || "Profile update failed"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  /* ===== LOGOUT ===== */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex bg-slate-900 text-slate-200 min-h-screen overflow-hidden">
      {/* SIDEBAR */}
      <EmployeeSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* ================= HEADER ================= */}
        <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {/* MOBILE MENU */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden px-3 py-2 bg-slate-800 rounded"
            >
              ☰
            </button>

            <h1 className="text-lg md:text-xl font-semibold text-emerald-400">
              Employee Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* PROFILE ICON */}
            <button
              onClick={() => setProfileOpen(true)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 
              flex items-center justify-center text-white font-semibold shadow"
            >
              {profile.name?.charAt(0)?.toUpperCase() || "U"}
            </button>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {profileOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={updateProfile}
            className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 space-y-4 text-sm"
          >
            <h2 className="text-lg font-semibold text-emerald-400">
              Edit Profile
            </h2>

            {profileError && (
              <p className="text-red-400 text-xs">{profileError}</p>
            )}

            <input
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded"
              placeholder="Name"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />

            <input
              type="email"
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded"
              placeholder="Email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />

            <input
              type="password"
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded"
              placeholder="New Password (optional)"
              value={profile.password}
              onChange={(e) =>
                setProfile({ ...profile, password: e.target.value })
              }
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="px-4 py-2 bg-slate-800 rounded"
              >
                Cancel
              </button>

              <button
                disabled={profileLoading}
                className="px-4 py-2 bg-emerald-500 text-slate-900 rounded font-semibold"
              >
                {profileLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeLayout;
