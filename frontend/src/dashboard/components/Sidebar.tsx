import { NavLink } from "react-router-dom";
import { Home, Users, Grid, Calendar } from "lucide-react";

const Sidebar = () => {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/users", label: "Users", icon: <Users size={18} /> },
    { to: "/spaces", label: "Spaces", icon: <Grid size={18} /> },
    
    {
      to: "/reservations",
      label: "Reservations",
      icon: <Calendar size={18} />,
    },
    { to: "/memberships", label: "Memberships", icon: <Grid size={18} /> },

  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6">
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
  );
};

export default Sidebar;
