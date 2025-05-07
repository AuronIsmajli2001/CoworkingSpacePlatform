import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Space", path: "/space" },
    { name: "Contact", path: "/contact" },
    { name: "Pricing Plans", path: "/pricingPlans"},
    { name: "My reservations", path: "/myreservations" },
  ];

  return (
    <header className=" fixed top-0 w-full z-50 bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="text-3xl font-extrabold text-blue-600">☉</div>
        <span className="text-2xl font-semibold tracking-wide text-gray-800">
          Co<span className="text-blue-600">Space</span>
        </span>
      </div>

      <nav className="flex gap-10">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`font-medium ${
              location.pathname === item.path
                ? "text-blue-600"
                : "text-black hover:text-blue-600"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <Link
        to="/auth"
        className="bg-blue-700 text-white font-semibold py-2 px-7 rounded-xl text-md"
      >
        Log In
      </Link>
    </header>
  );
};

export default Header;
