import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { isValidHttpUrl } from "./url.js";
import { Icon } from "./icons.jsx";
import profilePhoto from "./profile.jpg";
import { Reveal } from "./useScrollReveal.js";
import { projectsData, ProjectCard } from "./project.jsx";
import { DeskWorkstation } from "./desk/DeskWorkstation.jsx";

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
 * @property {string} [icon]       Icon key resolved by <Icon> (see icons.jsx).
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
    icon: "brain",
  },
  {
    title: "Data Engineering & Pipelines",
    description:
      "I build the plumbing: ingesting, cleaning, and joining multi-source data into reproducible, leak-free pipelines with Pandas, feature stores, and careful temporal splits.",
    icon: "pipeline",
  },
  {
    title: "EDA & Feature Engineering",
    description:
      "I dig into distributions, correlations, and spatial-temporal structure first, then craft physically meaningful features so the model learns signal instead of noise.",
    icon: "chart",
  },
  {
    title: "Evaluation & Reproducibility",
    description:
      "I obsess over trustworthy metrics — rolling-origin CV, OOF predictions, leakage checks, and seeded runs — so results survive contact with new data.",
    icon: "cycle",
  },
  {
    title: "Deployment & Serving",
    description:
      "I ship models past the notebook: FastAPI services, Streamlit and React front ends, Redis-backed agents, and AWS, built to hit real latency budgets like sub-25 ms p95.",
    icon: "rocket",
  },
];

/**
 * @typedef {Object} Certification
 * @property {string} title     Certificate / achievement name.
 * @property {string} issuer    Issuing organization or event.
 * @property {string} [date]    Human-readable date (e.g. "Oct 2026").
 * @property {string} [href]    Absolute http(s) verify URL, or a path to the
 *                              certificate file under /public (e.g. "/certificates/eda.pdf").
 * @property {string} [icon]    Icon key resolved by <Icon> (see icons.jsx).
 */

/**
 * Data-science / data-engineering related certifications and competition wins.
 * Each entry with a valid `href` renders a focusable link to view/verify the
 * certificate; entries without one render as plain cards. An empty array omits
 * the whole section.
 *
 * NOTE: Fill in the exact issuer/date for the data-course certs — these were
 * added from the files in src/assets/Sertifikat and some details still need to
 * be confirmed (marked "TODO").
 * @type {Certification[]}
 */
export const certifications = [
  {
    title: "Pelatihan Data Science",
    issuer: "Divisi Workshop KMTETI FT UGM",
    date: "Nov 2025",
    href: "/certificates/pelatihan-data-science.pdf",
    icon: "brain",
  },
  {
    title: "Cleaning Data in Python",
    issuer: "DataCamp",
    date: "Sep 2026",
    href: "/certificates/cleaning-data-python.pdf",
    icon: "clean",
  },
  {
    title: "Exploratory Data Analysis in Python",
    issuer: "DataCamp",
    date: "Sep 2026",
    href: "/certificates/eda.pdf",
    icon: "chart",
  },
  {
    title: "Dimensionality Reduction in Python",
    issuer: "DataCamp",
    date: "Sep 2026",
    href: "/certificates/dimensionality-reduction.pdf",
    icon: "reduce",
  },
  {
    title: "1st Runner Up — Final Project Bootcamp TETI AI",
    issuer: "Divisi Workshop KMTETI FT UGM",
    date: "Jul 2025",
    href: "/certificates/juara-2-ai.pdf",
    icon: "trophy",
  },
  {
    title: "1st Runner Up — Final Project Bootcamp TETI Mobile Dev",
    issuer: "Divisi Workshop KMTETI FT UGM",
    date: "Jul 2026",
    href: "/certificates/juara-2-mobdev.pdf",
    icon: "trophy",
  },
  {
    title: "AWS Academy Graduate — Cloud Web Application Builder",
    issuer: "AWS Academy (Credly)",
    date: "Oct 2026",
    href: "https://www.credly.com/go/mA2izAyL",
    icon: "cloud",
  },
];

/**
 * First-person About narrative for the story section (>= 30 words, warm
 * first-person voice). Rendered under a distinct heading (Req 3.1-3.2).
 * @type {string}
 */
export const aboutNarrative =
  "Hi, I'm Bagas — a data enthusiast who loves turning raw, messy data into models and pipelines people can actually trust. I split my time between data science (training ensembles and deep learning models, chasing honest metrics) and data engineering (ingesting, cleaning, and joining multi-source datasets into reproducible pipelines). I care deeply about EDA, leak-free validation, and reproducibility, and I get a real kick out of that moment when a stubborn dataset finally tells its story. When I'm not training models, I'm competing in data challenges and digging into new domains to learn.";


