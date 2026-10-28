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
    <nav className="fixed top-0 start-0 z-50 w-full border-b border-ink bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
        <Link
          to="/"
          className="focus-ring group -mx-2 flex min-h-[44px] items-center gap-2.5 rounded-lg px-2 py-2"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-full bg-ink font-serif text-lg italic text-paper transition-transform duration-300 group-hover:-rotate-12 motion-reduce:transform-none"
          >
            b
          </span>
          <span className="whitespace-nowrap text-lg font-bold tracking-tight text-ink">
            {title}
          </span>
        </Link>
        <div className="flex items-center gap-1 rounded-full border border-ink bg-card p-1">
          {NAV_LINKS.map(({ to, label }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                // `text-blue-600 font-bold` are the active-state hooks pinned by
                // Navbar.property.test; the visible color is forced to paper.
                className={`focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                  active
                    ? "text-blue-600 font-bold bg-ink text-paper!"
                    : "font-semibold text-ink-soft hover:bg-paper-2 hover:text-ink"
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
