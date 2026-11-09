import { describe, it, expect } from "vitest";
import { projectsData } from "../project.jsx";
import { projectDetails, getProjectDetail } from "../projectDetails.js";
import { isValidHttpUrl } from "../url.js";

describe("projectDetails schema and data integrity", () => {
  it("every project in projectsData has a slug and matching projectDetail", () => {
    expect(projectsData.length).toBe(11);

    for (const project of projectsData) {
      expect(project.slug).toBeDefined();
      expect(typeof project.slug).toBe("string");
      expect(project.slug.length).toBeGreaterThan(0);

      const detail = getProjectDetail(project.slug);
      expect(detail).toBeDefined();
      expect(detail.slug).toBe(project.slug);
      expect(detail.title).toBe(project.title);
    }
  });

  it("all project details contain comprehensive required sections", () => {
    const validDemoTypes = ["iframe", "playground", "in-browser", "none"];
    const validNodeKinds = ["input", "process", "model", "guard", "output"];

    for (const [slug, detail] of Object.entries(projectDetails)) {
      expect(detail.slug).toBe(slug);
      expect(detail.tagline.length).toBeGreaterThan(10);
      expect(detail.category).toBeDefined();

      // Problem section
      expect(detail.problem).toBeDefined();
      expect(detail.problem.statement.length).toBeGreaterThan(20);
      expect(detail.problem.whoIsAffected.length).toBeGreaterThan(10);
      expect(detail.problem.whyML.length).toBeGreaterThan(10);
      expect(Array.isArray(detail.problem.constraints)).toBe(true);
      expect(detail.problem.constraints.length).toBeGreaterThan(0);

      // Data section
      expect(detail.data).toBeDefined();
      expect(Array.isArray(detail.data.sources)).toBe(true);
      expect(detail.data.sources.length).toBeGreaterThan(0);
      expect(Array.isArray(detail.data.challenges)).toBe(true);
      expect(detail.data.challenges.length).toBeGreaterThan(0);

      // Architecture
      expect(detail.architecture).toBeDefined();
      expect(Array.isArray(detail.architecture.nodes)).toBe(true);
      expect(detail.architecture.nodes.length).toBeGreaterThan(2);

      const nodeIds = new Set(detail.architecture.nodes.map((n) => n.id));
      for (const node of detail.architecture.nodes) {
        expect(node.id).toBeDefined();
        expect(node.label).toBeDefined();
        expect(validNodeKinds).toContain(node.kind);
      }

      for (const edge of detail.architecture.edges) {
        expect(nodeIds.has(edge.from)).toBe(true);
        expect(nodeIds.has(edge.to)).toBe(true);
      }

      // Tradeoffs
      expect(Array.isArray(detail.tradeoffs)).toBe(true);
      expect(detail.tradeoffs.length).toBeGreaterThan(0);
      for (const t of detail.tradeoffs) {
        expect(t.decision).toBeDefined();
        expect(t.chosen).toBeDefined();
        expect(t.why).toBeDefined();
      }

      // Metrics
      expect(Array.isArray(detail.metrics)).toBe(true);
      expect(detail.metrics.length).toBeGreaterThan(0);
      for (const m of detail.metrics) {
        expect(m.name).toBeDefined();
        expect(m.value).toBeDefined();
      }

      // Impact & Limitations
      expect(Array.isArray(detail.impact)).toBe(true);
      expect(detail.impact.length).toBeGreaterThan(0);
      expect(Array.isArray(detail.limitations)).toBe(true);
      expect(detail.limitations.length).toBeGreaterThan(0);

      // Demo
      expect(detail.demo).toBeDefined();
      expect(validDemoTypes).toContain(detail.demo.type);

      // Artifacts
      expect(Array.isArray(detail.artifacts)).toBe(true);
      expect(detail.artifacts.length).toBeGreaterThan(0);
      for (const artifact of detail.artifacts) {
        expect(isValidHttpUrl(artifact.url)).toBe(true);
      }
    }
  });
});

