import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Icon, Book } from "lucide-react";
import { isAuthenticated } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserName(decoded.name);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_role");
    navigate("/auth");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Space", path: "/space" },
    { name: "Contact", path: "/contact" },
    { name: "Pricing Plans", path: "/pricingPlans" },
    { name: "My Reservations", path: "/myReservations" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm px-6 py-4 flex justify-between items-center">
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

      {isAuthenticated() ? (
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-md hover:bg-blue-800 transition-colors"
          >
            <User size={20} />
            <span>{userName}</span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings size={18} />
                Edit Profile
              </Link>
              <Link
                to="/mymemberships"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Book size={18} />
                My Memberships
              </Link>
              <Link
                to="/myreservations"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Book size={18} />
                My Reservations
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/auth"
          className="bg-blue-700 text-white font-semibold py-2 px-7 rounded-xl text-md hover:bg-blue-800 transition-colors"
        >
          Log In
        </Link>
      )}
    </header>
  );
};

export default Header;
