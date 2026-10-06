import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { isValidHttpUrl } from "./url.js";

/**
 * @typedef {Object} SocialLink
 * @property {string} label  Accessible name / visible label (e.g. "GitHub").
 * @property {string} href   Absolute http(s) URL to the profile.
 */

/**
 * @typedef {Object} SiteConfig
 * @property {string|null} contactEmail  Email for the contact CTA, or null/"" to omit it.
 * @property {SocialLink[]} socials      Configured social links (may be empty).
 */

/**
 * @typedef {Object} Skill
 * @property {string} title        Skill name, <= 40 chars.
 * @property {string} description  Short blurb, <= 200 chars.
 * @property {string} [icon]       Decorative glyph; rendered aria-hidden.
 */

/**
 * Home contact + social configuration. A null/empty `contactEmail` omits the
 * contact CTA (Req 4.5); each valid `socials` entry renders a focusable,
 * accessibly-named external link (Req 4.3-4.4).
 * @type {SiteConfig}
 */
export const siteConfig = {
  contactEmail: "hello@bagas.dev",
  socials: [
    { label: "GitHub", href: "https://github.com/bagas" },
    { label: "LinkedIn", href: "https://linkedin.com/in/bagas" },
    { label: "Twitter", href: "https://twitter.com/bagas" },
  ],
};

/**
 * "What I Do" skill items (3-12 items; title <= 40 chars, description <= 200
 * chars; icons are decorative). An empty array omits the section (Req 2.4).
 * @type {Skill[]}
 */
export const skills = [
  {
    title: "Web Development",
    description:
      "I build fast, scalable web apps with React, Next.js, and modern JavaScript — clean code that holds up as it grows.",
    icon: "</>",
  },
  {
    title: "UI/UX Design",
    description:
      "I craft intuitive, accessible, pixel-perfect interfaces with Tailwind CSS and Figma, so things feel as good as they look.",
    icon: "🎨",
  },
  {
    title: "Performance Optimization",
    description:
      "I obsess over fast load times and buttery-smooth animations to keep every interaction feeling instant and delightful.",
    icon: "🚀",
  },
  {
    title: "Playful Motion",
    description:
      "I sprinkle in tasteful micro-interactions and animated flourishes that guide attention without ever getting in the way.",
    icon: "✨",
  },
];

/**
 * First-person About narrative for the story section (>= 30 words, warm
 * first-person voice). Rendered under a distinct heading (Req 3.1-3.2).
 * @type {string}
 */
export const aboutNarrative =
  "Hi, I'm Bagas — a frontend developer who genuinely loves turning fuzzy ideas into interfaces people enjoy using. I care about clean code, thoughtful motion, and accessibility, and I get a real kick out of that moment when a layout finally clicks. When I'm not shipping, I'm tinkering with side projects and chasing new things to learn.";

/**
 * Presentational "What I Do" section. Renders exactly one skill card per item,
 * in the same order as the `skills` prop. Returns null (omitting the entire
 * section) when there are no skills (Req 2.4), so the section is never rendered
 * empty. Each skill card exposes its title as an <h3> heading so cards are
 * individually locatable and orderable.
 *
 * @param {{ skills?: Skill[] }} props
 */
export const SkillsSection = ({ skills: items = [] }) => {
  if (items.length === 0) return null;

  return (
    <section className="relative z-10 bg-white/60 backdrop-blur-md py-20 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto text-center space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          What I Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((skill, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2"
            >
              <div
                aria-hidden="true"
                className="w-14 h-14 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl font-bold mb-6 mx-auto transition-transform duration-300 hover:rotate-12"
              >
                {skill.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {skill.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Core = () => {
  // Hero image fallback: swap to a decorative same-size placeholder on error.
  const [imgError, setImgError] = useState(false);

  // Only surface a contact CTA when a usable email string is configured (Req 4.5).
  const hasContactEmail =
    typeof siteConfig.contactEmail === "string" &&
    siteConfig.contactEmail.trim() !== "";

  // Keep only socials whose href is a valid absolute http(s) URL (Req 4.3-4.4).
  const validSocials = siteConfig.socials.filter((s) => isValidHttpUrl(s.href));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative overflow-hidden bg-grid-pattern">
      {/* Background animated blobs — decorative, transform-only motion. */}
      <div
        aria-hidden="true"
        className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob motion-reduce:animate-none"
      ></div>
      <div
        aria-hidden="true"
        className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob motion-reduce:animate-none animation-delay-2000"
      ></div>
      <div
        aria-hidden="true"
        className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob motion-reduce:animate-none animation-delay-4000"
      ></div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col md:flex-row items-center justify-center px-6 py-20 md:py-32 max-w-7xl mx-auto w-full gap-12">
        <div className="flex-1 text-center md:text-left space-y-6">
          <p className="text-xl md:text-2xl font-semibold text-blue-600 tracking-wide uppercase">
            Frontend Developer
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
            Hi, I'm{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Bagas
            </span>
            .
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            I craft responsive, modern, and user-friendly web experiences. I
            love writing clean code and untangling tricky problems to ship
            digital products that feel great to use.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link
              to="/project"
              className="focus-ring px-8 py-4 min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              View My Work
            </Link>
            <a
              href="#contact"
              className="focus-ring px-8 py-4 min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Decorative / Image Section */}
        <div className="flex-1 flex justify-center relative w-full max-w-md">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-50 animate-blob motion-reduce:animate-none"
          ></div>
          {imgError ? (
            // Same-size decorative placeholder when the hero image fails to load.
            <div
              aria-hidden="true"
              className="rounded-3xl shadow-2xl relative z-10 w-full h-[400px] ring-4 ring-white/50 bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"
            >
              <svg
                className="w-20 h-20 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
          ) : (
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Bagas's workspace: a tidy desk with a laptop showing code"
              onError={() => setImgError(true)}
              className="rounded-3xl shadow-2xl relative z-10 w-full h-[400px] object-cover ring-4 ring-white/50 backdrop-blur-sm transition-transform duration-500 hover:scale-105"
            />
          )}
        </div>
      </section>

      {/* "What I Do" Section — omitted entirely when there are no skills. */}
      <SkillsSection skills={skills} />

      {/* About Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center md:text-left">
            About Me
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
            {aboutNarrative}
          </p>
        </div>
      </section>

      {/* Contact & Social Section */}
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
                href={`mailto:${siteConfig.contactEmail}`}
                className="focus-ring inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Email me at {siteConfig.contactEmail}
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
    </div>
  );
};
export default Core;
