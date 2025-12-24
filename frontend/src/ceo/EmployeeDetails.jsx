import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const empRes = await api.get(`/employees/${id}`);
      const taskRes = await api.get(`/tasks/by-employee/${id}`);

      setEmployee(empRes.data.employee);
      setTasks(taskRes.data.tasks || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return <p className="p-6 text-slate-400">Loading...</p>;
  }

  if (!employee) {
    return <p className="p-6 text-red-400">Employee not found</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-sky-400">Employee Details</h1>

      {/* Employee Info */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <p>
          <b>Name:</b> {employee.name}
        </p>
        <p>
          <b>Email:</b> {employee.email}
        </p>
        <p>
          <b>Status:</b>{" "}
          <span
            className={
              employee.status === "ACTIVE" ? "text-emerald-400" : "text-red-400"
            }
          >
            {employee.status}
          </span>
        </p>
      </div>

      {/* Tasks */}
      <div>
        <h2 className="text-lg mb-3">Assigned Tasks</h2>

        {tasks.length === 0 && (
          <p className="text-slate-400">No tasks assigned</p>
        )}

        <div className="grid gap-3">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4"
            >
              <p className="font-semibold">{t.title}</p>
              <p className="text-sm text-slate-400">Status: {t.status}</p>
              <p className="text-sm text-slate-400">
                Deadline: {new Date(t.deadline).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
