// ================================
// Imports
// ================================
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getJourneyByCustomerId } from "../data/journey";
import { stageMeta } from "../data/stages";

// ================================
// Mock Journey Data (temporary)
// TODO: Replace with backend data later
// ================================

// ================================
// Helper Functions — PURE LOGIC
// Safe to move to backend unchanged
// ================================
function isStageComplete(stage) {
  return stage.tasks.every((t) => t.done);
}

function isStageBlocked(stage, allStages) {
  return stage.dependsOn.some((depId) => {
    const depStage = allStages.find((s) => s.id === depId);

    if (!depStage) return false;

    // Optional stages do not block progress
    if (depStage.optional) return false;

    return !isStageComplete(depStage);
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
// Behavior varies by `view`
// ================================
function Stage({ stage, allStages, view, journeyMode, customerId}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // -------------------------------
  // Derived stage state
  // Never stored; always computed
  // -------------------------------
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
        minHeight: "96px",
      }}
    >
      {/* -------------------------------
         Click behavior
         - Customers cannot open blocked stages
         - Certain stages navigate to detail views
         - Others expand inline
         ------------------------------- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          cursor: blocked ? "not-allowed" : "pointer",
          opacity: blocked ? 0.5 : 1,
        }}
        onClick={() => {
          if (blocked && view === "customer") return;

          const navigableStages = ["data", "config"];

          if (navigableStages.includes(stage.id)) {
            navigate(
            `/journey/${customerId}/${stage.id}`,
            { state: { view } }
            );
  return;
}

          if (!blocked) setOpen(!open);
        }}
      >
        <div>
          {/* Stage title */}
          <h4
  style={{
    margin: "0 0 6px 0",
    fontWeight: 600,
    fontSize: "18px",
    color: "#111",
  }}
>
  {stageMeta[stage.id]?.title ?? stage.id}
</h4>

          {/* Optionality (internal only) */}
          {view === "internal" && stage.optional && (
            <div style={{ fontSize: "13px", color: "#777" }}>
              Optional
              {journeyMode === "self-serve"
                ? " — typically skipped for self-serve customers"
                : ` — ${stage.optionalReason}`}
            </div>
          )}

          {/* Description */}
          {stage.id === "kickoff" && (
            <div style={{ fontSize: "13px", color: "#777" }}>
              This stage focuses on alignment and does not require setup.
            </div>
          )}

          {/* Metadata */}
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
            {view === "internal" && (
              <>
                <strong>Owner:</strong> {stage.owner} ·{" "}
              </>
            )}
            <strong>Due:</strong> {stage.dueDate}
          </div>

          {/* ===============================
              Internal signals & guidance
              Ordered: status → ownership → context
             =============================== */}

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

          {view === "internal" &&
            stage.owner === "Customer" &&
            !isStageComplete(stage) && (
              <div style={{ fontSize: "13px", color: "#777" }}>
                Progress depends on customer action at this stage.
              </div>
            )}

          {view === "internal" && risk === "due-soon" && (
            <div style={{ fontSize: "13px", color: "#777" }}>
              Consider nudging the customer to avoid delays.
            </div>
          )}

          {view === "internal" && risk === "overdue" && (
            <div style={{ fontSize: "13px", color: "#777" }}>
              This delay may impact overall onboarding timelines.
            </div>
          )}

          {view === "internal" && stage.id === "data" && (
            <div style={{ fontSize: "13px", color: "#777" }}>
              This stage commonly takes longer due to security reviews.
            </div>
          )}

          {/* Customer-facing status */}
          {view === "customer" && (
            <div style={{ fontSize: "14px", color: "#999" }}>
              {isStageComplete(stage)
                ? "Completed"
                : blocked
                ? "Waiting for previous step"
                : "In progress"}
            </div>
          )}

          {view === "customer" && stage.id === "data" && !blocked && (
            <div style={{ fontSize: "13px", color: "#777" }}>
              We’ll guide you through this step.
            </div>
          )}
        </div>
      </div>

      {/* Inline task list (non-navigational stages only) */}
      {open && (
        <ul style={{ marginTop: "12px" }}>
          {stage.tasks.map((task) => (
            <li key={task.id} style={{ fontSize: "14px" }}>
              {task.done ? "✅" : "⬜"} {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ================================
// Journey Page (Top-level)
// Owns:
// - view mode
// - progress
// - overall health
// ================================

export default function Journey() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const journeyData = getJourneyByCustomerId(customerId);
    if (!journeyData) {
  return (
    <div style={{ padding: "32px" }}>
      <h2>Unknown customer</h2>
      <p>This onboarding journey does not exist.</p>
    </div>
  );
}
  // Infer last activity (proxy for backend event data)
  const lastUpdatedStage = journeyData.stages
  .slice()
  .reverse()
  .find((stage) => stage.tasks.some((t) => t.done));

  const lastUpdatedLabel = lastUpdatedStage
  ? `${lastUpdatedStage.name} updated recently`
  : "No recent activity";
  const [view, setView] = useState("internal");

  const totalTasks = journeyData.stages.flatMap((s) => s.tasks).length;
  const completedTasks = journeyData.stages
    .flatMap((s) => s.tasks)
    .filter((t) => t.done).length;

  const progress = Math.round((completedTasks / totalTasks) * 100);
  const health = getOverallHealth(journeyData.stages);



  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>

      {/* Journey overview */}
      <div style={{ marginBottom: "28px", borderBottom: "1px solid #eee" }}>
        <h2>
          Onboarding Journey — {journeyData.customerName} ({customerId})
        </h2>

        <p style={{ fontSize: "13px", color: "#777" }}>
          {journeyData.journeyType} · Designed for minimal setup and quick
          activation · Target completion: {journeyData.targetCompletion}
        </p>

        <p>
          <strong>Progress:</strong> {progress}% completed
        </p>

        <p style={{ fontSize: "13px", color: "#777" }}>
          Last activity: {lastUpdatedLabel}
        </p>

        {view === "internal" && (
          <>
            <p>
              <strong>Overall Health:</strong>{" "}
              {health === "red"
                ? "🔴 Blocked / Overdue"
                : health === "amber"
                ? "🟡 At Risk"
                : "🟢 On Track"}
            </p>
            <p style={{ fontSize: "13px", color: "#777" }}>
              Success criteria: {journeyData.successOutcome}
            </p>
          </>
        )}
      </div>

      {/* View toggle */}
      <div style={{ marginBottom: "28px" }}>
        <button onClick={() => setView("internal")}>Internal View</button>
        <button onClick={() => setView("customer")}>Customer View</button>
      </div>

      {/* Stages */}
      {journeyData.stages.map((stage) => (
        <Stage
          key={stage.id}
          stage={stage}
          allStages={journeyData.stages}
          view={view}
          journeyMode={journeyData.journeyMode}
          customerId={customerId}
        />
      ))}
    </div>
  );
}