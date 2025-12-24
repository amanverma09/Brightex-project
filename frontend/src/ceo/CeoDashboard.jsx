import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

/* ================== STATUS BADGE COLORS ================== */
const badgeColors = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400",
  COMPLETED: "bg-emerald-500/20 text-emerald-400",
};

/* ================== OVERVIEW CARD ================== */
const Card = ({ title, value }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
    <p className="text-sm text-slate-400">{title}</p>
    <p className="text-2xl font-semibold text-slate-100 mt-1">{value}</p>
  </div>
);

/* ================== MAIN COMPONENT ================== */
const CeoDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================== FETCH ALL DATA (EASY WAY) ================== */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const overviewRes = await api.get("/tasks/ceo/dashboard");
      const tasksRes = await api.get("/tasks/ceo/all");

      setOverview(overviewRes.data.dashboard);
      setTasks(tasksRes.data.tasks || []);

      console.log("ALL TASKS:", tasksRes.data.tasks);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================== LOGOUT ================== */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  /* ================== ON LOAD ================== */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* ================== UI ================== */
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <h1 className="text-xl font-semibold text-sky-400">CEO Dashboard</h1>
        <button
          onClick={logout}
          className="text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
        >
          Logout
        </button>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* OVERVIEW */}
        <h2 className="text-lg font-medium mb-4">Overview</h2>

        {loading && <p className="text-slate-400">Loading dashboard...</p>}

        {overview && !loading && (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <Card title="Total Tasks" value={overview.totalTasks} />
            <Card title="Pending" value={overview.pendingTasks} />
            <Card title="In Progress" value={overview.inProgressTasks} />
            <Card title="Completed" value={overview.completedTasks} />
            <Card title="Overdue" value={overview.overdueTasks} />
          </div>
        )}

        {/* TASKS */}
        <h2 className="text-lg font-medium mt-8 mb-4">All Tasks</h2>

        {!loading && tasks.length === 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center text-slate-400">
            No tasks created yet
          </div>
        )}

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <thead className="bg-slate-900 text-slate-400 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Task</th>
                <th className="px-4 py-3 text-left">Employee</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t._id} className="border-t border-slate-700">
                  <td className="px-4 py-3">{t.title}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {t.assignedTo?.name || "Unassigned"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${badgeColors[t.status] ||
                        "bg-slate-500/20 text-slate-300"
                        }`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {t.deadline
                      ? new Date(t.deadline).toLocaleDateString()
                      : "No deadline"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="grid gap-4 md:hidden">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4"
            >
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm text-slate-400">
                {t.assignedTo?.name || "Unassigned"}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${badgeColors[t.status] || "bg-slate-500/20 text-slate-300"
                    }`}
                >
                  {t.status.replace("_", " ")}
                </span>
                <span className="text-xs text-slate-400">
                  {t.deadline
                    ? new Date(t.deadline).toLocaleDateString()
                    : "No deadline"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CeoDashboard;
