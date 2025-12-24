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
    const res = await api.get("/employees");
    setEmployees(res.data.employees || []);
  };

  const fetchTasks = async () => {
    const res = await api.get("/tasks/ceo/all");
    setTasks(res.data.tasks || []);
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
        // ✅ UPDATE TASK
        await api.patch(`/tasks/${editTaskId}`, {
          title,
          description,
          assignedTo,
          deadline,
          priority,
        });
      } else {
        // ✅ CREATE TASK
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

  /* ================= FILTER ================= */

  const filteredTasks =
    statusFilter === "ALL"
      ? tasks
      : tasks.filter(
        (t) => normalizeStatus(t.status) === statusFilter
      );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-sky-400">Tasks</h1>

        <button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="text-xs px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-slate-900 rounded font-semibold"
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
            className={`px-3 py-1 rounded font-medium ${statusFilter === s
                ? "bg-sky-500 text-slate-900"
                : "bg-slate-800 text-slate-400"
              }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* TASK LIST */}
      <div className="grid gap-3">
        {filteredTasks.length === 0 && (
          <p className="text-xs text-slate-500">No tasks found</p>
        )}

        {filteredTasks.map((t) => (
          <div
            key={t._id}
            className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sky-400">{t.title}</p>
                <p className="text-slate-400 mt-0.5">
                  {t.description || "—"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded">
                  {t.priority}
                </span>

                {/* EDIT BUTTON */}
                <button
                  onClick={() => handleEdit(t)}
                  className="text-[10px] px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded"
                >
                  Edit
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-2 text-[10px]">
              <span className="text-slate-500">
                Due: {new Date(t.deadline).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-slate-800">
                  👤 {t.assignedTo?.name || "Unassigned"}
                </span>

                <span className="px-2 py-0.5 rounded-full bg-slate-800">
                  {normalizeStatus(t.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-md p-5 space-y-3 text-xs"
          >
            <h2 className="text-sm font-semibold text-sky-400">
              {isEdit ? "Edit Task" : "Assign Task"}
            </h2>

            {error && <p className="text-red-400">{error}</p>}

            <input
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Assign to employee</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <select
                className="w-1/2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>

              <input
                type="date"
                className="w-1/2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded"
                min={new Date().toISOString().split("T")[0]}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="px-3 py-1 bg-slate-800 rounded"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                className="px-3 py-1 bg-sky-500 text-slate-900 rounded font-semibold"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update Task"
                    : "Assign Task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AssignTask;
