import { useEffect, useState } from "react";
import api from "../api/api";

const badgeColors = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400",
};

const PendingWork = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== REASSIGN STATES =====
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newDeadline, setNewDeadline] = useState("");
  const [error, setError] = useState("");

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

  /* ================= REASSIGN ================= */
  const reassignTask = async () => {
    if (!newDeadline) {
      setError("Please select a new deadline");
      return;
    }

    try {
      await api.patch(`/tasks/${selectedTask._id}/reassign`, {
        newDeadline,
        reason: "Overdue reassigned by CEO",
      });

      setOpen(false);
      setSelectedTask(null);
      setNewDeadline("");
      fetchPending();
    } catch (e) {
      setError(e.response?.data?.message || "Reassign failed");
    }
  };

  return (
    <div className="p-4 md:p-6 text-slate-200">
      <h1 className="text-lg md:text-xl font-semibold text-red-400 mb-4">
        Pending / Overdue Work
      </h1>

      {loading && <p className="text-slate-400">Loading overdue tasks...</p>}

      {!loading && tasks.length === 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center text-slate-400">
          🎉 No overdue tasks
        </div>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <thead className="bg-slate-900 text-slate-400 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Task</th>
              <th className="px-4 py-3 text-left">Employee</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Deadline</th>
              <th className="px-4 py-3 text-left">Action</th>
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
                    className={`px-3 py-1 text-xs rounded-full ${badgeColors[t.status]}`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-red-400">
                  {new Date(t.deadline).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    disabled={t.isLocked}
                    onClick={() => {
                      setSelectedTask(t);
                      setOpen(true);
                      setError("");
                    }}
                    className={`text-xs px-3 py-1 rounded-lg ${t.isLocked
                        ? "bg-slate-700 cursor-not-allowed"
                        : "bg-sky-500 hover:bg-sky-600 text-slate-900"
                      }`}
                  >
                    {t.isLocked ? "Locked" : "Reassign"}
                  </button>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Reassigned: {t.rescheduledCount || 0}/3
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="grid gap-4 md:hidden">
        {tasks.map((t) => (
          <div
            key={t._id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4"
          >
            <h3 className="font-semibold">{t.title}</h3>
            <p className="text-sm text-slate-400">
              {t.assignedTo?.name}
            </p>

            <div className="flex items-center justify-between mt-3">
              <span
                className={`px-3 py-1 text-xs rounded-full ${badgeColors[t.status]}`}
              >
                {t.status.replace("_", " ")}
              </span>

              <span className="text-xs text-red-400">
                {new Date(t.deadline).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button
                disabled={t.isLocked}
                onClick={() => {
                  setSelectedTask(t);
                  setOpen(true);
                  setError("");
                }}
                className={`text-xs px-3 py-1 rounded-lg ${t.isLocked
                    ? "bg-slate-700 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-600 text-slate-900"
                  }`}
              >
                {t.isLocked ? "Locked" : "Reassign"}
              </button>

              <p className="text-[10px] text-slate-400">
                Reassigned: {t.rescheduledCount || 0}/3
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {open && selectedTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-sky-400 mb-2">
              Reassign Task
            </h2>

            <p className="text-xs text-slate-400 mb-3">
              {selectedTask.title}
            </p>

            {error && (
              <p className="text-xs text-red-400 mb-2">{error}</p>
            )}

            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-slate-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={reassignTask}
                className="px-4 py-2 bg-sky-500 text-slate-900 rounded font-semibold"
              >
                Reassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingWork;
