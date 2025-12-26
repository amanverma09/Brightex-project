import { useEffect, useState } from "react";
import api from "../api/api";

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState({});
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({ name: "", email: "" });
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ================= FETCH =================
    const fetchEmployees = async () => {
        try {
            const res = await api.get("/employees");
            setEmployees(res.data.employees || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // ================= CREATE / UPDATE =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            if (editId) {
                await api.put(`/employees/${editId}`, form);
                setMessage("Employee updated");
            } else {
                const res = await api.post("/employees/create", form);
                setMessage(
                    `Created · Password: ${res.data.credentials.password}`
                );
            }

            setForm({ name: "", email: "" });
            setEditId(null);
            fetchEmployees();
        } catch (err) {
            setError(err.response?.data?.message || "Action failed");
        }
    };

    const editEmployee = (e) => {
        setEditId(e._id);
        setForm({ name: e.name, email: e.email });
    };

    const deleteEmployee = async (id) => {
        if (!confirm("Delete employee?")) return;
        await api.delete(`/employees/${id}`);
        fetchEmployees();
    };

    const toggleStatus = async (id, status) => {
        await api.patch(`/employees/${id}/status`, {
            status: status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
        });
        fetchEmployees();
    };

    const loadTasks = async (id) => {
        if (tasks[id]) return;
        const res = await api.get(`/tasks/by-employee/${id}`);
        setTasks({ ...tasks, [id]: res.data.tasks || [] });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 p-5">
            <h1 className="text-lg font-semibold text-sky-400 mb-4">
                Employee Management
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
                {/* ================= LEFT: CREATE / EDIT ================= */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3"
                >
                    <h2 className="text-sm font-semibold text-slate-200">
                        {editId ? "Edit Employee" : "Create Employee"}
                    </h2>

                    {message && <p className="text-emerald-400 text-xs">{message}</p>}
                    {error && <p className="text-red-400 text-xs">{error}</p>}

                    <input
                        className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded"
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />

                    <input
                        type="email"
                        className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded"
                        placeholder="Email address"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />

                    <button className="w-full bg-sky-500 hover:bg-sky-600 text-slate-900 text-xs py-1.5 rounded font-semibold">
                        {editId ? "Update" : "Create"}
                    </button>
                </form>

                {/* ================= RIGHT: LIST ================= */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="px-4 py-2 border-b border-slate-800 text-xs text-slate-400">
                        Employees ({employees.length})
                    </div>

                    {loading && (
                        <p className="p-4 text-xs text-slate-500">Loading...</p>
                    )}

                    {!loading && employees.length === 0 && (
                        <div className="p-6 text-center text-xs text-slate-500">
                            No employees yet.
                            <br />
                            Create your first employee from the left panel.
                        </div>
                    )}

                    {/* TABLE */}
                    {employees.length > 0 && (
                        <table className="w-full text-xs">
                            <thead className="text-slate-500 border-b border-slate-800">
                                <tr>
                                    <th className="text-left px-4 py-2">Name</th>
                                    <th className="text-left px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {employees.map((e) => (
                                    <tr
                                        key={e._id}
                                        className="border-b border-slate-800 hover:bg-slate-800/40"
                                    >
                                        <td className="px-4 py-2 text-sky-400">{e.name}</td>
                                        <td className="px-4 py-2 text-slate-400">{e.email}</td>

                                        <td className="px-4 py-2 text-center">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] ${e.status === "ACTIVE"
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : "bg-red-500/20 text-red-400"
                                                    }`}
                                            >
                                                {e.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-2 space-x-2 text-center">
                                            <button
                                                onClick={() => editEmployee(e)}
                                                className="text-[10px] px-2 py-0.5 bg-slate-700 rounded"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => deleteEmployee(e._id)}
                                                className="text-[10px] px-2 py-0.5 bg-red-600/70 rounded"
                                            >
                                                Delete
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeManagement;
