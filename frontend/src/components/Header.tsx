import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Settings,
  Menu,
  X,
  IdCard,
  CalendarCheck,
} from "lucide-react";
import { isAuthenticated } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both menu and menu button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
  ];

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm px-6 py-4">
      {/* Desktop View */}
      <div className="hidden md:flex justify-between items-center">
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
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="flex items-center gap-2 bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-md hover:bg-blue-800 transition-colors"
            >
              <User size={20} />
              <span>{userName}</span>
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200"
              >
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:rounded-t-xl"
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
                  to="/userprofile/myreservation"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:rounded-b-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CalendarCheck size={18} />
                  My Reservations
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left border-t border-gray-200"
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
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-3xl font-extrabold text-blue-600">☉</div>
          <span className="text-2xl font-semibold tracking-wide text-gray-800">
            Co<span className="text-blue-600">Space</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated() ? (
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="flex items-center gap-1 bg-blue-700 text-white font-semibold py-2 px-3 rounded-xl text-sm hover:bg-blue-800 transition-colors"
              >
                <User size={18} />
                <span className="max-w-[80px] truncate">{userName}</span>
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200"
                  ref={menuRef}
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:rounded-t-xl"
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
                    to="/userprofile/myreservation"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:rounded-b-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CalendarCheck size={18} />
                    My Reservations
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left border-t border-gray-200"
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
              className="bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-sm hover:bg-blue-800 transition-colors"
            >
              Log In
            </Link>
          )}

          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white shadow-md w-full mt-4"
        >
          <nav className="flex flex-col">
            <div className="border-t border-gray-200 w-full"></div>
            {navItems.map((item, index) => (
              <React.Fragment key={item.name}>
                <Link
                  to={item.path}
                  className={`font-medium py-4 px-6 ${
                    location.pathname === item.path
                      ? "text-blue-600"
                      : "text-black hover:text-blue-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {index < navItems.length - 1 && (
                  <div className="border-t border-gray-200 w-full"></div>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
