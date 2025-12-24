import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const statusColors = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400",
  COMPLETED: "bg-emerald-500/20 text-emerald-400",
};

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      // refresh list after update
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/employee-login");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <h1 className="text-xl font-semibold text-emerald-400">
          Employee Dashboard
        </h1>
        <button
          onClick={logout}
          className="text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-lg font-medium mb-4">My Tasks</h2>

        {loading && <p className="text-slate-400">Loading tasks...</p>}

        {!loading && tasks.length === 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center text-slate-400">
            🎉 No tasks assigned yet
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
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
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => updateStatus(task._id, "PENDING")}
                    className="text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateStatus(task._id, "IN_PROGRESS")}
                    className="text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateStatus(task._id, "COMPLETED")}
                    className="text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
                  >
                    Completed
                  </button>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-400">
                Deadline:{" "}
                <span className="text-slate-300">
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
