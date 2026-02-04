import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Journey from "./pages/Journey";
import StageDetail from "./pages/StageDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journey/:customerId" element={<Journey />} />
        <Route path="/journey/:accountId/:stageKey" element={<StageDetail />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;