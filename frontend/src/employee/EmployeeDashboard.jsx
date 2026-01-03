import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

/* ================= STATUS COLORS ================= */
const statusColors = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400",
  COMPLETED: "bg-emerald-500/20 text-emerald-400",
};

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, color, onClick }) => (
  <div
    onClick={onClick}
    className="bg-slate-800 border border-slate-700 rounded-xl p-5 cursor-pointer hover:border-sky-500 transition"
  >
    <p className="text-sm text-slate-400">{title}</p>
    <p className={`text-2xl font-semibold mt-1 ${color}`}>{value}</p>
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

  /* ================= FETCH TASKS ================= */
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

  /* ================= FILTER LOGIC ================= */
  const applyFilter = (type) => {
    setActiveFilter(type);

    if (type === "ALL") {
      setFilteredTasks(tasks);
    }

    if (type === "COMPLETED") {
      setFilteredTasks(tasks.filter((t) => t.status === "COMPLETED"));
    }

    if (type === "OVERDUE") {
      setFilteredTasks(
        tasks.filter(
          (t) => new Date(t.deadline) < new Date() && t.status !== "COMPLETED"
        )
      );
    }
  };

  /* ================= FETCH EMPLOYEES ================= */
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees/basic-list");
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= REFER TASK ================= */
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
      setReferMessage("⚠ Please select employee & deadline");
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
      setReferMessage("❌ Failed to refer task");
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="p-6 max-w-6xl mx-auto space-y-10">
        {/* ===== STATS ===== */}
        {stats && (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <StatCard
              title="Total Tasks"
              value={stats.total}
              color="text-slate-100"
              onClick={() => applyFilter("ALL")}
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              color="text-emerald-400"
              onClick={() => applyFilter("COMPLETED")}
            />
            <StatCard
              title="Overdue"
              value={stats.overdue}
              color="text-red-400"
              onClick={() => applyFilter("OVERDUE")}
            />
            <StatCard
              title="Accuracy"
              value={`${stats.accuracy}%`}
              color="text-sky-400"
            />
          </div>
        )}

        {/* ===== TASKS ===== */}
        <h2 className="text-lg font-medium">
          {activeFilter === "ALL" ? "All Tasks" : `${activeFilter} Tasks`}
        </h2>

        {loading && <p className="text-slate-400">Loading tasks...</p>}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">
                  {task.title}
                </h3>

                <p className="text-sm text-slate-400 mb-3">
                  {task.description}
                </p>

                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full ${
                    statusColors[task.status]
                  }`}
                >
                  {task.status.replace("_", " ")}
                </span>

                {task.assignedBy?.name && (
                  <p className="text-xs text-blue-300 mt-1">
                    Assigned by: {task.assignedBy.name}
                  </p>
                )}

                {task.referredBy?.name && (
                  <p className="text-xs text-orange-300 mt-1">
                    Referred by: {task.referredBy.name}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  {["IN_PROGRESS", "COMPLETED"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(task._id, s)}
                      className="text-xs px-3 py-1 rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-600"
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-400">
                Deadline:{" "}
                <span className="text-slate-300">
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>

              {task.status !== "COMPLETED" && (
                <button
                  onClick={() => openReferModal(task)}
                  className="text-xs mt-3 px-3 py-2 rounded-lg cursor-pointer bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                >
                  Refer Task ➝
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===== REFER MODAL ===== */}
      {showReferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl w-96 border border-slate-600">
            <h2 className="text-lg font-medium mb-2">
              Refer: {selectedTask?.title}
            </h2>

            <label className="block text-sm mb-1">Refer To (Employee)</label>
            <select
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg mb-3"
              value={referEmployee}
              onChange={(e) => setReferEmployee(e.target.value)}
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">New Deadline</label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg mb-3"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />

            {referMessage && (
              <p className="text-sm text-emerald-400 mb-2">{referMessage}</p>
            )}

            <button
              onClick={referTask}
              className="w-full py-2 rounded-lg bg-orange-500 text-black font-semibold mb-2"
            >
              Submit Refer
            </button>

            <button
              onClick={() => setShowReferModal(false)}
              className="w-full py-2 rounded-lg bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
