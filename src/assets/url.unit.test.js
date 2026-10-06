import { describe, it, expect } from "vitest";
import { isValidHttpUrl } from "./url.js";

// Unit examples for `isValidHttpUrl`.
// _Requirements: 7.6_
describe("isValidHttpUrl — unit examples", () => {
  it('returns false for an empty string ""', () => {
    expect(isValidHttpUrl("")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isValidHttpUrl(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isValidHttpUrl(undefined)).toBe(false);
  });

  it('returns false for a non-URL string "not a url"', () => {
    expect(isValidHttpUrl("not a url")).toBe(false);
  });

  it('returns false for a non-http(s) protocol "ftp://x"', () => {
    expect(isValidHttpUrl("ftp://x")).toBe(false);
  });

  it('returns false for a protocol-relative URL "//x"', () => {
    expect(isValidHttpUrl("//x")).toBe(false);
  });

  it('returns true for an absolute http URL "http://x"', () => {
    expect(isValidHttpUrl("http://x")).toBe(true);
  });

  it('returns true for an absolute https URL "https://x"', () => {
    expect(isValidHttpUrl("https://x")).toBe(true);
  });
});
