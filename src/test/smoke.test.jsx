import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// Smoke test: confirms the Vitest + RTL + jest-dom + jsdom harness runs.
describe("test harness smoke test", () => {
  it("mounts a trivial element under jsdom", () => {
    render(<h1>Harness is alive</h1>);

    expect(screen.getByText("Harness is alive")).toBeInTheDocument();
  });

  it("exposes a jsdom document", () => {
    expect(typeof document).toBe("object");
    expect(document.body).toBeInstanceOf(HTMLElement);
  });
});
