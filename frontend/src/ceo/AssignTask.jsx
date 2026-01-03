import { useEffect, useState } from "react";
import api from "../api/api";

const normalizeStatus = (status = "") =>
  status.toUpperCase().replace(/\s+/g, "_");

const AssignTask = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  // modal
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  // filters
  const [statusFilter, setStatusFilter] = useState("ALL");

  // form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Fetch employees failed", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/ceo/all");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Fetch tasks failed", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  /* ================= CREATE / UPDATE ================= */

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDeadline("");
    setPriority("MEDIUM");
    setIsEdit(false);
    setEditTaskId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !assignedTo || !deadline) {
      setError("Title, employee and deadline are required");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await api.patch(`/tasks/${editTaskId}`, {
          title,
          description,
          assignedTo,
          deadline,
          priority,
        });
      } else {
        await api.post("/tasks/assign", {
          title,
          description,
          assignedTo,
          deadline,
          priority,
          status: "PENDING",
        });
      }

      setOpen(false);
      resetForm();
      await fetchTasks();
      setStatusFilter("ALL");
    } catch (err) {
      setError(err.response?.data?.message || "Task action failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT HANDLER ================= */

  const handleEdit = (task) => {
    setIsEdit(true);
    setEditTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
    setAssignedTo(task.assignedTo?._id || "");
    setDeadline(task.deadline?.split("T")[0] || "");
    setPriority(task.priority || "MEDIUM");
    setOpen(true);
  };

  /* ================= DELETE HANDLER ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete task");
    }
  };

  const filteredTasks =
    statusFilter === "ALL"
      ? tasks
      : tasks.filter((t) => normalizeStatus(t.status) === statusFilter);

  return (
    <div className="min-h-screen bg-white text-[#8a8a8a] p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-[#8a8a8a]/20 pb-4">
        <h1 className="text-xl font-bold text-[#00bba3] uppercase tracking-tight">
          Tasks
        </h1>

        <button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="text-xs px-4 py-2 bg-[#00bba3] hover:bg-[#00a38d] text-white rounded shadow-md font-bold uppercase transition-all"
        >
          + Assign Task
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 text-xs">
        {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full font-bold transition-colors ${
              statusFilter === s
                ? "bg-[#00bba3] text-white"
                : "bg-[#8a8a8a]/10 text-[#8a8a8a] hover:bg-[#8a8a8a]/20"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* TASK LIST */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-[#8a8a8a]/20 rounded-xl">
            <p className="text-sm text-[#8a8a8a]">
              No tasks found in this category.
            </p>
          </div>
        )}

        {filteredTasks.map((t) => (
          <div
            key={t._id}
            className="bg-white border-l-4 border-[#00bba3] border  rounded-lg p-4 text-xs transition-hover "
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#333]">{t.title}</p>
                <p className="text-[#8a8a8a] leading-relaxed">
                  {t.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="px-3 py-1 bg-[#8a8a8a]/10 text-[#8a8a8a] hover:bg-[#8a8a8a] hover:text-white rounded font-bold uppercase text-[9px] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="px-3 py-1 border border-[#00bba3] text-[#00bba3] hover:bg-[#00bba3] hover:text-white rounded font-bold uppercase text-[9px] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 text-[10px]">
              <div className="flex items-center gap-3">
                <span className="text-[#8a8a8a] font-medium">
                  📅 Due:{" "}
                  <span className="font-bold">
                    {new Date(t.deadline).toLocaleDateString()}
                  </span>
                </span>
                <span className="flex items-center gap-1 bg-[#8a8a8a]/5 px-2 py-0.5 rounded text-[#8a8a8a] font-bold">
                  👤 {t.assignedTo?.name || "Unassigned"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#00bba3]/10 text-[#00bba3] font-black uppercase">
                  {normalizeStatus(t.status)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-white font-black uppercase ${
                    t.priority === "HIGH" ? "bg-[#00bba3]" : "bg-[#8a8a8a]"
                  }`}
                >
                  {t.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-[#8a8a8a]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-[#00bba3] rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl"
          >
            <h2 className="text-lg font-black text-[#00bba3] uppercase tracking-tight border-b border-slate-100 pb-2">
              {isEdit ? "Update Task Details" : "New Task Assignment"}
            </h2>

            {error && (
              <p className="text-[10px] text-white bg-[#00bba3] p-2 rounded font-bold uppercase">
                ⚠️ {error}
              </p>
            )}

            <div className="space-y-3">
              <input
                className="w-full px-3 py-2 bg-white border border-[#8a8a8a]/30 rounded focus:border-[#00bba3] outline-none text-[#333] font-medium placeholder-[#8a8a8a]/50"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="w-full px-3 py-2 bg-white border border-[#8a8a8a]/30 rounded focus:border-[#00bba3] outline-none text-[#333] h-24 font-medium placeholder-[#8a8a8a]/50"
                placeholder="Task Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <select
                className="w-full px-3 py-2 bg-white border border-[#8a8a8a]/30 rounded focus:border-[#00bba3] outline-none text-[#333] font-bold"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <select
                  className="w-1/2 px-3 py-2 bg-white border border-[#8a8a8a]/30 rounded focus:border-[#00bba3] outline-none text-[#333] font-bold"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="LOW">Priority: Low</option>
                  <option value="MEDIUM">Priority: Medium</option>
                  <option value="HIGH">Priority: High</option>
                </select>

                <input
                  type="date"
                  className="w-1/2 px-3 py-2 bg-white border border-[#8a8a8a]/30 rounded focus:border-[#00bba3] outline-none text-[#333] font-bold"
                  min={new Date().toISOString().split("T")[0]}
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="px-5 py-2 text-[#8a8a8a] font-bold uppercase text-[10px] hover:bg-[#8a8a8a]/10 rounded transition-colors"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                className="px-6 py-2 bg-[#00bba3] text-white rounded font-bold uppercase text-[10px] shadow-md hover:bg-[#00a38d] transition-all"
              >
                {loading
                  ? "Processing..."
                  : isEdit
                  ? "Save Changes"
                  : "Assign Now"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AssignTask;
