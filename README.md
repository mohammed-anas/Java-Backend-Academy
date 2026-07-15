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

## 5. Reviews with your own approval workflow (Google Sheets)

The **Reviews** section on the site is powered by a Google Sheet you own, via a small Google Apps Script Web App. Visitors submit → their entry lands in your sheet with `approved = FALSE` → you flip that cell to `TRUE` → the site shows it. Your Sheet URL is **never** in the website code or Network tab — only the Apps Script URL is.

### One-time setup

1. **Create the Sheet.** New Google Sheet → rename Sheet1 to `reviews` → paste this header row (columns A–J):
   ```
   submitted_at | name | rating | batch | from | to | grade | comment | approved | ip
   ```
2. **Grab the Sheet ID.** From the sheet URL: `docs.google.com/spreadsheets/d/{SHEET_ID}/edit`.
3. **Create the Apps Script.** Go to <https://script.google.com/> → **New Project** → delete the boilerplate → paste the contents of `docs/reviews-apps-script.gs` from this repo → replace `PASTE_YOUR_SHEET_ID_HERE` with your Sheet ID → save.
4. **Deploy as a Web App.** In the Apps Script editor: **Deploy → New deployment → Type: Web app**.
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*
   - Click **Deploy** → copy the **Web app URL**.
5. **Wire the site to it.** In `frontend/`, create a file called `.env` (same folder as `package.json`) with:
   ```
   REACT_APP_REVIEWS_API=https://script.google.com/macros/s/AKfy…/exec
   ```
   Alternatively, paste the URL directly into `REVIEWS_API_URL` in `frontend/src/site/content.js`.
6. **Redeploy the site:** `yarn deploy`.

### Approving a review

1. Open your Google Sheet.
2. Find the new row (they land with `approved = FALSE`).
3. Change `approved` to `TRUE`.
4. Done — the next site visitor will see it. No re-deploy needed.

### What's exposed publicly, what isn't

| Data | Where it lives | Exposed to visitors? |
|---|---|---|
| Sheet URL / Sheet ID | Inside the Apps Script (server-side, Google's cloud) | ❌ Never |
| Apps Script Web App URL | In your site bundle (build-time env var) | ✅ Yes (visible in Network tab — unavoidable for any static-site + API pattern) |
| Unapproved review rows | Only in your Sheet | ❌ Never returned by GET |
| Approved review rows | Site + your Sheet | ✅ Yes (that's the point) |
| Submitter IP | Sheet column `ip` (for your rate-limiting / abuse checks) | ❌ Not returned by GET |

The Apps Script includes basic per-IP rate limiting (one submission / 60 s) so a stranger with the URL can't spam your sheet. If the URL ever gets abused, redeploy the Apps Script for a fresh URL and update `.env`.

## 6. Custom domain (optional)

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

Made in Aligarh · © Java Backend Academy
