import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchJourneys } from "../api/journeys";

function HealthBadge({ health }) {
  const styles = {
    "on-track": { color: "green" },
    "at-risk": { color: "orange" },
    "delayed": { color: "red" },
  };

  return (
    <span style={{ color: styles[health].color, fontWeight: "bold" }}>
      {health}
    </span>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
  fetchJourneys()
    .then((data) => {
      setJourneys(data);
    })
    .catch((err) => {
      console.error("Error fetching journeys:", err);
    });
}, []);

  return (
    <div style={{ padding: "24px" }}>
      <h2>Customer Onboarding Dashboard</h2>
      <div>
      {journeys.map((j) => (
        <div key={j.id}>
          {j.customerName} — {j.status}
        </div>
      ))}
    </div>

      {/* <table width="100%" cellPadding="10">
        <tbody>
          {journeys.map((journey) => (
  <div
    key={journey.customerId}
    style={{
      padding: "16px",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      marginBottom: "16px",
    }}
  >
    <h3 style={{ marginBottom: "4px" }}>
      {journey.customerName}
    </h3>

    <p style={{ fontSize: "13px", color: "#777" }}>
      {journey.journeyType}
    </p>

    <button
      style={{ marginTop: "8px" }}
      onClick={() =>
        navigate(`/journey/${journey.customerId}`)
      }
    >
      Open Journey →
    </button>
  </div>
))}
        </tbody>
      </table> */}
    </div>
  );
}