import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

/* ================= BRAND-ALIGNED STATUS COLORS ================= */
const statusColors = {
  PENDING: "bg-[#8a8a8a]/10 text-[#8a8a8a] border border-[#8a8a8a]/20",
  IN_PROGRESS: "bg-[#00bba3]/10 text-[#00bba3] border border-[#00bba3]/20",
  COMPLETED: "bg-[#00bba3] text-white",
};

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
      isActive
        ? "border-[#00bba3] bg-[#00bba3]/5 shadow-lg shadow-[#00bba3]/10"
        : "border-slate-100 bg-white hover:border-[#00bba3]/30 shadow-sm"
    }`}
  >
    <p
      className={`text-[10px] font-black uppercase tracking-widest ${
        isActive ? "text-[#00bba3]" : "text-[#8a8a8a]"
      }`}
    >
      {title}
    </p>
    <p
      className={`text-3xl font-black mt-1 ${
        isActive ? "text-[#00bba3]" : "text-[#333]"
      }`}
    >
      {value}
    </p>
  </div>
);

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  /* ===== REFER MODAL ===== */
  const [showReferModal, setShowReferModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [referEmployee, setReferEmployee] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [referMessage, setReferMessage] = useState("");

  const navigate = useNavigate();

  /* ================= FETCH DATA ================= */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks/my");
      const data = res.data.tasks || [];

      setTasks(data);
      setFilteredTasks(data);

      const total = data.length;
      const completed = data.filter((t) => t.status === "COMPLETED").length;
      const overdue = data.filter(
        (t) => new Date(t.deadline) < new Date() && t.status !== "COMPLETED"
      ).length;

      const accuracy = total === 0 ? 0 : Math.round((completed / total) * 100);
      setStats({ total, completed, overdue, accuracy });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (type) => {
    setActiveFilter(type);
    if (type === "ALL") setFilteredTasks(tasks);
    if (type === "COMPLETED")
      setFilteredTasks(tasks.filter((t) => t.status === "COMPLETED"));
    if (type === "OVERDUE") {
      setFilteredTasks(
        tasks.filter(
          (t) => new Date(t.deadline) < new Date() && t.status !== "COMPLETED"
        )
      );
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees/basic-list");
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const openReferModal = (task) => {
    setSelectedTask(task);
    setReferEmployee("");
    setNewDeadline("");
    setReferMessage("");
    setShowReferModal(true);
    fetchEmployees();
  };

  const referTask = async () => {
    if (!referEmployee || !newDeadline) {
      setReferMessage("⚠ Select employee & deadline");
      return;
    }
    try {
      await api.patch(`/tasks/${selectedTask._id}/refer`, {
        newEmployeeId: referEmployee,
        newDeadline,
      });
      setReferMessage("Task referred successfully");
      setTimeout(() => {
        setShowReferModal(false);
        fetchTasks();
      }, 800);
    } catch (err) {
      setReferMessage("❌ Failed to refer");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#8a8a8a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER SECTION */}
        <div className="relative mb-10 overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
          {/* Decorative Background Element */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#00bba3]/5 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              {/* Breadcrumb style label */}
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00bba3]">
                  Portal
                </span>
                <span className="h-1 w-1 rounded-full bg-[#8a8a8a]/30" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a8a]/60">
                  Executive Dashboard
                </span>
              </div>

              <h1 className="text-4xl font-black tracking-tighter text-[#333] uppercase">
                My <span className="text-[#00bba3]">Workspace</span>
              </h1>

              <p className="mt-1 flex items-center gap-2 text-xs font-medium text-[#8a8a8a]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00bba3] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00bba3]"></span>
                </span>
                Operational Performance & Task Analytics
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchTasks()}
                className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 transition-all hover:border-[#00bba3]/30 hover:bg-white hover:shadow-md"
                title="Sync Workspace"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#8a8a8a] transition-transform group-hover:rotate-180 group-hover:text-[#00bba3]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              <div className="h-12 w-px bg-slate-100" />

              <div className="hidden flex-col items-end sm:flex">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8a8a8a]">
                  System Status
                </span>
                <span className="text-xs font-bold text-[#333]">
                  Verified Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== STATS ===== */}
        {stats && (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <StatCard
              title="Assigned"
              value={stats.total}
              isActive={activeFilter === "ALL"}
              onClick={() => applyFilter("ALL")}
            />
            <StatCard
              title="Finished"
              value={stats.completed}
              isActive={activeFilter === "COMPLETED"}
              onClick={() => applyFilter("COMPLETED")}
            />
            <StatCard
              title="Overdue"
              value={stats.overdue}
              isActive={activeFilter === "OVERDUE"}
              onClick={() => applyFilter("OVERDUE")}
            />
            <StatCard
              title="Accuracy"
              value={`${stats.accuracy}%`}
              isActive={false}
            />
          </div>
        )}

        {/* ===== TASK LIST ===== */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#333]">
            {activeFilter} Records
          </h2>
          <div className="h-px flex-grow bg-[#8a8a8a]/10"></div>
        </div>

        {loading ? (
          <div className="py-20 text-center animate-pulse font-bold uppercase text-[10px] tracking-widest">
            Syncing Records...
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-2.5 py-1 text-[9px] rounded-md font-black uppercase tracking-tighter ${
                        statusColors[task.status]
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                    <p className="text-[10px] font-bold text-[#8a8a8a]">
                      ID: {task._id.slice(-5).toUpperCase()}
                    </p>
                  </div>

                  <h3 className="font-bold text-[#333] text-lg mb-1 leading-tight">
                    {task.title}
                  </h3>
                  <p className="text-xs text-[#8a8a8a] mb-6 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {["IN_PROGRESS", "COMPLETED"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(task._id, s)}
                        className="text-[9px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border border-[#8a8a8a]/20 hover:border-[#00bba3] hover:text-[#00bba3] transition-colors"
                      >
                        Set {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold uppercase text-[#8a8a8a]/60">
                      Deadline
                    </span>
                    <span className="font-black text-[#333]">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  {task.status !== "COMPLETED" && (
                    <button
                      onClick={() => openReferModal(task)}
                      className="w-full py-2.5 rounded-xl bg-[#00bba3]/10 text-[#00bba3] cursor-pointer font-black uppercase text-[10px] tracking-widest transition-all"
                    >
                      Refer Task ➝
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== REFER MODAL ===== */}
      {showReferModal && (
        <div className="fixed inset-0 bg-[#8a8a8a]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-[#00bba3] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#00bba3] p-6 text-white">
              <h2 className="text-lg font-black uppercase tracking-tighter">
                Refer: {selectedTask?.title}
              </h2>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">
                Transfer responsibility to team member
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[#8a8a8a] tracking-widest ml-1">
                  New Assignee
                </label>
                <select
                  className="w-full px-4 py-3 bg-white border border-[#8a8a8a]/20 rounded-xl focus:border-[#00bba3] outline-none text-xs font-bold"
                  value={referEmployee}
                  onChange={(e) => setReferEmployee(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[#8a8a8a] tracking-widest ml-1">
                  Proposed Deadline
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white border border-[#8a8a8a]/20 rounded-xl focus:border-[#00bba3] outline-none text-xs font-bold"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                />
              </div>

              {referMessage && (
                <p className="text-[10px] font-black text-center text-[#00bba3] uppercase bg-[#00bba3]/5 p-2 rounded-lg border border-[#00bba3]/10">
                  {referMessage}
                </p>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-50">
                <button
                  onClick={() => setShowReferModal(false)}
                  className="w-1/2 py-3 text-[#8a8a8a] font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={referTask}
                  className="w-1/2 py-3 bg-[#00bba3] text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-[#00bba3]/20 hover:bg-[#00a38d] transition-all"
                >
                  Submit Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