/** Tools that show up across the projects, for the scrolling tool strip. */
const toolbelt = [
  "Python", "PyTorch", "LightGBM", "XGBoost", "CatBoost", "scikit-learn",
  "Pandas", "GeoPandas", "Optuna", "SigLIP", "FAISS", "LangGraph",
  "pgvector", "FastAPI", "Streamlit", "SHAP",
];

/**
 * Section heading row shared by the Home sections: a mono index + label, a
 * large h2, and an optional aside on the right. Left-aligned on a 12-column
 * grid so sections read like chapters of one notebook.
 */
const SectionHeader = ({ index, label, title, children }) => (
  <Reveal className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end">
    <div className="md:col-span-7">
      <p className="font-mono text-sm text-muted">
        <span className="text-signal">{index}</span> / {label}
      </p>
      <h2 className="mt-4 text-4xl font-extrabold leading-[0.95] tracking-[-0.03em] text-ink sm:text-5xl md:text-6xl">
        {title}
      </h2>
    </div>
    {children && (
      <div className="text-lg leading-relaxed text-ink-soft md:col-span-5">{children}</div>
    )}
  </Reveal>
);

/**
 * Presentational "What I Do" section. Renders exactly one skill block per
 * item, in the same order as the `skills` prop, each titled by an <h3>.
 * Returns null (omitting the section) when there are no skills (Req 2.4).
 *
 * @param {{ skills?: Skill[] }} props
 */
