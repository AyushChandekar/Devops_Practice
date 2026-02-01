import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Dummy dynamic data
let goals = [
  { id: 1, title: "Promote App on Instagram", reward: 150, status: "Open" },
  { id: 2, title: "Get 20 YouTube subscribers", reward: 200, status: "Open" },
  { id: 3, title: "Post Tweet about Product", reward: 50, status: "Completed" }
];

app.get("/", (req, res) => {
  res.json({ message: "✅ Backend Running Successfully!" });
});

// Fetch Goals
app.get("/api/goals", (req, res) => {
  res.json(goals);
});

// Create new Goal
app.post("/api/goals", (req, res) => {
  const { title, reward } = req.body;

  if (!title || !reward) {
    return res.status(400).json({ error: "Title and reward are required" });
  }

  const newGoal = {
    id: goals.length + 1,
    title,
    reward: Number(reward),
    status: "Open"
  };

  goals.unshift(newGoal);
  res.status(201).json(newGoal);
});

// Update status
app.patch("/api/goals/:id", (req, res) => {
  const id = Number(req.params.id);
  const goal = goals.find(g => g.id === id);

  if (!goal) return res.status(404).json({ error: "Goal not found" });

  goal.status = goal.status === "Open" ? "Completed" : "Open";
  res.json(goal);
});

app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
