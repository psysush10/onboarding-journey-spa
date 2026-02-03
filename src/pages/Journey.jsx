import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const journeyData = {
  customerName: "Acme Corp",
  stages: [
    {
      id: "kickoff",
      name: "Kickoff & Alignment",
      status: "done",
      owner: "Sushanth",
      dueDate: "2026-02-01",
      tasks: [
        { id: 1, title: "Schedule kickoff call", done: true },
        { id: 2, title: "Share onboarding plan", done: true },
      ],
    },
    {
      id: "data",
      name: "Access & Data Collection",
      status: "in-progress",
      owner: "Customer",
      dueDate: "2026-02-05",
      tasks: [
        { id: 3, title: "Provide admin access", done: false },
        { id: 4, title: "Upload sample data", done: false },
      ],
    },
    {
      id: "config",
      name: "Product Configuration",
      status: "not-started",
      owner: "CSM",
      dueDate: "2026-02-07",
      tasks: [
        { id: 5, title: "Configure workflows", done: false },
        { id: 6, title: "Set user roles", done: false },
      ],
    },
  ],
};

function Stage({ stage }) {
  const [open, setOpen] = useState(false);
    const statusColors = {
    done: "green",
    "in-progress": "orange",
    "not-started": "#999",
    blocked: "red",
  };
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        <div>
          <h4 style={{ margin: 0 }}>{stage.name}</h4>
          <small>
            Owner: {stage.owner} · Due: {stage.dueDate}
          </small>
        </div>
        <strong style={{ color: statusColors[stage.status] }}>
            {stage.status}
        </strong>
      </div>

      {open && (
        <ul style={{ marginTop: "12px" }}>
          {stage.tasks.map((task) => (
            <li key={task.id}>
              {task.done ? "✅" : "⬜️"} {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Journey() {
    const navigate = useNavigate();
  const { customerId } = useParams();
  const totalTasks = journeyData.stages.flatMap(s => s.tasks).length;
  const completedTasks = journeyData.stages
  .flatMap(s => s.tasks)
  .filter(t => t.done).length;

const progress = Math.round((completedTasks / totalTasks) * 100);
  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>

        <button onClick={() => navigate("/dashboard")}>
  ← Back to Dashboard
    </button>
      <h2>
        Onboarding Journey — {journeyData.customerName} ({customerId})
      </h2>
      <strong>Overall Progress:</strong> {progress}%

      <p style={{ color: "#666" }}>
        Stages run in parallel. Click a stage to view tasks.
      </p>

      {journeyData.stages.map((stage) => (
        <Stage key={stage.id} stage={stage} />
      ))}
    </div>
  );
}