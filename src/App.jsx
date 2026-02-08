import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Journey from "./pages/Journey";
import StageDetail from "./pages/StageDetail";
import RequireAuth from "./auth/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/journey/:customerId" element={<RequireAuth><Journey /></RequireAuth>} />
        <Route path="/journey/:accountId/:stageKey" element={<RequireAuth><StageDetail key={location.pathname}/></RequireAuth>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;