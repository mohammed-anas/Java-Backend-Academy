# Java Backend Academy — Website

A single-page, fully static React SPA for **Java Backend Academy**, deployable to **GitHub Pages** with one command.

- Live cohort listings (Java, Database, System Design, AWS Cloud, DSA, CI/CD, Interview Prep, Job Search & Resume)
- Location with embedded Google Map, phone, WhatsApp and timings
- Contact form that opens **WhatsApp** with the enquiry prefilled — **no backend required**
- Mobile + desktop responsive, animated with `framer-motion`, smooth scrolling with `lenis`

---

## 1. Run locally

> ⚠️ **You must run `yarn install` inside the `frontend/` folder before anything else.** The build tool (`craco`) is a project dependency and will not be found if you skip this step (that's the `craco: command not found` error).

```bash
cd frontend      # ← IMPORTANT: everything runs from here
yarn install     # installs React, craco, gh-pages, etc.
yarn start       # dev server on http://localhost:3000
```

If you don't have Yarn, install it once: `npm install -g yarn`.

## 2. One-command deploy to GitHub Pages

### Prerequisites (one-time)

1. Create a public GitHub repository, e.g. `java-backend-academy`.
2. Push this project to that repo:

```bash
git init
git remote add origin https://github.com/<your-username>/<repo>.git
git branch -M main
git add .
git commit -m "chore: initial commit"
git push -u origin main
```

3. Open `frontend/package.json` and set the `homepage` field to your Pages URL:

```json
"homepage": "https://<your-username>.github.io/<repo>"
```

> If you're deploying to the root of a user site (`<username>.github.io`), set `"homepage": "."`.

### Deploy

From the `frontend/` folder (make sure `yarn install` has been run at least once here):

```bash
cd frontend
yarn install    # only needed the first time, or after pulling new deps
yarn deploy
```

That's it. This command runs `yarn build` and then publishes the `build/` folder to the `gh-pages` branch of your repo.

> **Troubleshooting**
> - **`craco: command not found`** → you didn't run `yarn install` inside `frontend/`, or you ran it in the repo root. Fix: `cd frontend && yarn install && yarn deploy`.
> - **Blank page after deploy** → your `homepage` field doesn't match your actual Pages URL. Set it to `https://<username>.github.io/<repo>` (with the exact repo name and casing) and re-run `yarn deploy`.
> - **404 on refresh** → this project uses anchor navigation (no client routes) so refresh works. If you add React Router later, switch to `HashRouter` for GitHub Pages compatibility.

### Enable Pages in GitHub

- Go to your repo → **Settings → Pages**
- **Source**: *Deploy from a branch*
- **Branch**: `gh-pages` · **Folder**: `/ (root)` · **Save**

Your site will be live at `https://<your-username>.github.io/<repo>` within a minute.

To re-deploy after changes, just run `yarn deploy` again.

---

## 3. Personalise your site

All copy, phone, WhatsApp, address, hours, socials and course details live in **one file**:

```
frontend/src/site/content.js
```

Update:

- `BRAND.name`, `BRAND.phone`, `BRAND.whatsappNumber`, `BRAND.address`, `BRAND.hours`
- `BRAND.mapEmbed` — paste your own Google Maps embed URL (Google Maps → Share → Embed a map → copy `src`)
- `BRAND.mapLink` — a `https://www.google.com/maps/search/?api=1&query=...` deep link
- `COURSES` — course titles, kickers, durations, modes and descriptions

Save. The dev server hot-reloads instantly.

## 4. Contact form (no backend)

The form in `src/site/Contact.jsx` builds a `wa.me/…?text=…` URL with the enquiry prefilled and opens WhatsApp on submit. You never store user data on any server — perfect for a purely static Pages deploy.

If you'd rather receive form submissions as emails later, drop-in options like [Formspree](https://formspree.io), [Getform](https://getform.io) or [Web3Forms](https://web3forms.com) work without changing the design.

## 5. Custom domain (optional)

- In your repo, add a file `frontend/public/CNAME` containing your domain (e.g. `www.mybusiness.com`).
- Point your DNS at GitHub Pages (4 A-records or a CNAME to `<username>.github.io`).
- Enable **Enforce HTTPS** under Settings → Pages.

---

## Project structure

```
frontend/
├── public/
│   └── index.html                # SEO metadata, fonts
├── src/
│   ├── App.js                    # Root — no router, single page
│   ├── index.js / index.css      # Global styles, colour tokens, animations
│   ├── pages/Home.jsx            # Section composition
│   └── site/
│       ├── content.js            # ★ All brand data & courses (edit this)
│       ├── Nav.jsx               # Fixed header + mobile menu
│       ├── Hero.jsx              # Kinetic masked-text hero + parallax
│       ├── Marquee.jsx           # Editorial keyword ribbon
│       ├── Manifesto.jsx         # Numbered course chapters
│       ├── About.jsx             # Institute story + image bento
│       ├── Location.jsx          # Map + phone + WhatsApp + hours
│       ├── Contact.jsx           # Enquiry form → WhatsApp
│       ├── Footer.jsx            # Dark footer
│       ├── ContactFab.jsx        # Floating call/WhatsApp pill
│       ├── Preloader.jsx         # Brand on-load moment
│       └── useLenis.js           # Smooth scroll driver
├── package.json                  # Scripts: start / build / deploy
└── craco.config.js               # Alias @ → src
```

---

Made in Bengaluru · © Java Backend Academy
