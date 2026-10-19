import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { isValidHttpUrl } from "./url.js";
import profilePhoto from "./profile.jpg";

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
  contactEmail: "bagasadjie2006@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/TheGasz" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/bagas-adjie-pamungkas-5401a3336/" },
  ],
};

/**
 * "What I Do" skill items (3-12 items; title <= 40 chars, description <= 200
 * chars; icons are decorative). An empty array omits the section (Req 2.4).
 * @type {Skill[]}
 */
export const skills = [
  {
    title: "Data Science & ML",
    description:
      "I turn messy datasets into models that actually decide something — ensembles, deep learning, and honest cross-validation, tuned with Optuna until the metrics hold up.",
    icon: "🧠",
  },
  {
    title: "Data Engineering & Pipelines",
    description:
      "I build the plumbing: ingesting, cleaning, and joining multi-source data into reproducible, leak-free pipelines with Pandas, feature stores, and careful temporal splits.",
    icon: "🛠️",
  },
  {
    title: "EDA & Feature Engineering",
    description:
      "I dig into distributions, correlations, and spatial-temporal structure first, then craft physically meaningful features so the model learns signal instead of noise.",
    icon: "📊",
  },
  {
    title: "Evaluation & Reproducibility",
    description:
      "I obsess over trustworthy metrics — rolling-origin CV, OOF predictions, leakage checks, and seeded runs — so results survive contact with new data.",
    icon: "🔁",
  },
];

/**
 * First-person About narrative for the story section (>= 30 words, warm
 * first-person voice). Rendered under a distinct heading (Req 3.1-3.2).
 * @type {string}
 */
export const aboutNarrative =
  "Hi, I'm Bagas — a data enthusiast who loves turning raw, messy data into models and pipelines people can actually trust. I split my time between data science (training ensembles and deep learning models, chasing honest metrics) and data engineering (ingesting, cleaning, and joining multi-source datasets into reproducible pipelines). I care deeply about EDA, leak-free validation, and reproducibility, and I get a real kick out of that moment when a stubborn dataset finally tells its story. When I'm not training models, I'm competing in data challenges and digging into new domains to learn.";

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
    <section className="relative z-10 py-24 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto text-center space-y-14">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-300/70">
            Skills
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-50">
            What I Do
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((skill, index) => (
            <div
              key={index}
              className="glass gradient-border group relative p-7 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <div
                aria-hidden="true"
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto bg-gradient-to-br from-sky-500/20 to-teal-500/20 text-slate-100 ring-1 ring-white/10 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
              >
                {skill.icon}
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-50">
                {skill.title}
              </h3>
              <p className="text-sm text-slate-300/90 leading-relaxed">
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
    <div className="aurora-bg flex flex-col min-h-screen relative overflow-hidden bg-grid-pattern text-slate-200">
      {/* Background animated blobs — decorative, transform-only motion. */}
      {/* Muted, low-opacity tones so the backdrop feels calm and warm. */}
      <div
        aria-hidden="true"
        className="absolute top-10 -left-10 w-80 h-80 bg-slate-500 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob motion-reduce:animate-none"
      ></div>
      <div
        aria-hidden="true"
        className="absolute top-0 -right-10 w-80 h-80 bg-teal-700 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob motion-reduce:animate-none animation-delay-2000"
      ></div>
      <div
        aria-hidden="true"
        className="absolute -bottom-10 left-1/3 w-80 h-80 bg-amber-700 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob motion-reduce:animate-none animation-delay-4000"
      ></div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col md:flex-row items-center justify-center px-6 py-20 md:py-32 max-w-7xl mx-auto w-full gap-12">
        <div className="flex-1 text-center md:text-left space-y-6">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal-300/80 tracking-[0.25em] uppercase animate-fade-in-up motion-reduce:animate-none">
            <span aria-hidden="true" className="inline-block w-8 h-px bg-gradient-to-r from-teal-400/70 to-transparent"></span>
            Data Scientist &amp; Data Engineer
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-50 leading-tight animate-fade-in-up animation-delay-200 motion-reduce:animate-none">
            Hi, I'm{" "}
            <span className="animated-gradient-text text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-teal-300 to-amber-200">
              Bagas
            </span>
            .
          </h1>
          <p className="text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto md:mx-0 leading-relaxed animate-fade-in-up animation-delay-400 motion-reduce:animate-none">
            I build data science models and the engineering pipelines that
            feed them. I love wrangling messy, multi-source data and untangling
            tricky problems to ship insights and predictions you can trust.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 animate-fade-in-up animation-delay-600 motion-reduce:animate-none">
            <Link
              to="/project"
              className="focus-ring group relative px-8 py-4 min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-sky-700 to-teal-600 text-white font-semibold rounded-full shadow-lg shadow-black/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-[length:200%_auto] hover:bg-[position:right_center]"
            >
              View My Work
              <span aria-hidden="true" className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#contact"
              className="focus-ring px-8 py-4 min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center glass border border-white/15 hover:border-teal-300/40 text-slate-100 font-semibold rounded-full transition-all duration-300 hover:-translate-y-1"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Decorative / Image Section */}
        <div className="flex-1 flex justify-center relative w-full max-w-md">
          <div
            aria-hidden="true"
            className="glow-halo absolute inset-0 bg-gradient-to-tr from-sky-700 via-teal-600 to-amber-500 rounded-full blur-3xl opacity-25 motion-reduce:animate-none"
          ></div>
          <div className="animate-float motion-reduce:animate-none relative z-10 w-full max-w-sm mx-auto gradient-border rounded-full p-1.5">
          {imgError ? (
            // Same-size decorative placeholder when the hero image fails to load.
            <div
              aria-hidden="true"
              className="rounded-full shadow-2xl w-full aspect-square ring-1 ring-white/10 bg-gradient-to-br from-sky-700 via-teal-600 to-amber-600 flex items-center justify-center"
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
              src={profilePhoto}
              alt="Bagas Adjie Pamungkas smiling, wearing a black shirt"
              onError={() => setImgError(true)}
              className="rounded-full shadow-2xl w-full aspect-square object-cover object-[center_30%] ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.03]"
            />
          )}
          </div>
        </div>
      </section>

      {/* "What I Do" Section — omitted entirely when there are no skills. */}
      <SkillsSection skills={skills} />

      {/* About Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto glass gradient-border rounded-3xl p-10 md:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-200/70 mb-4 text-center md:text-left">
            About
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-6 text-center md:text-left">
            About Me
          </h2>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto md:mx-0">
            {aboutNarrative}
          </p>
        </div>
      </section>

      {/* Contact & Social Section */}
      <section
        id="contact"
        className="relative z-10 py-24 px-6 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-50">
            Let's Build{" "}
            <span className="animated-gradient-text text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-teal-300 to-amber-200">
              Something
            </span>
          </h2>
          <p className="text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
            Got a project in mind or just want to say hi? I'd love to hear from
            you.
          </p>

          {hasContactEmail && (
            <div className="flex justify-center">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="focus-ring inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[44px] bg-gradient-to-r from-sky-700 to-teal-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white font-semibold rounded-full shadow-lg shadow-black/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
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
                    className="focus-ring inline-flex items-center justify-center min-h-[44px] px-6 py-3 glass border border-white/15 hover:border-teal-300/40 text-slate-100 font-semibold rounded-full transition-all duration-300 transform hover:-translate-y-1"
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
