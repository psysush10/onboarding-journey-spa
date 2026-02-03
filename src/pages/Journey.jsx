import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";





const journeyData = {
  customerName: "Acme Corp",
  stages: [
    {
      id: "kickoff",
      name: "Kickoff & Alignment",
      dependsOn: [],
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
      dependsOn: ["kickoff"],
      owner: "Customer",
      dueDate: "2026-02-02",
      tasks: [
        { id: 3, title: "Provide admin access", done: true },
        { id: 4, title: "Upload sample data", done: true },
      ],
    },
    {
      id: "config",
      name: "Product Configuration",
      dependsOn: ["data"],
      owner: "CSM",
      dueDate: "2026-02-07",
      tasks: [
        { id: 5, title: "Configure workflows", done: false },
        { id: 6, title: "Set user roles", done: false },
      ],
    },
  ],
};

function Stage({ stage, allStages, view}) {
  const [open, setOpen] = useState(false);
  const risk = getDueRisk(stage);
  const blocked = isStageBlocked(stage, allStages);
    const statusColors = {
    done: "green",
    "in-progress": "orange",
    "not-started": "#999",
    blocked: "red",
  };
  return (
    <div
      style={{
        border:
  risk === "overdue"
    ? "2px solid red"
    : risk === "due-soon"
    ? "2px solid orange"
    : "1px solid #ddd",
      }}
    >
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    cursor: blocked ? "not-allowed" : "pointer",
    opacity: blocked ? 0.5 : 1,
  }}
  onClick={() => {
  if (blocked && view === "customer") return;
  if (!blocked) setOpen(!open);
}}
>
        <div>
          <h4 style={{ margin: 0 }}>{stage.name}</h4>
          {blocked && view === "internal" && (
  <small style={{ color: "red" }}>
    Blocked — waiting on previous stage
  </small>
)}

{blocked && view === "customer" && (
  <small style={{ color: "#999" }}>
    This stage will open soon
  </small>
)}
          <small>
            {/* Internal view sees full risk */}
{view === "internal" && (
  <small
    style={{
      color:
        risk === "overdue"
          ? "red"
          : risk === "due-soon"
          ? "orange"
          : "green",
      fontWeight: 600,
    }}
  >
    {risk === "overdue" && "🔥 Overdue"}
    {risk === "due-soon" && "⚠️ Due soon"}
    {risk === "on-track" && "🟢 On track"}
    {risk === "done" && "✅ Completed"}
  </small>
)}

{/* Customer view sees calm language */}
{view === "customer" && (
  <small style={{ color: "#999" }}>
    {status === "done"
      ? "Completed"
      : blocked
      ? "Upcoming"
      : "In progress"}
  </small>
)}
          </small>
        </div>
        <strong style={{ color: statusColors[stage.status] }}>
            {stage.status}
        </strong>
      </div>

      {open && (
        <ul style={{ marginTop: "12px" }}>
          {stage.tasks.map((task) => (
            <li key={task.id} style={{ opacity: task.done ? 0.6 : 1 }}>
              {task.done ? "✅" : "⬜️"} {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function isStageComplete(stage) {
  return stage.tasks.every((t) => t.done);
}

function isStageBlocked(stage, allStages) {
  return stage.dependsOn.some((depId) => {
    const depStage = allStages.find((s) => s.id === depId);
    return depStage && !isStageComplete(depStage);
  });}

  function daysBetween(today, dueDate) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((dueDate - today) / msPerDay);
}

function getDueRisk(stage) {
  const today = new Date();
  const due = new Date(stage.dueDate);

  if (isStageComplete(stage)) return "done";

  const daysLeft = daysBetween(today, due);

  if (daysLeft < 0) return "overdue";
  if (daysLeft <= 2) return "due-soon";

  return "on-track";
}

function getOverallHealth(stages) {
  let hasDueSoon = false;

  for (const stage of stages) {
    const risk = getDueRisk(stage);

    if (risk === "overdue") {
      return "red";
    }

    if (risk === "due-soon") {
      hasDueSoon = true;
    }
  }

  return hasDueSoon ? "amber" : "green";
}

export default function Journey() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [view, setView] = useState("internal"); // or "customer"
  const totalTasks = journeyData.stages.flatMap(s => s.tasks).length;
  const completedTasks = journeyData.stages
  .flatMap(s => s.tasks)
  .filter(t => t.done).length;

const progress = Math.round((completedTasks / totalTasks) * 100);
const health = getOverallHealth(journeyData.stages);
  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>

        <button onClick={() => navigate("/dashboard")}>
  ← Back to Dashboard
    </button>
      <h2>
        Onboarding Journey — {journeyData.customerName} ({customerId})
      </h2>
      <div style={{ margin: "12px 0" }}>
  <button
    onClick={() => setView("internal")}
    style={{
      padding: "6px 12px",
      marginRight: "8px",
      fontWeight: view === "internal" ? "bold" : "normal",
    }}
  >
    Internal View
  </button>

  <button
    onClick={() => setView("customer")}
    style={{
      padding: "6px 12px",
      fontWeight: view === "customer" ? "bold" : "normal",
    }}
  >
    Customer View
  </button>
</div>
      <strong>Overall Progress:</strong> {progress}%
      {view === "internal" && (
        <div style={{ margin: "12px 0" }}>
  <strong>Overall Health: </strong>
  <span
    style={{
      color:
        health === "red"
          ? "red"
          : health === "amber"
          ? "orange"
          : "green",
      fontWeight: 700,
    }}
  >
    {health === "red" && "🔴 Blocked / Overdue"}
    {health === "amber" && "🟡 At Risk"}
    {health === "green" && "🟢 On Track"}
  </span>
</div>
      )}
      

      <p style={{ color: "#666" }}>
        Stages run in parallel. Click a stage to view tasks.
      </p>

      {journeyData.stages.map((stage) => (
  <Stage
    key={stage.id}
    stage={stage}
    allStages={journeyData.stages}
    view={view}
  />
))}
    </div>
  );
}