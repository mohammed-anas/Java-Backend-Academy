# Java Backend Academy — PRD

## Original problem statement (v2)
Rebuild from scratch as a purely static SPA (no backend) for **Java Backend Academy** — a training institute in Bengaluru. Subjects: Java, Database, System Design, AWS Cloud, DSA, CI/CD, Interview Preparation, Job Search Guidelines, Resume Building. Must include Google Map location, phone, WhatsApp, timings, courses with durations, and a contact form. Add a `gh-pages` one-command deploy + README. Mobile + desktop responsive.

## Architecture
- **Pure static React SPA** — no client-side routing, no backend calls.
- Contact form → `wa.me/…?text=…` deep-link with the enquiry prefilled (no server needed).
- Deployable to GitHub Pages with `yarn deploy`.
- Stack: React 19 + Tailwind + framer-motion + lenis + sonner + lucide-react.
- Fonts: Playfair Display / Outfit / JetBrains Mono.

## What's implemented (v2 — 14 Dec 2025)
- Kinetic hero: "Backend engineers are made, not born." with masked line reveal + parallax image
- Editorial marquee (Core Java // Spring Boot // Postgres // Mongo // …)
- 8 numbered course chapters with **duration + mode**:
  - 01 Core Java (10w · Live · Weekend)
  - 02 Databases (6w · Live · Weekend)
  - 03 System Design (8w · Live · Weekend)
  - 04 AWS Cloud (6w · Live · Weekend)
  - 05 DSA (12w · Live + Assignments)
  - 06 CI/CD (3w · Workshop)
  - 07 Interview Preparation (8w · Cohort)
  - 08 Job Search & Resume (2w · 1:1 + Workshop)
- About section with mission + editorial image bento
- Location section: Google Maps embed + phone + WhatsApp + hours + address + "Open in Maps" deep link
- Contact form — WhatsApp deep-link submission (no backend, no data stored)
- Dark footer, floating WhatsApp/Call FAB, preloader
- Full mobile responsive; hamburger menu below 1024px
- SEO metadata + Open Graph

## Deployment
- `frontend/package.json` has `"homepage": "."` + `predeploy`/`deploy` scripts using `gh-pages`
- Production build verified — assets use relative paths, works at any GitHub Pages URL
- `/app/README.md` documents:
  - Local dev (`yarn start`)
  - One-command deploy (`yarn deploy`)
  - Personalising `src/site/content.js` (phone/whatsapp/address/map/courses)
  - Optional custom domain via `CNAME`

## Key files
- `frontend/src/site/content.js` — single source of truth for brand + courses (users edit only this)
- `frontend/src/site/Contact.jsx` — form → `buildWhatsAppEnquiry()` → `window.open(wa.me/…)`
- `frontend/src/site/Location.jsx` — map iframe + address/phone/whatsapp/hours
- `frontend/src/App.js` — no router, single-page render
- `README.md` — deploy guide

## Backend
Legacy `/api/leads` endpoint exists in `backend/server.py` from v1 but is **no longer used** by the frontend. It can be ignored for the static Pages deploy.

## v3.1 — Bug fix + Multi-page routing + Course roadmap (Jul 2026)
Follow-up to v3, verified end-to-end by testing_agent (25/25 checks passed).

### Bug fix
- Nav crumb "Home" was rendered as a plain `<span>` — no click, no hover. It's now a real `<button data-testid="crumb-home">` that scrolls to `#top` on the home page and navigates to `/` from `/blog` or `/cheatsheet`.

### Multi-page routing
- Wrapped the app in `HashRouter` (`react-router-dom v7`).
- Routes: `/`, `/blog`, `/blog/:slug`, `/cheatsheet` — perfect for pasting on Google Business Profile posts.
- New pages: `pages/Blog.jsx`, `pages/BlogPost.jsx`, `pages/Cheatsheet.jsx`.
- Section links in Nav/Footer auto-navigate to `/` and then scroll if you're on any other page (`useLenis.scrollToId` handles the cross-page case).
- Deep-link `/#/?s=<section>` scrolls to that section on load — usable from sitemap / GMB.
- `SectionRailIfHome` shows the right-side dot navigator only on `/`.

### New content
- `content.js`: added `TRACKS`, `COMBO_BUNDLES`, `BLOG_POSTS`, `CHEATSHEETS`.
- 3 seed blog posts (roadmap for beginners, Spring Boot first REST API, resume tips).
- 4 cheatsheets (Big-O, everyday SQL, Spring Boot annotations, everyday Git), copy-to-clipboard on hover.
- 3 combo bundles (Job-Ready · Cloud-Native · Campus Placement Fast-Track) with course lists and Enquire CTAs.

### Courses roadmap redesign (`Manifesto.jsx`)
- Simpler headline: **"Your step-by-step roadmap. From your first line of code to your first job offer."** (replaces the industry-jargon "engineers who still ship").
- Grouped by 4 tracks with STEP badges: Start-here Basics (must-have) → Build backends → Ship & operate → Get the job (advanced, last).
- Every course row shows the prerequisite ("Take alongside Core Java or after") and clearer time/mode chips.
- Track filter chips at the top ("All courses / Start here / Build backends / Ship & operate / Get the job") — instant filter.

### SEO / discoverability
- `public/sitemap.xml` now lists `/#/blog`, all blog post slugs, `/#/cheatsheet` and `/#/?s=<section>` for every home section.
- `index.html` JSON-LD BreadcrumbList + SiteNavigationElement expanded to include the new pages.

### New/modified files
- `App.js`, `site/Nav.jsx`, `site/Manifesto.jsx`, `site/Footer.jsx`, `site/useLenis.js`, `site/content.js`.
- `pages/Blog.jsx`, `pages/BlogPost.jsx`, `pages/Cheatsheet.jsx` (new).
- `public/sitemap.xml`, `public/index.html` schemas.

## Next tasks / backlog
- P1: Replace placeholder phone/address in `content.js` with the actual JBA studio details
- P1: Replace the Google Maps embed URL with the real studio pin (Maps → Share → Embed → copy `src`)
- P2: Add `CNAME` when a custom domain is purchased
- P2: Optional Formspree/Web3Forms integration if email submissions become desirable
- P2: Add a syllabus PDF download per course

## v3 — Themed / attractive / responsive redesign (Jul 2026)
Applied on top of v2. All original v2 content and functionality preserved.

### Design system
- New CSS variable-driven theme in `frontend/src/index.css` covering light + dark modes.
- Full **dark mode** with a Sun/Moon toggle in the nav (persists to `localStorage` under `jha-theme`).
- **Ambient aurora** — animated radial-gradient backdrop that gently drifts.
- **Glassmorphism** — `.glass-card`, `.gloss` (hover shine sweep), `.gradient-text` utilities.
- **Uniform typography**: Inter (body), Playfair (display), JetBrains Mono (technical). Fluid `clamp()` base size 16–18px for eye-comfortable reading.
- **Higher contrast palette** in both light & dark, defensible AA contrast.
- Buttons upgraded to gradient with animated shine sweep.

### Navigation / UX
- Sticky nav shows a **breadcrumb trail** ("Home / Current section") and active-section highlight.
- **Section rail** on right side (desktop only) — 12 dots that jump to each section and glow on the active one; label on hover.
- **Scroll progress bar** at the very top (rainbow).
- **Back-to-Top** floating button after 720px scroll.
- Mobile menu now lists all 11 sections in serif style; scroll-spy shows current one in orange.
- `html { scroll-padding-top: 96px }` fixes anchor jumps so section titles aren't hidden by the fixed header.
- On mount the app honors any `#hash` in the URL (deep-linking works from Google Business Profile posts, sitemap, etc.).

### SEO / discoverability
- `public/sitemap.xml` now includes all section deep-links: `/#courses`, `/#projects`, `/#batches`, `/#about`, `/#why-us`, `/#reviews`, `/#free-resources`, `/#faq`, `/#location`, `/#contact` — every one has a `<lastmod>` and priority.
- `index.html` adds a **BreadcrumbList** JSON-LD and a **SiteNavigationElement** array so Google can build sitelinks under the main result.

### New files
- `frontend/src/site/useActiveSection.js` — IntersectionObserver-based scroll spy; also updates `location.hash` as you scroll.
- `frontend/src/site/SectionRail.jsx` — right-side dot navigator.
- `frontend/src/site/ScrollProgress.jsx` — top rainbow progress bar.
- `frontend/src/site/BackToTop.jsx` — floating back-to-top button.
- `frontend/src/site/SectionNavStrip.jsx` — reusable prev/next strip (optional per-section use).
- `frontend/src/site/ThemeToggle.jsx` + `useTheme.js` — Sun/Moon toggle with localStorage persistence and `prefers-color-scheme` default.

### Responsiveness fixes
- Hero big-type wraps on mobile (no more clipped "technolo…").
- Mobile nav is now a scrollable full-height sheet listing every section.
- Batches / Compare card colors adapted for dark mode (removed hard-coded `bg-white`).
- Verified: no horizontal overflow at 390px, 768px, 1440px, 1920px viewports.

