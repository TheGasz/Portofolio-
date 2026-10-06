import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../index.css";

// Centralized nav link definitions so Home + Projects render on every route.
const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/project", label: "Projects" },
];

export const Header = ({ title }) => {
  const location = useLocation();

  // A link is active only when its target exactly matches the current path.
  // Unknown routes match neither link, leaving both in the inactive state.
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 start-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-5 py-3">
        <Link
          to="/"
          className="focus-ring flex items-center min-h-[44px] px-3 py-2 -mx-3 rounded-lg"
        >
          <span className="self-center text-2xl font-bold whitespace-nowrap text-gray-900 tracking-tight">
            {title}
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {NAV_LINKS.map(({ to, label }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                className={`focus-ring inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg transition-colors duration-300 ${
                  active
                    ? "text-blue-600 font-bold"
                    : "text-gray-700 font-medium hover:text-blue-600"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Header;
