/**
 * URL validation helpers for link-out CTAs and social links.
 *
 * Used by both `project.jsx` (Project_Card link-outs) and `core.jsx`
 * (contact/social links) to decide whether a configured URL should surface
 * an interactive element. Kept as a standalone, side-effect-free module so it
 * is trivially importable and unit/property testable.
 */

/**
 * Returns true only when `value` is a non-empty string that parses as an
 * absolute URL whose protocol is `http:` or `https:`. Returns false for
 * non-strings, empty/whitespace-only strings, non-absolute URLs, and any
 * other protocol.
 *
 * @param {unknown} value - The candidate URL to validate.
 * @returns {boolean} True for a valid absolute http(s) URL, false otherwise.
 */
export const isValidHttpUrl = (value) => {
  if (typeof value !== "string" || value.trim() === "") return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};
