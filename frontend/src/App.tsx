import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard/pages/Dashboard";
import Users from "./dashboard/pages/Users";
import Spaces from "./dashboard/pages/Spaces";
import Reservations from "./dashboard/pages/Reservations";
import Home from "./pages/Home";
import About from "./pages/About";
import Space from "./pages/Space";
import Contact from "./pages/Contact";
import PricingPlans from "./pages/PricingPlans";
import React from "react";
import Auth from "./pages/Auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricingplans" element={<PricingPlans />} />
        <Route path="/space" element={<Space />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/spaces" element={<Spaces />} /> 
      </Routes>
    </Router>
  );
}

export default App;
