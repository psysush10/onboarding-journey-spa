import { useLocation, useParams, useNavigate} from "react-router-dom";
const stageConfig: Record<string, {
  title: string;
  description: string;
  customerSteps: string[];
  internalNotes: string[];
}> = {
  "kickoff": {
    title: "Kickoff & Alignment",
    description:
      "This stage aligns stakeholders on goals, scope, and success criteria before deeper setup begins.",
    customerSteps: [
      "Attend kickoff call",
      "Confirm goals and success metrics",
      "Agree on timeline"
    ],
    internalNotes: [
      "Ensure stakeholders are identified",
      "Confirm success criteria is documented"
    ]
  },
  "data": {
    title: "Access & Data Collection",
    description:
      "This stage connects core systems so meaningful insights can be generated.",
    customerSteps: [
      "Connect primary data source",
      "Verify access permissions",
      "Confirm sample data"
    ],
    internalNotes: [
      "Check API access",
      "Watch for security delays"
    ]
  },
  "config": {
    title: "Product Configuration",
    description:
      "This stage tailors the product to the customer’s workflows and use cases.",
    customerSteps: [
      "Review default configuration",
      "Confirm workflows",
      "Validate initial setup"
    ],
    internalNotes: [
      "Confirm configuration aligns with use case",
      "Flag custom requests early"
    ]
  }
};

export default function StageDetail() {
  const { accountId, stageKey } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const rawState = location.state;
  const view =
  typeof rawState === "string"
    ? rawState
    : rawState?.view || "customer";
  const stage = stageConfig[stageKey || "" ]|| null;
  //console.log("RAW location.state:", location.state);
  // console.log("stageKey from URL:", stageKey);
  //console.log("view from route:", view);
  // console.log("stageConfig keys:", Object.keys(stageConfig));
  // console.log("resolved stage:", stage);
  if (!stage) {
  return (
    <div style={{ padding: "32px" }}>
      <h2>Unknown stage</h2>
      <p>This stage is not configured.</p>
    </div>
  );
}


  return (
    <div style={{ padding: "32px" }}>
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
      <h2 style={{ fontSize: "24px", marginBottom: "4px" }}>{stage.title}</h2>
      <p style={{ fontSize: "13px", color: "#777" }}>Account: {accountId}</p>
      <p style={{ marginTop: "16px", maxWidth: "640px", color: "#555" }}>
  {stage.description}
</p>

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
      ⚠️ Recommended action: schedule a 15-minute working session if this remains incomplete.
    </div>
  </div>
)}

<div
  style={{
    marginTop: "24px",
    padding: "16px",
    border: "1px dashed #ccc",
    borderRadius: "8px",
    maxWidth: "480px",
  }}
> 
  <div>
  <strong>Coming up next</strong>
  <p style={{ fontSize: "14px", color: "#666" }}>
    Your first dashboard will appear here once data access is complete.
  </p>
</div>
<p style={{ fontSize: "12px", color: "#999", marginTop: "24px" }}>
  This view focuses on guidance and outcomes. Progress and task status
  are shown in the journey overview.
  This demo illustrates stage structure and guidance.
  Task completion and progress updates are intentionally read-only.
</p>
</div>
    </div>
  );
}