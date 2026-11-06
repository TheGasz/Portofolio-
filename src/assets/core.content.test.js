import { describe, it, expect } from "vitest";
import { skills, aboutNarrative, certifications } from "./core.jsx";

// Unit tests for authored-content constraints on the Home page content.
// _Requirements: 2.1, 2.2, 3.1_

describe("skills — authored-content constraints", () => {
  it("contains between 3 and 12 items (inclusive)", () => {
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThanOrEqual(3);
    expect(skills.length).toBeLessThanOrEqual(12);
  });

  it("every skill has a title <= 40 chars and a description <= 200 chars", () => {
    for (const skill of skills) {
      expect(typeof skill.title).toBe("string");
      expect(skill.title.length).toBeGreaterThan(0);
      expect(skill.title.length).toBeLessThanOrEqual(40);

      expect(typeof skill.description).toBe("string");
      expect(skill.description.length).toBeGreaterThan(0);
      expect(skill.description.length).toBeLessThanOrEqual(200);
    }
  });
});

describe("aboutNarrative — authored-content constraints", () => {
  it("has at least 30 words", () => {
    expect(typeof aboutNarrative).toBe("string");
    const words = aboutNarrative.trim().split(/\s+/).filter(Boolean);
    expect(words.length).toBeGreaterThanOrEqual(30);
  });

  it("is written in a first-person voice", () => {
    expect(aboutNarrative).toMatch(/\b(I|I'm|I've|my|me)\b/);
  });
});

describe("certifications — verified metadata (Task 5)", () => {
  it("contains 7 certificates with non-empty metadata and no TODOs", () => {
    expect(certifications).toHaveLength(7);
    for (const cert of certifications) {
      expect(cert.title).toBeTruthy();
      expect(cert.issuer).toBeTruthy();
      expect(cert.issuer).not.toContain("TODO");
      expect(cert.issuer).not.toBe("Data science training");
      expect(cert.issuer).not.toBe("AI competition");
      expect(cert.date).toBeTruthy();
      expect(cert.href).toBeTruthy();
    }
  });
});
