import { useEffect, useState } from "react";
import api from "../api/api";

/* ================= PRODUCTION STATUS CONFIG ================= */
const statusConfig = {
  PENDING: "bg-slate-100 text-slate-600 border-slate-200",
  IN_PROGRESS: "bg-[#00bba3]/10 text-[#00bba3] border-[#00bba3]/20",
  COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  FAILED: "bg-red-50 text-red-600 border-red-100",
};

const getDisplayStatus = (status) => {
  if (status === "FAILED") return "UNCOMPLETED";
  return status.replace("_", " ");
};

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/my");
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-sans bg-[#f8fafc] min-h-screen">
      {/* ================= MODERN HEADER CARD ================= */}
      <div className="relative mb-10 overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#00bba3]/5 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00bba3]">
                Assignments
              </span>
              <span className="h-1 w-1 rounded-full bg-[#8a8a8a]/30" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]/60">
                Operational View
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-[#333] uppercase">
              My <span className="text-[#00bba3]">Tasks</span>
            </h1>
            <p className="mt-1 text-xs font-medium text-[#8a8a8a]">
              Manage and fulfill your professional obligations
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#8a8a8a]">
                Task Load
              </p>
              <p className="text-lg font-black text-[#333]">{tasks.length}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <button
              onClick={fetchTasks}
              className="p-2 hover:bg-white rounded-xl transition-all group"
            >
              <span className="block group-hover:rotate-180 transition-transform duration-500">
                🔄
              </span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse font-black uppercase text-[10px] tracking-widest text-slate-400">
          Syncing Task Registry...
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center shadow-sm">
          <div className="text-4xl mb-4 opacity-20">📂</div>
          <h3 className="text-lg font-black text-slate-700 uppercase tracking-tight">
            No Active Assignments
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Assignments will appear here once allocated by management.
          </p>
        </div>
      ) : (
        <>
          {/* ================= DESKTOP TABLE VIEW ================= */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[#8a8a8a] text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">Task Identity</th>
                  <th className="px-8 py-5">Workflow Status</th>
                  <th className="px-8 py-5">Deadline</th>
                  <th className="px-8 py-5 text-right">System Controls</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-[#00bba3]/5 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <p className="font-black text-[#333] group-hover:text-[#00bba3] transition-colors leading-tight">
                        {task.title}
                      </p>
                      <p className="text-xs text-[#8a8a8a] mt-1 line-clamp-1 max-w-xs font-medium">
                        {task.description || "No description provided."}
                      </p>
                    </td>

                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg border tracking-tighter ${
                          statusConfig[task.status]
                        }`}
                      >
                        {getDisplayStatus(task.status)}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-[#333]">
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                        <span className="text-[9px] font-bold text-[#8a8a8a] uppercase">
                          Due Date
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        {["IN_PROGRESS", "COMPLETED"].map((s) => (
                          <button
                            key={s}
                            disabled={task.status === "FAILED"}
                            onClick={() => updateStatus(task._id, s)}
                            className={`text-[9px] px-4 py-2 rounded-xl font-black uppercase tracking-widest transition-all
                            ${
                              task.status === "FAILED"
                                ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                                : s === "COMPLETED"
                                ? "bg-[#00bba3] text-white shadow-lg shadow-[#00bba3]/20 hover:scale-[1.02]"
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            {s.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARD VIEW ================= */}
          <div className="md:hidden space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border ${
                      statusConfig[task.status]
                    }`}
                  >
                    {getDisplayStatus(task.status)}
                  </span>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-[#8a8a8a] uppercase">
                      Deadline
                    </p>
                    <p className="text-xs font-black text-[#333]">
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <h3 className="font-black text-[#333] uppercase tracking-tight text-lg mb-1">
                  {task.title}
                </h3>
                <p className="text-xs text-[#8a8a8a] font-medium leading-relaxed mb-6">
                  {task.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {["IN_PROGRESS", "COMPLETED"].map((s) => (
                    <button
                      key={s}
                      disabled={task.status === "FAILED"}
                      onClick={() => updateStatus(task._id, s)}
                      className={`text-[9px] py-3 rounded-2xl font-black uppercase tracking-widest transition-all
                      ${
                        task.status === "FAILED"
                          ? "bg-slate-100 text-slate-300"
                          : s === "COMPLETED"
                          ? "bg-[#00bba3] text-white shadow-lg shadow-[#00bba3]/20"
                          : "bg-slate-50 text-slate-500 border border-slate-100"
                      }`}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeTasks;
