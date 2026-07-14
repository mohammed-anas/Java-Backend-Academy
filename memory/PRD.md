# CODECRAFT — Product Requirements

## Original problem statement
Create a very professional website (mobile + web responsive, user-friendly) for a coding training institute that teaches Java, DSA, System Design, Spring Boot, Databases, AWS Cloud, Interview Preparation & Mock Interviews. Deployable to GitHub Pages. Ambition: Awwwards Site-of-the-Day caliber.

## User choices (verbatim)
- Business: Training Institute (Java, DSA, System Design, Spring Boot, DB, AWS, Interview Prep, Mock Interviews)
- Sections: All (Hero, Courses, About, Reviews, Contact, Google Maps, WhatsApp/Call FAB)
- Design: "Surprise me" → delivered *Editorial Code* (Swiss Brutalist + High Fashion Tech)
- Stack: React app
- Details: business type only; realistic placeholders used for phone / address (no email requested)

## Architecture
- **Frontend**: React 19 + Tailwind + framer-motion + lenis (smooth scroll) + sonner (toasts) + lucide-react (icons). Playfair Display / Outfit / JetBrains Mono via Google Fonts.
- **Backend**: FastAPI + Motor (MongoDB). Endpoints under `/api`.
- **DB**: MongoDB collections `leads`, `status_checks`.

## Implemented (v1 — 14 Dec 2025)
- Kinetic hero with masked line-by-line reveal, parallax abstract image, mono meta ticker
- Editorial slow marquee (JAVA // DSA // SYSTEM DESIGN // …)
- Numbered manifesto — 8 course chapters with hover translate + floating image (desktop)
- Outcomes section with animated count-up stats (4 metrics)
- About — editorial bento image grid + 2×2 institute stats
- Mentors — grayscale spotlight portraits (3)
- Reviews — animated carousel with prev/next
- Editorial contact form with bottom-border inputs → POST /api/leads (Mongo persistence)
- Location — Google Maps iframe + Open-in-Maps deep link
- Footer (dark) with anchor nav + socials
- Floating WhatsApp + Click-to-Call FAB
- Preloader with brand mark + progress
- Lenis momentum scrolling, framer-motion scroll reveals throughout
- Full mobile/tablet responsive; hamburger nav panel
- SEO metadata + Open Graph tags

## Backend endpoints
- `GET  /api/`                → service ping
- `POST /api/leads`           → create enquiry (validated: EmailStr, min lengths)
- `GET  /api/leads`           → list enquiries (recent first)
- `POST /api/status`, `GET /api/status` (template — retained)

## Test results (iteration_1.json)
- Backend: 100% (6/6 pytest cases)
- Frontend: 100% (Playwright — nav, courses, outcomes, mentors, reviews, form submit, maps, footer, FAB, mobile menu)
- No horizontal overflow at 390 / 768 px

## Backlog (P1 / P2)
- P1: Admin view for leads (auth-gated) at `/admin/leads`
- P1: Email/WhatsApp notification on new lead (Resend / Twilio)
- P1: `gh-pages` build script + repo instructions in README
- P2: Course detail pages (`/course/:slug`) with syllabus + sample projects
- P2: Cohort dates + seat counter widget on hero
- P2: Newsletter opt-in in footer
- P2: Blog / editorial articles section
- P2: Fix transient "-0%" flash in count-up and stray `<span>` in `<option>` dev warning

## Next tasks
- Ship gh-pages deploy config + README
- Add admin dashboard for leads with basic auth
