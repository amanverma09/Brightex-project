import { NavLink } from "react-router-dom";

const EmployeeSidebar = ({ open, onClose }) => {
  const linkClass = "block px-4 py-2 rounded-lg text-sm hover:bg-slate-700";

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static z-50 md:z-auto
        w-60 min-h-screen bg-slate-800 border-r border-slate-700 p-4
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="text-xl font-semibold text-emerald-400 mb-6">
          Brightex Employee
        </h2>

        <nav className="space-y-2">
          <NavLink to="/employee/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/employee/tasks" className={linkClass}>
            My Tasks
          </NavLink>
        </nav>



      </aside>
    </>
  );
};

export default EmployeeSidebar;
