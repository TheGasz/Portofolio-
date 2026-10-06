import React from "react";
import "../index.css";
import { isValidHttpUrl } from "./url.js";

/**
 * @typedef {Object} SocialLink
 * @property {string} label  Accessible name / visible label (e.g. "GitHub").
 * @property {string} href   Absolute http(s) URL to the profile.
 */

/**
 * Presentational Contact & social section.
 *
 * Extracted as a prop-injectable component so the "configured social links"
 * behavior can be exercised across arbitrary inputs (Property 9). It mirrors
 * the markup rendered inline by `Core`:
 *   - A `#contact` landmark section.
 *   - A `mailto:` contact CTA in the same browsing context, rendered only when
 *     `contactEmail` is a non-empty string (Req 4.2, 4.5).
 *   - One external social link per valid entry (filtered by `isValidHttpUrl`),
 *     each `target="_blank" rel="noopener noreferrer"` with an accessible name
 *     derived from the entry's `label` (Req 4.3, 4.4).
 *
 * @param {Object} props
 * @param {string|null} [props.contactEmail]  Email for the contact CTA, or null/"" to omit it.
 * @param {SocialLink[]} [props.socials]       Configured social links (may be empty).
 */
export const ContactSection = ({ contactEmail = null, socials = [] }) => {
  // Only surface a contact CTA when a usable email string is configured (Req 4.5).
  const hasContactEmail =
    typeof contactEmail === "string" && contactEmail.trim() !== "";

  // Keep only socials whose href is a valid absolute http(s) URL (Req 4.3-4.4).
  const validSocials = (socials || []).filter((s) => isValidHttpUrl(s.href));

  return (
    <section
      id="contact"
      className="relative z-10 bg-white/60 backdrop-blur-md py-20 px-6 border-t border-gray-100"
    >
      <div className="max-w-7xl mx-auto text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Let's Build Something
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Got a project in mind or just want to say hi? I'd love to hear from
          you.
        </p>

        {hasContactEmail && (
          <div className="flex justify-center">
            <a
              href={`mailto:${contactEmail}`}
              className="focus-ring inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Email me at {contactEmail}
            </a>
          </div>
        )}

        {validSocials.length > 0 && (
          <ul className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {validSocials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} (opens in a new tab)`}
                  className="focus-ring inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 text-gray-800 font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
