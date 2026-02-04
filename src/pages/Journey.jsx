// ================================
// Imports
// ================================
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ================================
// Mock Journey Data (temporary)
// TODO: Replace with backend data later
// ================================
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
      dueDate: "2026-02-05",
      tasks: [
        { id: 3, title: "Provide admin access", done: false },
        { id: 4, title: "Upload sample data", done: false },
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

// ================================
// Helper Functions — PURE LOGIC
// These can move to backend later unchanged
// ================================
function isStageComplete(stage) {
  return stage.tasks.every((t) => t.done);
}

function isStageBlocked(stage, allStages) {
  return stage.dependsOn.some((depId) => {
    const depStage = allStages.find((s) => s.id === depId);
    return depStage && !isStageComplete(depStage);
  });
}

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
    if (risk === "overdue") return "red";
    if (risk === "due-soon") hasDueSoon = true;
  }

  return hasDueSoon ? "amber" : "green";
}

// ================================
// Stage Component
// Renders ONE stage card
// Behavior varies by `view` (internal vs customer)
// ================================
function Stage({ stage, allStages, view }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // Derived state (never store these)
  const blocked = isStageBlocked(stage, allStages);
  const risk = getDueRisk(stage);

  return (
    <div
      style={{
        border:
  risk === "overdue"
    ? "2px solid #f44336"
    : risk === "due-soon"
    ? "2px solid #ff9800"
    : "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        lineHeight: 1.4,
        minHeight: "96px"
      }}
    >
      {/* ---------- Stage Header (clickable) ---------- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          cursor: blocked ? "not-allowed" : "pointer",
          opacity: blocked ? 0.5 : 1,
        }}
        onClick={() => {
          // Customers cannot expand blocked stages
          if (blocked && view === "customer") return;
          // Access & Data Collection → go to detail screen
          if(stage.id === "data"){
            navigate("/journey/acme/access-data", {"state":{view} });
            return;
          }
          if(stage.id == "config"){
            navigate("/journey/acme/product-config", {"state": view});
            return;
          }
          // Default behavior: expand / collapse
          if (!blocked) setOpen(!open);
        }}
      >
        <div>
          <div>
  {/* Stage title — ALWAYS visible */}
  <h4
    style={{
      margin: "0 0 6px 0",
      fontWeight: 600,
      color: "#333",
    }}
  >
    {stage.name}
  </h4>

  {/* Metadata row */}
  <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
    {view === "internal" && <>Owner: {stage.owner} · </>}
    Due: {stage.dueDate}
  </div>

  {/* Blocked messaging */}
  {blocked && view === "internal" && (
    <div style={{ fontSize: "14px", color: "red" }}>
      Waiting on previous step
    </div>
  )}

  {view === "internal" && stage.id === "data" && blocked && (
  <div style={{ fontSize: "13px", color: "#777", marginTop: "4px" }}>
    Consider nudging the customer once dependencies are cleared.
  </div>
)}

  {blocked && view === "customer" && (
    <div style={{ fontSize: "14px", color: "#999" }}>
      This stage will open soon
    </div>
  )}

  {/* Status / risk */}
  {view === "internal" && (
    <div
      style={{
        fontSize: "14px",
        fontWeight: 600,
        color:
          risk === "overdue"
            ? "red"
            : risk === "due-soon"
            ? "orange"
            : "green",
      }}
    >
      {risk === "overdue" && "🔥 Needs attention"}
      {risk === "due-soon" && "⚠️ Next milestone approaching soon"}
      {risk === "on-track" && "🟢 On track"}
      {risk === "done" && "✅ Completed"}
    </div>
  )}

  {view === "customer" && (
    <div style={{ fontSize: "14px", color: "#999" }}>
      {isStageComplete(stage)
        ? "Completed"
        : blocked
        ? "Upcoming"
        : "In progress"}
    </div>
  )}

  {view === "customer" && stage.id === "data" && !blocked && (
  <div style={{ fontSize: "13px", color: "#777", marginTop: "4px" }}>
    We’ll guide you through this step.
  </div>
)}
</div>
        </div>
      </div>

      {/* ---------- Task List ---------- */}
      {open && (
        <ul style={{ marginTop: "12px" }}>
          {stage.tasks.map((task) => (
            <li
  key={task.id}
  style={{
    opacity: task.done ? 0.7 : 1,
    color: "#333",
    fontSize: "14px",
    lineHeight: 1.5,
  }}
>
              {task.done ? "✅" : "⬜️"} {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ================================
// Journey Page (Top-level view)
// Owns:
// - view mode (internal / customer)
// - progress
// - overall health
// ================================
export default function Journey() {
  const navigate = useNavigate();
  const { customerId } = useParams();

  // ---------- View Mode ----------
  const [view, setView] = useState("internal");

  // ---------- Progress ----------
  const totalTasks = journeyData.stages.flatMap((s) => s.tasks).length;
  const completedTasks = journeyData.stages
    .flatMap((s) => s.tasks)
    .filter((t) => t.done).length;

  const progress = Math.round((completedTasks / totalTasks) * 100);
  const health = getOverallHealth(journeyData.stages);

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      {/* ---------- Navigation ---------- */}
      <button onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      {/* ---------- Overview Section ---------- */}
      <div
  style={{
    marginBottom: "28px",
    paddingBottom: "16px",
    borderBottom: "1px solid #eee",
  }}
>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ marginBottom: "6px", fontWeight: 600 }}>
          Onboarding Journey — {journeyData.customerName} ({customerId})
        </h2>

        <div style={{ color: "#555", marginBottom: "10px" }}>
          <strong>Progress:</strong> {progress}% completed
        </div>

        {view === "internal" && (
          <div style={{ marginBottom: "10px" }}>
            <strong>Overall Health: </strong>
            <span
              style={{
                color:
                  health === "red"
                    ? "red"
                    : health === "amber"
                    ? "orange"
                    : "green",
                fontWeight: 600,
              }}
            >
              {health === "red" && "🔴 Blocked / Overdue"}
              {health === "amber" && "🟡 At Risk"}
              {health === "green" && "🟢 On Track"}
            </span>
          </div>
        )}
      </div>
      </div>

      {/* ---------- View Toggle ---------- */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ marginBottom: "6px", color: "#666", fontSize: "14px" }}>
  View as:
</div>
        <button
  onClick={() => setView("internal")}
  style={{
    padding: "6px 14px",
    marginRight: "8px",
    borderRadius: "6px",
    border: view === "internal" ? "2px solid #333" : "1px solid #ccc",
    background: view === "internal" ? "#f5f5f5" : "#fff",
    color: "#333", // ✅ FIX
    fontWeight: 600,
    cursor: "pointer",
  }}
>
  Internal View
</button>

        <button
  onClick={() => setView("customer")}
  style={{
    padding: "6px 14px",
    borderRadius: "6px",
    border: view === "customer" ? "2px solid #333" : "1px solid #ccc",
    background: view === "customer" ? "#f5f5f5" : "#fff",
    color: "#333", // ✅ FIX
    fontWeight: 600,
    cursor: "pointer",
  }}
>
  Customer View
</button>
      </div>

      {/* ---------- Stages ---------- */}
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