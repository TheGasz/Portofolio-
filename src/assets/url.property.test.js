import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { isValidHttpUrl } from "./url.js";

// Feature: portfolio-redesign, Property 5: Link-out CTAs appear exactly for valid absolute URLs
//
// Helper-level formulation (Validates: Requirements 7.1, 7.2, 7.6):
//   - Valid absolute http(s) URLs are accepted (isValidHttpUrl === true).
//   - Empty strings, non-absolute/invalid strings, and non-string values
//     are rejected (isValidHttpUrl === false).
describe("isValidHttpUrl property", () => {
  it("accepts any valid absolute http(s) URL", () => {
    fc.assert(
      fc.property(fc.webUrl(), (url) => {
        // fc.webUrl() generates absolute http/https URLs.
        expect(isValidHttpUrl(url)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it("rejects empty strings, non-absolute/invalid strings, and non-string values", () => {
    const invalidString = fc.oneof(
      // Empty / whitespace-only strings.
      fc.constantFrom("", "   ", "\t", "\n"),
      // Non-absolute or wrong-protocol strings.
      fc.constantFrom(
        "not a url",
        "example.com",
        "//example.com",
        "/relative/path",
        "ftp://example.com",
        "mailto:someone@example.com",
        "javascript:alert(1)",
        "file:///etc/hosts"
      ),
      // Arbitrary free-form strings (overwhelmingly not valid absolute http(s) URLs).
      fc.string()
    );

    const nonString = fc.oneof(
      fc.integer(),
      fc.double(),
      fc.boolean(),
      fc.constant(null),
      fc.constant(undefined),
      fc.object(),
      fc.array(fc.anything())
    );

    fc.assert(
      fc.property(fc.oneof(invalidString, nonString), (value) => {
        // These values must never be treated as valid absolute http(s) URLs.
        // Guard against the rare case where fc.string() happens to produce a
        // genuinely valid absolute http(s) URL (e.g. "http://a").
        fc.pre(!(typeof value === "string" && isAbsoluteHttpLike(value)));
        expect(isValidHttpUrl(value)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});

// Mirror of the helper's acceptance condition, used only to filter out
// coincidentally-valid generated strings from the "reject" case.
function isAbsoluteHttpLike(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
