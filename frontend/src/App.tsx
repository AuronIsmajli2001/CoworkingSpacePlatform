import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard/pages/Dashboard";
import Users from "./dashboard/pages/Users";
import Spaces from "./dashboard/pages/Spaces";
import Reservations from "./dashboard/pages/Reservations";
import Memberships from "./dashboard/pages/Memberships";
import Home from "./pages/Home";
import About from "./pages/About";
import Space from "./pages/Space";
import SpaceDetails from "./pages/SpaceDetails";
import Contact from "./pages/Contact";
import PricingPlans from "./pages/PricingPlans";
import MyReservations from "./pages/MyReseravtions";
import React from "react";
import Auth from "./pages/Auth";
import EditProfile from "./pages/EditProfile";
import MyMembership from "./pages/UserProfile/MyMembership";
import Equipment from "./dashboard/pages/Equipment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricingplans" element={<PricingPlans />} />
        <Route path="/space" element={<Space />} />
        <Route path="/space/:id" element={<SpaceDetails />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/myreservations" element={<MyReservations />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/userprofile/mymembership" element={<MyMembership />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/equipment" element={<Equipment />} />
      </Routes>
    </Router>
  );
}

export default App;
