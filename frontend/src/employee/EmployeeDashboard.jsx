import { useEffect, useState } from "react";
import api from "../api/api";

const StatCard = ({ title, value, color }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
    <p className="text-sm text-slate-400">{title}</p>
    <p className={`text-2xl font-semibold mt-1 ${color}`}>
      {value}
    </p>
  </div>
);

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/tasks/my");

      const tasks = res.data.tasks || [];

      const total = tasks.length;
      const completed = tasks.filter(t => t.status === "COMPLETED").length;
      const pending = tasks.filter(t => t.status !== "COMPLETED").length;

      const accuracy =
        total === 0 ? 0 : Math.round((completed / total) * 100);

      setStats({
        total,
        completed,
        pending,
        accuracy,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-lg font-medium mb-4">
        Performance Overview
      </h2>

      {loading && <p className="text-slate-400">Loading stats...</p>}

      {stats && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            color="text-slate-100"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            color="text-emerald-400"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            color="text-yellow-400"
          />
          <StatCard
            title="Accuracy"
            value={`${stats.accuracy}%`}
            color="text-sky-400"
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
