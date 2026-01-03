import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

/* ================== BRAND-ALIGNED STATUS COLORS ================== */
const badgeColors = {
  PENDING: "bg-[#8a8a8a]/10 text-[#8a8a8a]",
  IN_PROGRESS: "bg-[#00bba3]/10 text-[#00bba3]",
  COMPLETED: "bg-[#00bba3] text-white",
};

/* ================== OVERVIEW CARD ================== */
const Card = ({ title, value, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
      isActive 
        ? "border-[#00bba3] bg-[#00bba3]/5 shadow-lg shadow-[#00bba3]/10" 
        : "border-slate-100 bg-white hover:border-[#00bba3]/30"
    }`}
  >
    <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-[#00bba3]" : "text-[#8a8a8a]"}`}>
      {title}
    </p>
    <p className={`text-3xl font-black mt-1 ${isActive ? "text-[#00bba3]" : "text-[#333]"}`}>
      {value}
    </p>
  </div>
);

/* ================== MAIN COMPONENT ================== */
const CeoDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================== FETCH DATA ================== */
  const fetchDashboardData = async (filter = "ALL") => {
    try {
      setLoading(true);
      setActiveFilter(filter);

      // Fetch Overview Stats
      const overviewRes = await api.get("/tasks/ceo/dashboard");
      setOverview(overviewRes.data.dashboard);

      // Determine URL based on brand filter logic
      let url = "/tasks/ceo/all";
      if (filter === "IN_PROGRESS") url = "/tasks/ceo/status/IN_PROGRESS";
      if (filter === "COMPLETED") url = "/tasks/ceo/status/COMPLETED";
      if (filter === "OVERDUE") url = "/tasks/ceo/overdue";

      const tasksRes = await api.get(url);
      setTasks(tasksRes.data.tasks || []);
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    fetchDashboardData("ALL");
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#8a8a8a] p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#00bba3] uppercase tracking-tighter">
            Executive Overview
          </h1>
          <p className="text-[10px] font-bold text-[#8a8a8a] uppercase tracking-widest opacity-70">
            Real-time Operational Insights
          </p>
        </div>
        <button 
          onClick={logout}
          className="text-[10px] font-black uppercase tracking-widest px-6 py-2 border-2 border-[#8a8a8a]/20 hover:border-red-400 hover:text-red-500 rounded-full transition-all"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* STATS CARDS */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-12">
          {overview && (
            <>
              <Card
                title="Total Tasks"
                value={overview.totalTasks}
                isActive={activeFilter === "ALL"}
                onClick={() => fetchDashboardData("ALL")}
              />
              <Card
                title="In Progress"
                value={overview.inProgressTasks}
                isActive={activeFilter === "IN_PROGRESS"}
                onClick={() => fetchDashboardData("IN_PROGRESS")}
              />
              <Card
                title="Completed"
                value={overview.completedTasks}
                isActive={activeFilter === "COMPLETED"}
                onClick={() => fetchDashboardData("COMPLETED")}
              />
              <Card
                title="Overdue"
                value={overview.overdueTasks}
                isActive={activeFilter === "OVERDUE"}
                onClick={() => fetchDashboardData("OVERDUE")}
              />
            </>
          )}
        </div>

        {/* TASK SECTION HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#333]">
            {activeFilter.replace("_", " ")} Tasks List
          </h2>
          <div className="h-[2px] flex-grow mx-4 bg-[#8a8a8a]/10"></div>
        </div>

        {loading ? (
          <div className="py-20 text-center animate-pulse font-bold uppercase text-[10px] tracking-widest">
            Syncing database...
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-sm font-bold opacity-50 uppercase">No records found for this category</p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#8a8a8a]/5 text-[#8a8a8a] text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Task Details</th>
                    <th className="px-6 py-4">Assigned To</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4 text-right">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tasks.map((t) => (
                    <tr key={t._id} className="hover:bg-[#00bba3]/5 transition-colors group">
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-[#333] group-hover:text-[#00bba3] transition-colors">{t.title}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#8a8a8a]/20 flex items-center justify-center text-[8px] font-bold">👤</div>
                          <span className="text-xs font-medium">{t.assignedTo?.name || "System Unassigned"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-md tracking-tighter ${badgeColors[t.status] || "bg-slate-100"}`}>
                          {t.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-xs">
                        {t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="grid gap-4 md:hidden">
              {tasks.map((t) => (
                <div key={t._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-[#333] text-sm leading-tight">{t.title}</h3>
                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${badgeColors[t.status]}`}>
                      {t.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50 text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-[#8a8a8a]">{t.assignedTo?.name || "Unassigned"}</span>
                    <span className="text-[#333]">{t.deadline ? new Date(t.deadline).toLocaleDateString() : "No Date"}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CeoDashboard;