import { NavLink, useNavigate } from "react-router-dom";

const CeoSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const linkClass = "block px-4 py-2 rounded-lg text-sm hover:bg-slate-700";

  return (
    <div className="w-64 min-h-screen bg-slate-800 border-r border-slate-700 p-4">
      <h2 className="text-xl font-semibold text-sky-400 mb-6">Brightex CEO</h2>

      <nav className="space-y-2">
        <NavLink to="/ceo/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        {/* 
        <NavLink to="/ceo/create-employee" className={linkClass}>
          Create Employee
        </NavLink> */}

        <NavLink to="/ceo/employees" className={linkClass}>
          Employees
        </NavLink>

        <NavLink to="/ceo/assign-task" className={linkClass}>
          Assign Task
        </NavLink>

        <NavLink to="/ceo/pending" className={linkClass}>
          Pending Work
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

export default CeoSidebar;
