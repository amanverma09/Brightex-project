import { NavLink, useNavigate } from "react-router-dom";

const EmployeeSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const linkClass = "block px-4 py-2 rounded-lg text-sm hover:bg-slate-700";

  return (
    <div className="w-60 min-h-screen bg-slate-800 border-r border-slate-700 p-4">
      <h2 className="text-xl font-semibold text-emerald-400 mb-6">
        Brightex Employee
      </h2>

      <nav className="space-y-2">
        <NavLink to="/employee/dashboard" className={linkClass}>
          My Tasks
        </NavLink>
      </nav>

      <button
        onClick={logout}
        className="mt-10 w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default EmployeeSidebar;
