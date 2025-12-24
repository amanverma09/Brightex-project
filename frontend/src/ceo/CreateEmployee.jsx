import { useState } from "react";
import api from "../api/api";

const CreateEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name || !email) {
      setError("Name and Email are required");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/employees/create", {
        name,
        email,
      });

      setMessage(
        `Employee created successfully. Default password: ${res.data.credentials.password}`
      );

      setName("");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-semibold text-sky-400 mb-4">
        Create Employee
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4"
      >
        {message && <p className="text-emerald-400 text-sm">{message}</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div>
          <label className="block text-sm mb-1">Employee Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Employee Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-slate-900 font-semibold transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Employee"}
        </button>
      </form>
    </div>
  );
};

export default CreateEmployee;
