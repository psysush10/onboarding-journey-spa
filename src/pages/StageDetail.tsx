import { useLocation, useParams, useNavigate } from "react-router-dom";

// ================================
// Stage detail configuration
// -------------------------------
// This file focuses on *guidance and context*,
// not task execution or progress updates.
// Task state lives in the Journey view.
// ================================
type StageConfig = {
  title: string;
  description: string;
  customerSteps: string[];
  internalNotes: string[];
};

const stageConfigByCustomer: Record<
  string,
  Record<string, StageConfig>
> = {
  acme: {
    data: {
      title: "Access & Data Collection",
      description:
        "Connect your core systems so meaningful insights can be generated.",
      customerSteps: [
        "Connect primary data source",
        "Verify access permissions",
        "Confirm sample data",
      ],
      internalNotes: [
        "Check API access",
        "Watch for security delays",
      ],
    },
    config: {
      title: "Product Configuration",
      description:
        "Tailor the product to Acme’s workflows and reporting needs.",
      customerSteps: [
        "Review default configuration",
        "Confirm workflows",
        "Validate initial setup",
      ],
      internalNotes: [
        "Confirm configuration aligns with use case",
        "Flag custom requests early",
      ],
    },
    kickoff: {
      title: "Kickoff & Alignment",
      description:
        "Align stakeholders on goals, scope, and success criteria.",
      customerSteps: [
        "Attend kickoff call",
        "Confirm goals and success metrics",
        "Agree on timeline",
      ],
      internalNotes: [
        "Ensure stakeholders are identified",
        "Confirm success criteria is documented",
      ],
    },
  },

  globex: {
    data: {
      title: "System Access & Integrations",
      description:
        "Our team will guide you through secure system access.",
      customerSteps: [
        "Join guided setup session",
        "Approve access scopes",
        "Confirm integration success",
      ],
      internalNotes: [
        "Coordinate with security team",
        "Expect longer review cycles",
      ],
    },
    config: {
      title: "Guided Configuration",
      description:
        "We’ll configure the product together during a working session.",
      customerSteps: [
        "Attend configuration call",
        "Review proposed setup",
        "Approve final configuration",
      ],
      internalNotes: [
        "Prepare configuration draft",
        "Document customer preferences",
      ],
    },
    kickoff: {
      title: "Kickoff & Alignment",
      description:
        "A guided kickoff to align teams before setup begins.",
      customerSteps: [
        "Attend kickoff session",
        "Review onboarding plan",
        "Confirm points of contact",
      ],
      internalNotes: [
        "Introduce implementation team",
        "Set communication cadence",
      ],
    },
  },
};

export default function StageDetail() {
  const { accountId, stageKey } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
console.log("StageDetail route params:", {
  accountId,
  stageKey,
});

console.log(
  "Available customers:",
  Object.keys(stageConfigByCustomer)
);

console.log(
  "Resolved stage:",
  stageConfigByCustomer[accountId || ""]?.[stageKey || ""]
);
  // -------------------------------
  // View resolution
  // View is passed from Journey to preserve context.
  // Defaults to customer-safe view if missing.
  // -------------------------------
  const rawState = location.state;
  const view =
    typeof rawState === "string" ? rawState : rawState?.view || "customer";

  // Resolve stage configuration
  const stage =
  stageConfigByCustomer[accountId || ""]?.[stageKey || ""] || null;

  // -------------------------------
  // Guard: unknown stage
  // -------------------------------
  if (!stage) {
  return (
    <div style={{ padding: "32px" }}>
      <h2>Stage not configured</h2>
      <p>
        No configuration found for stage{" "}
        <strong>{stageKey}</strong> in journey{" "}
        <strong>{accountId}</strong>.
      </p>
      <button onClick={() => navigate(`/journey/${accountId}`)}>
        Back to Journey
      </button>
    </div>
  );
}

  return (
    <div style={{ padding: "32px" }}>
      {/* -------------------------------
         Navigation
         ------------------------------- */}
      <div
        onClick={() => navigate(`/journey/${accountId}`)}
        style={{
          cursor: "pointer",
          color: "#1976d2",
          fontSize: "14px",
          marginBottom: "12px",
        }}
      >
        ← Back to Journey
      </div>

      {/* -------------------------------
         Stage header
         ------------------------------- */}
      <h2 style={{ fontSize: "24px", marginBottom: "4px" }}>{stage.title}</h2>
      <p style={{ fontSize: "13px", color: "#777" }}>Account: {accountId}</p>

      <p style={{ marginTop: "16px", maxWidth: "640px", color: "#555" }}>
        {stage.description}
      </p>

      {/* ===============================
          Customer view
          Focus: clear next steps
         =============================== */}
      {view === "customer" && (
        <div style={{ marginTop: "24px", maxWidth: "640px" }}>
          <h3 style={{ marginBottom: "8px" }}>What you need to do</h3>

          <p style={{ color: "#555", marginBottom: "12px" }}>
            To continue onboarding, please complete the steps below. Once these
            are done, we’ll start generating insights for your team.
          </p>

          <ul style={{ marginTop: "12px", color: "#555" }}>
            {stage.customerSteps.map((step, index) => (
              <li key={index} style={{ marginBottom: "6px" }}>
                {index === 0 ? "✅" : "⬜"} {step}
              </li>
            ))}
          </ul>

          <p style={{ fontSize: "13px", color: "#777", marginTop: "12px" }}>
            Most teams complete this step in under 15 minutes.
          </p>
        </div>
      )}

      {/* ===============================
          Internal view
          Focus: context, risk, and guidance
         =============================== */}
      {view === "internal" && (
        <div style={{ marginTop: "24px", maxWidth: "640px" }}>
          <h3 style={{ marginTop: "32px" }}>Internal status</h3>

          <ul style={{ marginTop: "12px", color: "#555" }}>
            {stage.internalNotes.map((note, index) => (
              <li key={index} style={{ marginBottom: "6px" }}>
                {note}
              </li>
            ))}
          </ul>

          <div
            style={{
              marginTop: "12px",
              padding: "12px",
              background: "#fff3e0",
              border: "1px solid #ffcc80",
              borderRadius: "6px",
            }}
          >
            ⚠️ Recommended action: schedule a 15-minute working session if this
            remains incomplete.
          </div>
        </div>
      )}

      {/* -------------------------------
         Forward-looking context
         ------------------------------- */}
      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          border: "1px dashed #ccc",
          borderRadius: "8px",
          maxWidth: "480px",
        }}
      >
        <strong>Coming up next</strong>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Your first dashboard will appear here once data access is complete.
        </p>

        <p style={{ fontSize: "12px", color: "#999", marginTop: "24px" }}>
          This view focuses on guidance and outcomes. Progress and task status
          are shown in the journey overview. This demo illustrates stage
          structure and guidance; task completion and progress updates are
          intentionally read-only.
        </p>
      </div>
    </div>
  );
}