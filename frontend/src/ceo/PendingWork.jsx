import { useEffect, useState } from "react";
import api from "../api/api";

const badgeColors = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400",
};

const PendingWork = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await api.get("/tasks/ceo/pending");
      setTasks(res.data.tasks || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <h1 className="text-xl font-semibold text-red-400 mb-4">
        Pending / Overdue Work
      </h1>

      {loading && <p className="text-slate-400">Loading overdue tasks...</p>}

      {!loading && tasks.length === 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center text-slate-400">
          🎉 No overdue tasks
        </div>
      )}

      {/* Desktop table */}
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
                  {t.assignedTo?.name}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      badgeColors[t.status]
                    }`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-red-400">
                  {new Date(t.deadline).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {tasks.map((t) => (
          <div
            key={t._id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4"
          >
            <h3 className="font-semibold">{t.title}</h3>
            <p className="text-sm text-slate-400">{t.assignedTo?.name}</p>

            <div className="flex items-center justify-between mt-3">
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  badgeColors[t.status]
                }`}
              >
                {t.status.replace("_", " ")}
              </span>
              <span className="text-xs text-red-400">
                {new Date(t.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingWork;
