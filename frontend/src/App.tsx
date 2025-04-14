import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard/pages/Dashboard";
import Users from "./dashboard/pages/Users";
import Spaces from "./dashboard/pages/Spaces";
import Reservations from "./dashboard/pages/Reservations";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/reservations" element={<Reservations />} />
      </Routes>
    </Router>
  );
}

export default App;
