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

## Next tasks / backlog
- P1: Replace placeholder phone/address in `content.js` with the actual JBA studio details
- P1: Replace the Google Maps embed URL with the real studio pin (Maps → Share → Embed → copy `src`)
- P2: Add `CNAME` when a custom domain is purchased
- P2: Optional Formspree/Web3Forms integration if email submissions become desirable
- P2: Add a syllabus PDF download per course
