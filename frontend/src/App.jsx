import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function App() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [reward, setReward] = useState("");

  async function fetchGoals() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/goals`);
    const data = await res.json();
    setGoals(data);
    setLoading(false);
  }

  async function addGoal(e) {
    e.preventDefault();
    if (!title || !reward) return alert("Please fill title and reward");

    await fetch(`${API_BASE}/api/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, reward })
    });

    setTitle("");
    setReward("");
    fetchGoals();
  }

  async function toggleStatus(id) {
    await fetch(`${API_BASE}/api/goals/${id}`, {
      method: "PATCH"
    });
    fetchGoals();
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              TrendIt ⚡freelance platform
            </h1>
            <p className="text-slate-300 mt-2">
              Dynamic goal marketplace — create & complete goals with real rewards.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10">
            <p className="text-sm text-slate-200">Status</p>
            <p className="font-semibold text-emerald-300">
              {loading ? "Loading..." : "Online ✅"}
            </p>
          </div>
        </div>

        {/* Create Goal Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-10 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Create New Goal</h2>

          <form onSubmit={addGoal} className="grid md:grid-cols-3 gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Goal title (example: Promote on Insta)"
              className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="number"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="Reward ₹"
              className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold shadow-lg"
              type="submit"
            >
              + Add Goal
            </button>
          </form>
        </div>

        {/* Goals List */}
        <div className="grid md:grid-cols-2 gap-6">
          {loading ? (
            <div className="text-slate-300">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="text-slate-300">No goals found</div>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl hover:bg-white/10 transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{goal.title}</h3>
                    <p className="text-slate-300 mt-1">
                      Reward: <span className="text-yellow-300 font-bold">₹{goal.reward}</span>
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      goal.status === "Open"
                        ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/20"
                        : "bg-slate-400/20 text-slate-200 border border-slate-400/20"
                    }`}
                  >
                    {goal.status}
                  </span>
                </div>

                <button
                  onClick={() => toggleStatus(goal.id)}
                  className="mt-5 w-full px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 transition border border-white/10 font-semibold"
                >
                  Toggle Status
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
