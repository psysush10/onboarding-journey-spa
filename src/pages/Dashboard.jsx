import { useNavigate } from "react-router-dom";

const customers = [
  {
    id: "acme",
    name: "Acme Corp",
    owner: "Sushanth",
    progress: 65,
    health: "at-risk",
  },
  {
    id: "globex",
    name: "Globex Inc",
    owner: "Sushanth",
    progress: 90,
    health: "on-track",
  },
];

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

  return (
    <div style={{ padding: "24px" }}>
      <h2>Customer Onboarding Dashboard</h2>

      <table width="100%" cellPadding="10">
        <thead>
          <tr>
            <th align="left">Customer</th>
            <th align="left">Owner</th>
            <th align="left">Progress</th>
            <th align="left">Health</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.owner}</td>
              <td>{customer.progress}%</td>
              <td>
                <HealthBadge health={customer.health} />
              </td>
              <td>
                <button
                  onClick={() => navigate(`/journey/${customer.id}`)}
                >
                  Open Journey →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}