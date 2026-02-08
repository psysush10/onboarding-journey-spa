import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { loginAsInternal, loginAsCustomer } = useAuth();
  const navigate = useNavigate();

  function handleInternalLogin() {
    loginAsInternal();
    navigate("/dashboard", { replace: true });
  }

  function handleCustomerLogin(customerId: string) {
    loginAsCustomer(customerId);
    navigate(`/journey/${customerId}`, { replace: true });
  }

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "auto" }}>
      <h2>Login</h2>

      <button
        style={{ width: "100%", marginBottom: 12 }}
        onClick={handleInternalLogin}
      >
        Login as Internal
      </button>

      <button
        style={{ width: "100%", marginBottom: 12 }}
        onClick={() => handleCustomerLogin("acme")}
      >
        Login as Acme Customer
      </button>

      <button
        style={{ width: "100%" }}
        onClick={() => handleCustomerLogin("globex")}
      >
        Login as Globex Customer
      </button>
    </div>
  );
}