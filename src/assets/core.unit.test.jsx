import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Core } from "./core.jsx";

afterEach(() => {
  cleanup();
});

// Unit tests for the Home hero CTAs and contact behavior.
//
// The Home sections (hero, "What I Do", About, Contact) are rendered inline by
// the single `Core` component, which reads the real module-level `siteConfig`
// and `skills` consts. There are no separately-exported SkillsSection /
// ContactSection components, so:
//   - Positive behaviors (hero content, CTAs, mailto link) are asserted against
//     the real `Core` output.
//   - Conditional omission (empty skills, null contactEmail) is covered with
//     small inline wrappers that replicate the exact gating logic `core.jsx`
//     uses (`skills.length > 0` and the trimmed-string contactEmail guard),
//     since the real consts cannot be overridden at module scope here.

describe("Core hero content (Req 1.1, 1.2)", () => {
  const renderHome = () =>
    render(
      <MemoryRouter>
        <Core />
      </MemoryRouter>
    );

  it("renders a single h1 containing the name 'Bagas'", () => {
    renderHome();

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(/Bagas/);
  });

  it("includes a first-person pronoun and the role 'Frontend Developer'", () => {
    renderHome();

    // First-person voice: "I" or "I'm" appears in the hero copy. The pronoun
    // shows up in several places on the page, so assert at least one match and
    // confirm the hero h1 itself ("Hi, I'm ... Bagas") carries it.
    expect(screen.getAllByText(/\bI(?:'m)?\b/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /I'm/
    );

    // Role descriptor is present (the eyebrow is a <p>, not a heading).
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
  });

  it("renders at least two hero CTAs including a '/project' link and a contact CTA", () => {
    renderHome();

    // CTA 1: router link to the Projects page.
    const viewWork = screen.getByRole("link", { name: /view my work/i });
    expect(viewWork).toHaveAttribute("href", "/project");

    // CTA 2: the in-hero contact CTA (anchored to the #contact section).
    const getInTouch = screen.getByRole("link", { name: /get in touch/i });
    expect(getInTouch).toHaveAttribute("href", "#contact");

    // >= 2 distinct CTAs in the hero.
    expect(viewWork).not.toBe(getInTouch);
  });
});

describe("Core client-side navigation (Req 1.3)", () => {
  it("navigates to /project via client routing when 'View My Work' is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Core />} />
          <Route path="/project" element={<div>Projects Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Starts on Home; the stub route content is not yet mounted.
    expect(screen.queryByText("Projects Page")).not.toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /view my work/i }));

    // Client-side navigation swaps the routed content without a full reload.
    expect(screen.getByText("Projects Page")).toBeInTheDocument();
  });
});

describe("Core contact CTA behavior (Req 4.2)", () => {
  it("exposes a mailto: contact link that does not open a new tab", () => {
    render(
      <MemoryRouter>
        <Core />
      </MemoryRouter>
    );

    // The real contact link lives in the #contact section as a mailto: anchor.
    const mailtoLinks = screen
      .getAllByRole("link")
      .filter((a) => (a.getAttribute("href") || "").startsWith("mailto:"));

    expect(mailtoLinks.length).toBeGreaterThanOrEqual(1);

    for (const link of mailtoLinks) {
      // Same browsing context: must not open in a new tab (Req 4.2).
      expect(link).not.toHaveAttribute("target", "_blank");
    }
  });
});

// Conditional omission (Req 2.4, 4.5).
//
// These wrappers mirror the exact gating logic in core.jsx. core.jsx omits the
// "What I Do" section when `skills.length === 0` and omits the contact CTA when
// `contactEmail` is null/empty (after trimming). Because the real consts are
// module-level and non-empty, we exercise the gating logic directly here.
describe("Core conditional omission logic (Req 2.4, 4.5)", () => {
  const SkillsSection = ({ skills }) =>
    skills.length > 0 ? (
      <section>
        <h2>What I Do</h2>
        {skills.map((s, i) => (
          <div key={i}>{s.title}</div>
        ))}
      </section>
    ) : null;

  const ContactSection = ({ contactEmail }) => {
    const hasContactEmail =
      typeof contactEmail === "string" && contactEmail.trim() !== "";
    return (
      <section>
        {hasContactEmail && (
          <a href={`mailto:${contactEmail}`}>Email me at {contactEmail}</a>
        )}
      </section>
    );
  };

  it("renders no 'What I Do' section when skills is empty (Req 2.4)", () => {
    render(<SkillsSection skills={[]} />);
    expect(
      screen.queryByRole("heading", { name: /what i do/i })
    ).not.toBeInTheDocument();
  });

  it("renders the 'What I Do' section when skills has items (Req 2.4)", () => {
    render(<SkillsSection skills={[{ title: "Web Development" }]} />);
    expect(
      screen.getByRole("heading", { name: /what i do/i })
    ).toBeInTheDocument();
  });

  it("renders no mailto link when contactEmail is null (Req 4.5)", () => {
    render(<ContactSection contactEmail={null} socials={[]} />);
    const mailtoLinks = screen
      .queryAllByRole("link")
      .filter((a) => (a.getAttribute("href") || "").startsWith("mailto:"));
    expect(mailtoLinks).toHaveLength(0);
  });

  it("renders no mailto link when contactEmail is an empty/whitespace string (Req 4.5)", () => {
    render(<ContactSection contactEmail="   " socials={[]} />);
    const mailtoLinks = screen
      .queryAllByRole("link")
      .filter((a) => (a.getAttribute("href") || "").startsWith("mailto:"));
    expect(mailtoLinks).toHaveLength(0);
  });

  it("renders a mailto link when contactEmail is a usable string (Req 4.5)", () => {
    render(<ContactSection contactEmail="hello@bagas.dev" socials={[]} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "mailto:hello@bagas.dev");
  });
});
