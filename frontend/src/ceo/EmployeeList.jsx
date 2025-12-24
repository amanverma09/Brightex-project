import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/employees/${id}/status`, {
        status: currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE",
      });
      fetchEmployees(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <h1 className="text-xl font-semibold text-sky-400 mb-4">Employees</h1>

      {loading && <p className="text-slate-400">Loading employees...</p>}

      {!loading && employees.length === 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center text-slate-400">
          No employees found
        </div>
      )}

      {/* Desktop Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <thead className="bg-slate-900 text-slate-400 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e._id} className="border-t border-slate-700">
                {/* NAME (clickable) */}
                <td className="px-4 py-3">
                  <Link
                    to={`/ceo/employees/${e._id}`}
                    className="text-sky-400 hover:underline"
                  >
                    {e.name}
                  </Link>
                </td>

                {/* EMAIL */}
                <td className="px-4 py-3 text-slate-400">{e.email}</td>

                {/* STATUS */}
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      e.status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus(e._id, e.status)}
                    className="text-xs px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600"
                  >
                    {e.status === "ACTIVE" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {employees.map((e) => (
          <div
            key={e._id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4"
          >
            <Link
              to={`/ceo/employees/${e._id}`}
              className="font-semibold text-sky-400 hover:underline"
            >
              {e.name}
            </Link>
            <p className="text-sm text-slate-400">{e.email}</p>

            <div className="flex items-center justify-between mt-3">
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  e.status === "ACTIVE"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {e.status}
              </span>

              <button
                onClick={() => toggleStatus(e._id, e.status)}
                className="text-xs px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600"
              >
                {e.status === "ACTIVE" ? "Block" : "Unblock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