export const SkillsSection = ({ skills: items = [] }) => {
  if (items.length === 0) return null;

  return (
    <section
      id="skills"
      className="scroll-mt-20 border-b border-ink bg-paper-2 px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index="01"
          label="Skills"
          title={
            <>
              What I <span className="font-serif font-normal italic">do</span>
            </>
          }
        >
          Most of my work sits where modeling meets plumbing: get the data
          right first, then make the model earn its metrics.
        </SectionHeader>

        <ol className="grid gap-px border border-ink bg-ink md:grid-cols-2">
          {items.map((skill, index) => (
            <li
              key={index}
              // An odd final item spans both columns so the grid never ends
              // with an empty half-row.
              className="group bg-paper-2 p-7 transition-colors duration-300 hover:bg-marker md:p-10 md:last:odd:col-span-2"
            >
              <Reveal delayMs={(index % 2) * 120}>
                <div className="flex items-center justify-between">
                  <span aria-hidden="true" className="font-mono text-sm text-muted group-hover:text-ink">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-ink transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transform-none"
                  >
                    <Icon name={skill.icon} className="h-7 w-7" />
                  </span>
                </div>
                <h3 className="mt-10 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                  {skill.title}
                </h3>
                <p className="mt-3 max-w-prose leading-relaxed text-ink-soft group-hover:text-ink">
                  {skill.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

/**
 * Presentational "Featured Works" preview section on Home.
 * Showcases top 3 flagship projects with link-out to /project.
 */
export const FeaturedWorksSection = () => {
  const topProjects = projectsData.slice(0, 3);

  return (
    <section
      id="featured-works"
      className="scroll-mt-20 border-b border-ink bg-paper px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index="02"
          label="Works"
          title={
            <>
              Featured <span className="font-serif font-normal italic">Works</span>
            </>
          }
        >
          A selection of production-grade ML models and data pipelines I've built.
          Each project is designed for real-world reliability.
        </SectionHeader>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {topProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              number={idx + 1}
              title={project.title}
              description={project.description}
              image={project.image}
              tech={project.tech}
              demoUrl={project.demoUrl}
              repoUrl={project.repoUrl}
              metric={project.metric}
              revealDelayMs={idx * 120}
            />
          ))}
        </div>

        <Reveal delayMs={150} className="mt-12 flex justify-center">
          <Link
            to="/project"
            className="focus-ring group inline-flex min-h-[48px] items-center justify-center gap-3 rounded-xl border-2 border-ink bg-ink px-8 py-3.5 text-base font-semibold text-paper shadow-[5px_5px_0_0_#d93f12] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#d93f12] active:translate-x-1 active:translate-y-1 active:shadow-none motion-reduce:transform-none sm:text-lg"
          >
            Explore All {projectsData.length} Projects
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

/**
 * Presentational "Certifications" section, rendered as a ledger. A row whose
 * `href` is a valid absolute http(s) URL OR a site-relative path (starting
 * with "/") becomes a focusable link that opens the certificate in a new tab;
 * otherwise it renders as a static row. Returns null when there are none.
 *
 * @param {{ certifications?: Certification[] }} props
 */
export const CertificationsSection = ({ certifications: items = [] }) => {
  if (items.length === 0) return null;

  // A usable link is either an absolute http(s) URL or a site-relative path.
  const linkFor = (href) =>
    typeof href === "string" && (isValidHttpUrl(href) || href.startsWith("/"))
      ? href
      : null;

  const isExternal = (href) => isValidHttpUrl(href);

  const rowClass =
    "group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-4 px-2 py-5 transition-colors duration-200 md:grid-cols-[4rem_minmax(0,1fr)_auto] md:px-4 md:py-6";

  return (
    <section
      id="credentials"
      className="scroll-mt-20 border-b border-ink px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index="03"
          label="Credentials"
          title={
            <>
              Certifications <span className="font-serif font-normal italic">&amp;</span> Awards
            </>
          }
        >
          Courses I finished and competitions I placed in. Every row opens the
          actual certificate.
        </SectionHeader>

        <ul className="border-t-2 border-ink">
          {items.map((cert, index) => {
            const href = linkFor(cert.href);
            const inner = (
              <>
                <span aria-hidden="true" className="font-mono text-sm text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-ink transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transform-none md:text-2xl">
                    {cert.title}
                  </h3>
                  {(cert.issuer || cert.date) && (
                    <p className="mt-1 font-mono text-xs text-muted md:text-sm">
                      {cert.issuer}
                      {cert.issuer && cert.date && " · "}
                      {cert.date}
                    </p>
                  )}
                </div>
                {href && (
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-paper md:h-12 md:w-12"
                  >
                    ↗
                  </span>
                )}
              </>
            );

            return (
              <li key={index} className="border-b border-ink/20">
                <Reveal delayMs={(index % 4) * 80}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel={isExternal(href) ? "noopener noreferrer" : "noopener"}
                      aria-label={`View certificate: ${cert.title}${
                        cert.issuer ? `, ${cert.issuer}` : ""
                      } (opens in a new tab)`}
                      className={`focus-ring ${rowClass} hover:bg-card`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={rowClass}>{inner}</div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export const Core = () => {
  // Hero image fallback: swap to a decorative same-size placeholder on error.
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    if (!siteConfig.contactEmail) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(siteConfig.contactEmail);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  // Only surface a contact CTA when a usable email string is configured (Req 4.5).
  const hasContactEmail =
    typeof siteConfig.contactEmail === "string" &&
    siteConfig.contactEmail.trim() !== "";

  // Keep only socials whose href is a valid absolute http(s) URL (Req 4.3-4.4).
  const validSocials = siteConfig.socials.filter((s) => isValidHttpUrl(s.href));

  // Lead sentence of the narrative gets display treatment; the rest is body.
  const breakAt = aboutNarrative.indexOf(". ");
  const aboutLead = breakAt === -1 ? aboutNarrative : aboutNarrative.slice(0, breakAt + 1);
  const aboutRest = breakAt === -1 ? "" : aboutNarrative.slice(breakAt + 2);

  const aboutFacts = [
    { label: "Focus", value: "ML models + the pipelines behind them" },
    { label: "Toolkit", value: "Python, PyTorch, gradient boosting, RAG" },
    { label: "Credentials", value: `${certifications.length} certificates & awards` },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[linear-gradient(180deg,#cfe1ed_0%,#e2edf5_50%,#f3efe6_100%)] text-ink">
      {/* ---------------- Full-Screen Interactive 3D Bedroom & Study Desk */}
      <DeskWorkstation
        siteConfig={siteConfig}
        skills={skills}
        certifications={certifications}
        aboutNarrative={aboutNarrative}
        aboutFacts={aboutFacts}
        toolbelt={toolbelt}
        profilePhoto={profilePhoto}
        projects={projectsData}
      />

      {/* Screen-Reader & Semantic Fallback Sections (Visually Consolidated into the 3D Room) */}
      <div className="sr-only">
        <section>
          <p>Data Scientist &amp; Data Engineer</p>
          <h1 className="motion-reduce:animate-none">
            Hi, I'm{" "}
            <span className="animated-gradient-text">Bagas</span>
            <span>.</span>
          </h1>
          <p>
            Selamat datang di kamar &amp; meja kerja saya! I build data
            science models and the engineering pipelines that feed them —
            klik langsung Monitor, Trophy, Buku, HP, atau Foto di meja untuk
            menjelajahi portofolio saya.
          </p>
          <div>
            <Link to="/project" className="focus-ring">
              View My Work
            </Link>
            <a href="#contact" className="focus-ring">
              Get in Touch
            </a>
          </div>
        </section>

      {/* ------------------------------------------------- Tool marquee */}
      <div className="overflow-hidden border-b border-ink bg-ink py-4 text-paper">
        <ul
          aria-label="Tools I work with"
          className="flex w-max animate-marquee items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2 motion-reduce:px-6"
        >
          {[...toolbelt, ...toolbelt].map((tool, i) => (
            <li
              key={`${tool}-${i}`}
              aria-hidden={i >= toolbelt.length ? "true" : undefined}
              className={`flex items-center whitespace-nowrap text-xl font-semibold tracking-tight md:text-2xl ${
                i >= toolbelt.length ? "motion-reduce:hidden" : ""
              }`}
            >
              <span className="px-5">{tool}</span>
              <span aria-hidden="true" className="text-signal">✦</span>
            </li>
          ))}
        </ul>
      </div>

      {/* "What I Do" Section — omitted entirely when there are no skills. */}
      <SkillsSection skills={skills} />

      {/* "Featured Works" preview section */}
      <FeaturedWorksSection />

      {/* Certifications & Awards — omitted entirely when there are none. */}
      <CertificationsSection certifications={certifications} />

      {/* -------------------------------------------------------- About */}
      <section
        id="about"
        className="paper-dots scroll-mt-20 border-b border-ink px-6 py-20 md:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="font-mono text-sm text-muted">
              <span className="text-signal">04</span> / About
            </p>
            <h2 className="mt-4 text-4xl font-extrabold leading-[0.95] tracking-[-0.03em] text-ink sm:text-5xl md:text-6xl">
              About <span className="font-serif font-normal italic">me</span>
            </h2>

            <figure className="relative mt-8 max-w-[15rem] rotate-[2deg] border border-ink/15 bg-card p-2.5 pb-8 shadow-[0_18px_40px_-18px_rgba(23,21,15,0.4)] transition-transform duration-500 hover:rotate-0 motion-reduce:rotate-0 motion-reduce:transition-none">
              <div aria-hidden="true" className="tape absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3"></div>
              {imgError ? (
                <div
                  aria-hidden="true"
                  className="flex aspect-[4/5] w-full items-center justify-center bg-paper-2"
                >
                  <svg
                    className="h-14 w-14 text-muted"
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
                  className="aspect-[4/5] w-full object-cover object-[center_30%]"
                />
              )}
            </figure>

            <dl className="mt-8 space-y-5 border-t border-ink pt-6">
              {aboutFacts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-xs uppercase tracking-wider text-muted">{fact.label}</dt>
                  <dd className="mt-1 font-medium text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delayMs={150} className="md:col-span-8">
            <p className="text-3xl font-semibold leading-[1.15] tracking-tight text-ink md:text-[2.75rem]">
              <span className="marker marker-sweep">{aboutLead}</span>
            </p>
            {aboutRest && (
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
                {aboutRest}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------ Contact */}
      <section id="contact" className="scroll-mt-20 bg-ink px-6 py-24 text-paper md:py-32">
        <Reveal className="mx-auto max-w-7xl">
          <p className="font-mono text-sm text-paper/60">
            <span className="text-signal">05</span> / Contact
          </p>
          <h2 className="mt-5 text-5xl font-extrabold leading-[0.9] tracking-[-0.04em] sm:text-7xl lg:text-[7rem]">
            Let's build
            <br />{" "}
            <span className="font-serif font-normal italic text-marker">something</span>.
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/70 md:text-xl">
            Got a project in mind or just want to say hi? I'd love to hear from
            you.
          </p>

          <div className="mt-12 flex flex-col gap-10 border-t border-paper/15 pt-10 lg:flex-row lg:items-end lg:justify-between">
            {hasContactEmail && (
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="focus-ring group inline-block rounded-lg"
                >
                  <span className="block font-mono text-sm text-paper/60">Email me at</span>
                  <span className="mt-2 inline-flex flex-wrap items-baseline gap-x-3 break-all text-2xl font-semibold tracking-tight text-paper underline decoration-signal decoration-2 underline-offset-8 transition-colors duration-200 group-hover:text-marker sm:text-4xl">
                    {siteConfig.contactEmail}
                    <span aria-hidden="true" className="text-signal transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">→</span>
                  </span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={copied ? "Email address copied to clipboard" : "Copy email address"}
                  className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-full border border-paper/30 px-4 py-2 font-mono text-xs font-semibold text-paper transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-ink sm:mt-6 sm:text-sm"
                >
                  <span aria-hidden="true">{copied ? "✓" : "📋"}</span>
                  <span>{copied ? "Copied!" : "Copy email"}</span>
                </button>
              </div>
            )}

            {validSocials.length > 0 && (
              <ul className="flex gap-3">
                {validSocials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in a new tab)`}
                      className="focus-ring inline-flex min-h-[48px] items-center gap-2 rounded-full border border-paper/30 px-5 font-semibold text-paper transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-ink"
                    >
                      {social.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </section>
      </div>
    </div>
  );
};
export default Core;
