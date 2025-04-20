import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Space", path: "/space" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold text-pink-700">😃</div>
        <span className="font-bold uppercase text-sm tracking-widest">
          CoSpace
        </span>
      </div>

      <nav className="flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`font-medium ${
              location.pathname === item.path
                ? "text-pink-600"
                : "text-black hover:text-pink-600"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <Link
        to="/pricingPlans"
        className="bg-pink-700 text-white font-semibold py-2 px-5 rounded-xl text-sm"
      >
        Pricing Plans
      </Link>
    </header>
  );
};

export default Header;
