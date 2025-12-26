import { useEffect, useState } from "react";
import api from "../api/api";

/* ================= STATUS COLORS ================= */
const statusColors = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    IN_PROGRESS: "bg-blue-500/20 text-blue-400",
    COMPLETED: "bg-emerald-500/20 text-emerald-400",
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
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* ================= HEADER ================= */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-100">
                    My Tasks
                </h2>
                <p className="text-sm text-slate-400">
                    Track, update and complete your assigned work
                </p>
            </div>

            {loading && (
                <p className="text-slate-400">Loading tasks...</p>
            )}

            {!loading && tasks.length === 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center text-slate-400">
                    🎉 No tasks assigned yet
                </div>
            )}

            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border border-slate-700 bg-slate-800 rounded-lg overflow-hidden">
                    <thead className="bg-slate-900 text-slate-400 text-sm">
                        <tr>
                            <th className="px-4 py-3 text-left">Task</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Deadline</th>
                            <th className="px-4 py-3 text-left">Update</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.map((task) => (
                            <tr
                                key={task._id}
                                className="border-t border-slate-700 hover:bg-slate-700/40 transition"
                            >
                                <td className="px-4 py-3">
                                    <p className="font-medium text-slate-100">
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-slate-400 line-clamp-2">
                                        {task.description}
                                    </p>
                                </td>

                                <td className="px-4 py-3">
                                    <span
                                        className={`px-3 py-1 text-xs rounded-full ${task.status === "FAILED"
                                            ? "bg-red-500/20 text-red-400"
                                            : statusColors[task.status]
                                            }`}
                                    >
                                        {getDisplayStatus(task.status)}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-sm text-slate-300">
                                    {new Date(task.deadline).toLocaleDateString()}
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        {["PENDING", "IN_PROGRESS", "COMPLETED"].map((s) => (
                                            <button
                                                key={s}
                                                disabled={task.status === "FAILED"}
                                                onClick={() => updateStatus(task._id, s)}
                                                className={`text-xs px-3 py-1.5 rounded border
                        ${task.status === "FAILED"
                                                        ? "bg-slate-700 text-slate-400 cursor-not-allowed border-slate-600"
                                                        : "bg-slate-900 hover:bg-slate-700 border-slate-600"
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

            {/* ================= MOBILE VIEW ================= */}
            <div className="md:hidden space-y-3">
                {tasks.map((task) => (
                    <div
                        key={task._id}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-4"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-slate-100">
                                    {task.title}
                                </h3>
                                <p className="text-xs text-slate-400 line-clamp-2">
                                    {task.description}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 text-xs rounded-full ${task.status === "FAILED"
                                    ? "bg-red-500/20 text-red-400"
                                    : statusColors[task.status]
                                    }`}
                            >
                                {getDisplayStatus(task.status)}
                            </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                            <span>
                                Deadline:{" "}
                                <span className="text-slate-300">
                                    {new Date(task.deadline).toLocaleDateString()}
                                </span>
                            </span>
                        </div>

                        <div className="mt-3 flex gap-2 flex-wrap">
                            {["PENDING", "IN_PROGRESS", "COMPLETED"].map((s) => (
                                <button
                                    key={s}
                                    disabled={task.status === "FAILED"}
                                    onClick={() => updateStatus(task._id, s)}
                                    className={`text-xs px-3 py-1.5 rounded border
                  ${task.status === "FAILED"
                                            ? "bg-slate-700 text-slate-400 cursor-not-allowed border-slate-600"
                                            : "bg-slate-900 hover:bg-slate-700 border-slate-600"
                                        }`}
                                >
                                    {s.replace("_", " ")}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeTasks;
