import { NavLink } from "react-router-dom";

const CeoSidebar = ({ open, onClose }) => {
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
        w-64 min-h-screen bg-slate-800 border-r border-slate-700 p-4
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="text-xl font-semibold text-sky-400 mb-6">
          Brightex CEO
        </h2>

        <nav className="space-y-2">
          <NavLink to="/ceo/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
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
      </aside>
    </>
  );
};

export default CeoSidebar;
