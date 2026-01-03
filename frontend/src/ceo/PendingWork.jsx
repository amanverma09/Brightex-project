import { useEffect, useState } from "react";
import api from "../api/api";

const badgeColors = {
  PENDING: "bg-slate-100 text-slate-600 border border-slate-200",
  IN_PROGRESS: "bg-[#00bba3]/10 text-[#00bba3] border border-[#00bba3]/20",
};

const PendingWork = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newDeadline, setNewDeadline] = useState("");
  const [error, setError] = useState("");

  const fetchPending = async () => {
    try {
      const res = await api.get("/tasks/ceo/overdue");
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
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#334155] tracking-tight uppercase">
            Overdue <span className="text-[#00bba3]">Work</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage and reassign tasks that have passed their deadline.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Total Overdue:{" "}
          </span>
          <span className="text-sm font-black text-red-500">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bba3]"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
            <span className="text-4xl">✅</span>
            <h3 className="mt-4 text-lg font-bold text-slate-700">
              All caught up!
            </h3>
            <p className="text-slate-400">
              There are currently no overdue tasks to manage.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* DESKTOP VIEW */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Task Details
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Assignee
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                      Deadline
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                      Control
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tasks.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-700">
                          {t.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          ID: {t._id.slice(-6).toUpperCase()}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#8a8a8a]/10 flex items-center justify-center text-[10px] font-bold text-[#8a8a8a]">
                            {t.assignedTo?.name?.charAt(0)}
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            {t.assignedTo?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`px-3 py-1 text-[10px] rounded-full font-black uppercase tracking-tighter ${
                            badgeColors[t.status]
                          }`}
                        >
                          {t.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <p className="text-xs font-black text-red-500">
                          {new Date(t.deadline).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          Expired
                        </p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <button
                            disabled={t.isLocked}
                            onClick={() => {
                              setSelectedTask(t);
                              setOpen(true);
                              setError("");
                            }}
                            className={`text-[10px] px-4 py-2 rounded-lg font-black uppercase tracking-widest transition-all ${
                              t.isLocked
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                : "bg-[#00bba3] text-white hover:bg-[#00a38d] shadow-md shadow-[#00bba3]/20"
                            }`}
                          >
                            {t.isLocked ? "Locked" : "Reassign"}
                          </button>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            Attempt {t.rescheduledCount || 0}/3
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW */}
            <div className="md:hidden divide-y divide-slate-100">
              {tasks.map((t) => (
                <div key={t._id} className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-700">{t.title}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {t.assignedTo?.name}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-[9px] rounded-md font-black uppercase ${
                        badgeColors[t.status]
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Deadline
                      </p>
                      <p className="text-xs font-black text-red-500">
                        {new Date(t.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      disabled={t.isLocked}
                      onClick={() => {
                        setSelectedTask(t);
                        setOpen(true);
                      }}
                      className="bg-[#00bba3] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-sm"
                    >
                      {t.isLocked ? "Locked" : "Reassign"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {open && selectedTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#00bba3]/10 flex items-center justify-center text-xl">
                ⏳
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                  Reassign Task
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Updating delivery schedule
                </p>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-500 mb-6 border-l-4 border-[#00bba3] pl-4 italic">
              "{selectedTask.title}"
            </p>

            {error && (
              <p className="text-[10px] text-white bg-red-400 p-2 rounded mb-4 font-bold uppercase text-center">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                New Delivery Deadline
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#00bba3] focus:ring-1 focus:ring-[#00bba3] outline-none text-slate-700 font-bold transition-all"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
              />
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-3 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 rounded-xl transition-all"
              >
                Go Back
              </button>
              <button
                onClick={reassignTask}
                className="flex-1 py-3 bg-[#00bba3] text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-[#00bba3]/20 hover:bg-[#00a38d] transition-all"
              >
                Confirm New Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingWork;
