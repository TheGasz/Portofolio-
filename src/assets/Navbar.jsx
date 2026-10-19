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
    <nav className="fixed top-0 w-full z-50 start-0 bg-night-900/70 backdrop-blur-xl shadow-lg shadow-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-5 py-3">
        <Link
          to="/"
          className="focus-ring flex items-center min-h-[44px] px-3 py-2 -mx-3 rounded-lg group"
        >
          <span className="self-center text-2xl font-bold whitespace-nowrap tracking-tight bg-gradient-to-r from-sky-200 via-teal-200 to-amber-100 bg-clip-text text-transparent transition-opacity group-hover:opacity-80">
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
                className={`focus-ring relative inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg transition-colors duration-300 ${
                  active
                    ? "text-blue-600 font-bold after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-sky-400 after:to-teal-400"
                    : "text-slate-300 font-medium hover:text-teal-200"
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
