import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Static/structure review of the shell and page/section files. This suite reads
// the source files as text and asserts the structural conventions from the
// design hold without importing or rendering the modules.
//
// Covers Requirements:
//   13.4 — Each page/section file exposes a named export plus a default export
//   13.5 — Routes are centralized in App.jsx (single <Routes> with both paths)
//   5.4  — projectsData is a module-level const in project.jsx
//   9.1/9.2/9.3 — Projects grid uses responsive column utilities
//   11.2 — Reduced-motion handling (motion-reduce variants + global CSS rule)

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");

const read = (...segments) => readFileSync(resolve(root, ...segments), "utf8");

const navbarSrc = read("src", "assets", "Navbar.jsx");
const coreSrc = read("src", "assets", "core.jsx");
const projectSrc = read("src", "assets", "project.jsx");
const appSrc = read("src", "App.jsx");
const indexCssSrc = read("src", "index.css");

describe("named + default exports on page/section files (Req 13.4)", () => {
  it("Navbar.jsx exports both `Header` (named) and a `Header` default", () => {
    expect(navbarSrc).toMatch(/export\s+const\s+Header\b/);
    expect(navbarSrc).toMatch(/export\s+default\s+Header\b/);
  });

  it("core.jsx exports both `Core` (named) and a `Core` default", () => {
    expect(coreSrc).toMatch(/export\s+const\s+Core\b/);
    expect(coreSrc).toMatch(/export\s+default\s+Core\b/);
  });

  it("project.jsx exports both `Projects` (named) and a `Projects` default", () => {
    expect(projectSrc).toMatch(/export\s+const\s+Projects\b/);
    expect(projectSrc).toMatch(/export\s+default\s+Projects\b/);
  });
});

describe("routes centralized in App.jsx (Req 13.5)", () => {
  it("defines the Home and Projects routes", () => {
    expect(appSrc).toMatch(/path=(["'])\/\1/); // path="/"
    expect(appSrc).toMatch(/path=(["'])\/project\1/); // path="/project"
  });

  it("wraps the routes in a <Routes> element", () => {
    expect(appSrc).toMatch(/<Routes\b/);
  });
});

describe("projectsData is a module-level const (Req 5.4)", () => {
  it("declares `const projectsData = [` at module scope in project.jsx", () => {
    // Anchored to the start of a line (allowing only indentation) so the match
    // is a top-level declaration rather than one nested inside a function body.
    expect(projectSrc).toMatch(/^[ \t]*const\s+projectsData\s*=\s*\[/m);
  });
});

describe("responsive grid utilities on the projects grid (Req 9.1-9.3)", () => {
  it("uses grid-cols-1, md:grid-cols-2 and lg:grid-cols-3", () => {
    expect(projectSrc).toContain("grid-cols-1");
    expect(projectSrc).toContain("md:grid-cols-2");
    expect(projectSrc).toContain("lg:grid-cols-3");
  });
});

describe("reduced-motion handling (Req 11.2)", () => {
  it("core.jsx uses per-element `motion-reduce:` variants", () => {
    expect(coreSrc).toMatch(/motion-reduce:/);
  });

  it("src/index.css carries the global prefers-reduced-motion safety net", () => {
    expect(indexCssSrc).toMatch(
      /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/
    );
  });
});
