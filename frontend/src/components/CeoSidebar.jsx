import { NavLink } from "react-router-dom";

const CeoSidebar = ({ open, onClose }) => {
  // Base style for all links
  const baseLinkClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-200 mb-1";

  // Style applied when link is active vs inactive
  const getLinkClass = ({ isActive }) =>
    isActive
      ? `${baseLinkClass} bg-[#00bba3] text-white shadow-lg shadow-[#00bba3]/20`
      : `${baseLinkClass} text-[#8a8a8a] hover:bg-[#00bba3]/5 hover:text-[#00bba3]`;

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#8a8a8a]/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed md:static z-50 md:z-auto  
        w-72 min-h-screen bg-white border-r border-[#8a8a8a]/10 p-6
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* LOGO SECTION */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-[#00bba3]/10 p-2 rounded-xl">
            <img
              src="/Brightex-logo.png"
              alt="Brightex Logo"
              className="h-8 w-8 object-contain"
            />
          </div>
          <div>
            <h2 className="text-sm font-black text-[#333] uppercase tracking-tighter leading-tight">
              Brightex
            </h2>
            <p className="text-[9px] font-bold text-[#00bba3] uppercase tracking-[0.2em]">
              Executive
            </p>
          </div>
        </div>

        {/* UI SEPARATOR LINE */}
        <div className="h-px bg-[#8a8a8a]/10 mb-8" />

        <nav className="space-y-1">
          {/* SECTION LABEL */}
          <p className="text-[9px] font-black text-[#8a8a8a]/50 uppercase tracking-[0.2em] mb-4 px-4">
            Main Menu
          </p>

          <NavLink to="/ceo/dashboard" className={getLinkClass}>
            <span className="text-lg">📊</span>
            Dashboard
          </NavLink>

          <NavLink to="/ceo/employees" className={getLinkClass}>
            <span className="text-lg">👥</span>
            Staff Management
          </NavLink>

          {/* UI SEPARATOR LINE */}
          <div className="h-px bg-[#8a8a8a]/10 my-6 mx-4" />

          {/* SECTION LABEL */}
          <p className="text-[9px] font-black text-[#8a8a8a]/50 uppercase tracking-[0.2em] mb-4 px-4">
            Operations
          </p>

          <NavLink to="/ceo/assign-task" className={getLinkClass}>
            <span className="text-lg">📝</span>
            Assign Task
          </NavLink>

          <NavLink to="/ceo/pending" className={getLinkClass}>
            <span className="text-lg">⏳</span>
            Overdue Work
          </NavLink>
        </nav>

        {/* FOOTER SECTION */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="h-px bg-[#8a8a8a]/10 mb-6" />
          <div className="bg-[#8a8a8a]/5 rounded-2xl p-4">
            <p className="text-[9px] font-black text-[#8a8a8a] uppercase tracking-widest mb-1 text-center">
              System Online
            </p>
            <div className="flex justify-center items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00bba3] animate-pulse" />
              <span className="text-[8px] font-bold text-[#8a8a8a]/60 uppercase">
                Cloud Sync Active
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CeoSidebar;
