import { useEffect, useState } from "react";
import api from "../api/api";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        setMessage("Employee updated successfully");
      } else {
        const res = await api.post("/employees/create", form);
        setMessage(`Created · Password: ${res.data.credentials.password}`);
      }

      setForm({ name: "", email: "" });
      setEditId(null);
      // We keep the modal open if there is a success message (to show password),
      // but you can setIsModalOpen(false) if preferred.
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setForm({ name: "", email: "" });
    setMessage("");
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (e) => {
    setEditId(e._id);
    setForm({ name: e.name, email: e.email });
    setMessage("");
    setError("");
    setIsModalOpen(true);
  };

  const deleteEmployee = async (id) => {
    if (!confirm("Delete employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (e) {
      setError("Failed to delete employee");
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      await api.patch(`/employees/${id}/status`, {
        status: status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
      });
      fetchEmployees();
    } catch (e) {
      console.error("Status toggle failed");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#8a8a8a] p-5 lg:p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b border-[#8a8a8a]/10 pb-4">
        <div>
          <h1 className="text-xl font-black text-[#00bba3] uppercase tracking-tight">
            Employee Management
          </h1>
          <p className="text-[10px] uppercase font-bold text-[#8a8a8a]/60">
            Manage your organization's staff records
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-[#00bba3] hover:bg-[#00a38d] text-white text-xs px-5 py-2.5 rounded font-black uppercase tracking-widest shadow-lg shadow-[#00bba3]/20 transition-all"
        >
          + Add Employee
        </button>
      </div>

      {/* MAIN LIST VIEW */}
      <div className="bg-white border border-[#8a8a8a]/20 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#8a8a8a]/10 bg-[#8a8a8a]/5">
          <span className="text-xs font-black text-[#8a8a8a] uppercase tracking-widest">
            Staff Directory ({employees.length})
          </span>
        </div>

        {loading ? (
          <p className="p-10 text-center text-xs animate-pulse font-bold uppercase tracking-widest">
            Fetching staff records...
          </p>
        ) : employees.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="text-4xl text-[#8a8a8a]/20">👤</div>
            <p className="text-sm font-medium text-[#8a8a8a]">
              No employees registered yet.
            </p>
            <button
              onClick={openCreateModal}
              className="text-[#00bba3] font-black uppercase text-[10px] hover:underline"
            >
              Click here to add your first employee
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#8a8a8a]/5 text-[#8a8a8a] text-[10px] font-black uppercase tracking-widest border-b border-[#8a8a8a]/10">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Management</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#8a8a8a]/10">
                {employees.map((e) => (
                  <tr
                    key={e._id}
                    className="hover:bg-[#00bba3]/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#333] group-hover:text-[#00bba3] transition-colors">
                        {e.name}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">{e.email}</td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleStatus(e._id, e.status)}
                        className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-tighter transition-all ${
                          e.status === "ACTIVE"
                            ? "bg-[#00bba3]/10 text-[#00bba3] hover:bg-[#00bba3] hover:text-white"
                            : "bg-red-50 text-red-400 border border-red-100 hover:bg-red-500 hover:text-white"
                        }`}
                      >
                        {e.status}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right space-x-4">
                      <button
                        onClick={() => openEditModal(e)}
                        className="text-[10px] font-black uppercase text-[#8a8a8a] hover:text-[#00bba3] transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteEmployee(e._id)}
                        className="text-[10px] font-black uppercase text-red-400 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL OVERLAY ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#8a8a8a]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-[#00bba3] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#00bba3] p-6 text-white">
              <h2 className="text-lg font-black uppercase tracking-tighter">
                {editId ? "Update Employee" : "Register Employee"}
              </h2>
              <p className="text-[10px] uppercase font-bold opacity-80">
                Please fill out all required credentials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {message && (
                <div className="bg-[#00bba3]/10 text-[#00bba3] p-4 rounded-lg text-[11px] font-bold border border-[#00bba3]/20 text-center">
                  {message}
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg text-[11px] font-bold border border-red-100 text-center">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[#8a8a8a] tracking-wider">
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-3 text-sm bg-white border border-[#8a8a8a]/30 rounded-lg focus:border-[#00bba3] focus:ring-1 focus:ring-[#00bba3] outline-none transition-all font-medium"
                  placeholder="Enter employee's name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[#8a8a8a] tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 text-sm bg-white border border-[#8a8a8a]/30 rounded-lg focus:border-[#00bba3] focus:ring-1 focus:ring-[#00bba3] outline-none transition-all font-medium"
                  placeholder="name@brightex.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 text-[10px] font-black uppercase text-[#8a8a8a] py-3 border border-[#8a8a8a]/20 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button className="w-1/2 bg-[#00bba3] hover:bg-[#00a38d] text-white text-[10px] py-3 rounded-lg font-black uppercase tracking-widest shadow-lg shadow-[#00bba3]/20 transition-all">
                  {editId ? "Save Changes" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
