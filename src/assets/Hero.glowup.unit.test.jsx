import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Core from "./core.jsx";

// Hero regression (task 9.2) for the portfolio-glow-up spec.
//
// Confirms the glow-up hero changes preserve the pre-existing heading
// invariants and wire the animated gradient onto the name span:
//   - Home still renders exactly one <h1>              (Req 5.4, 7.3)
//   - that <h1> still contains the name "Bagas"        (Req 5.1)
//   - a <span class="animated-gradient-text"> whose textContent is "Bagas"
//     lives inside the <h1>                            (Req 5.1)

afterEach(() => {
  cleanup();
});

describe("Hero regression: single h1 + animated gradient name (Req 5.1, 5.4, 7.3)", () => {
  it("renders exactly one <h1> on Home", () => {
    const { container } = render(
      <MemoryRouter>
        <Core />
      </MemoryRouter>
    );

    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("keeps the name 'Bagas' inside the single <h1>", () => {
    const { container } = render(
      <MemoryRouter>
        <Core />
      </MemoryRouter>
    );

    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1.textContent).toContain("Bagas");
    // Full visible text is the personable intro, e.g. "Hi, I'm Bagas.".
    expect(h1.textContent.replace(/\s+/g, " ").trim()).toBe("Hi, I'm Bagas.");
  });

  it("carries the animated-gradient-text class on the name span inside the <h1>", () => {
    const { container } = render(
      <MemoryRouter>
        <Core />
      </MemoryRouter>
    );

    const h1 = container.querySelector("h1");
    const gradientSpan = container.querySelector("span.animated-gradient-text");

    expect(gradientSpan).not.toBeNull();
    expect(gradientSpan.textContent).toBe("Bagas");
    // The gradient-animated name span must live inside the hero <h1>.
    expect(h1.contains(gradientSpan)).toBe(true);
  });
});
