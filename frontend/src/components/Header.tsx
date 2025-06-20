import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Settings,
  IdCard,
  CalendarCheck,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { isAuthenticated } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const menuRef = useRef(null);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Space", path: "/space" },
    { name: "Contact", path: "/contact" },
    { name: "Pricing Plans", path: "/pricingPlans" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserName(decoded.name);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/auth");
  };

  const isAdmin = () => {
    return userRole === "Staff" || userRole === "SuperAdmin";
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="text-3xl font-extrabold text-blue-600">☉</div>
        <span className="text-2xl font-semibold tracking-wide text-gray-800">
          Co<span className="text-blue-600">Space</span>
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-10">
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

      {/* Right side: menu toggle + profile */}
      <div className="flex items-center gap-4">
        {/* Profile/Login */}
        {isAuthenticated() ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-md hover:bg-blue-800 transition-colors"
            >
              <User size={20} />
              <span className="hidden md:inline">{userName}</span>
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
                  to="/userprofile/mymembership"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IdCard size={18} />
                  My Memberships
                </Link>
                <Link
                  to="/myreservations"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CalendarCheck size={18} />
                  My Reservations
                </Link>

                {/* Show Dashboard link only for admin users */}
                {isAdmin() && (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}

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
            className="hidden md:block bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-md hover:bg-blue-800 transition-colors"
          >
            Log In
          </Link>
        )}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md px-6 py-4 flex flex-col md:hidden z-40">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`py-2 font-medium ${
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-black hover:text-blue-600"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
