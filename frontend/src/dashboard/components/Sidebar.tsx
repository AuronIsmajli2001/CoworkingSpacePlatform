import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Grid,
  Calendar,
  CreditCard,
  UserPlus,
  Layers,
  Cpu,
  Wrench,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/users", label: "Users", icon: <Users size={18} /> },
    { to: "/spaces", label: "Spaces", icon: <Grid size={18} /> },
    {
      to: "/reservations",
      label: "Reservations",
      icon: <Calendar size={18} />,
    },
    { to: "/memberships", label: "Memberships", icon: <Layers size={18} /> },
    { to: "/equipment", label: "Equipment", icon: <Wrench size={18} /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <div>
        <h2 className="text-gray-400 uppercase text-sm mb-6">Main</h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              to={link.to}
              key={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 ${
                  isActive ? "bg-gray-800" : ""
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 mt-auto"
        onClick={() => navigate("/")}
      >
        <Home size={18} />
        Go to Home
      </button>
    </div>
  );
};

export default Sidebar;
