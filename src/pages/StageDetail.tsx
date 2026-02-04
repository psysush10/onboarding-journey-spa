import { useLocation, useParams, useNavigate} from "react-router-dom";


export default function StageDetail() {
  const { accountId, stageKey } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const view = location.state?.view || "customer";
  let title = "";
  let description = "";

  if (stageKey === "access-data") {
  title = "Access & Data Collection";
  description =
    "This stage connects your core systems so we can generate your first meaningful insights.";
}

if (stageKey === "product-config") {
  title = "Product Configuration";
  description =
    "This stage helps tailor the product to your workflows so your team gets value faster.";
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
      <h2>{title}</h2>
      <p>Account: {accountId}</p>
      <p style={{ marginTop: "16px", maxWidth: "640px", color: "#555" }}>
  {description}
</p>

{view === "customer" && (
  <div style={{ marginTop: "24px", maxWidth: "640px" }}>
    <h3>What you need to do</h3>

    <p style={{ color: "#555" }}>
      To continue onboarding, please complete the steps below. Once these
      are done, we’ll start generating insights for your team.
    </p>

    <ul style={{ marginTop: "12px", color: "#555" }}>
      <li>Connect your primary data source</li>
      <li>Verify access permissions</li>
      <li>Confirm sample data is flowing correctly</li>
    </ul>

    <p style={{ fontSize: "13px", color: "#777", marginTop: "8px" }}>
  Most teams complete this step in under 15 minutes.
</p>
  </div>
)}

{view === "internal" && (
  <div style={{ marginTop: "24px", maxWidth: "640px" }}>
    <h3>Internal status</h3>

    <ul style={{ color: "#555" }}>
      <li>Customer has not yet granted API access</li>
      <li>Security approval pending</li>
      <li>Risk of delay if not completed within 48 hours</li>
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
  <strong>Coming up next</strong>
  <p style={{ fontSize: "14px", color: "#666" }}>
    Your first dashboard will appear here once data access is complete.
  </p>
</div>
    </div>
  );
}