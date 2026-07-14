# Java Backend Academy — Website

A single-page, fully static React SPA for **Java Backend Academy**, deployable to **GitHub Pages** with one command.

- Live cohort listings (Java, Database, System Design, AWS Cloud, DSA, CI/CD, Interview Prep, Job Search & Resume)
- Location with embedded Google Map, phone, WhatsApp and timings
- Contact form that opens **WhatsApp** with the enquiry prefilled — **no backend required**
- Mobile + desktop responsive, animated with `framer-motion`, smooth scrolling with `lenis`

---

## 1. Run locally

```bash
cd frontend
yarn install
yarn start
```

The app runs at `http://localhost:3000`.

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

From the `frontend/` folder:

```bash
yarn deploy
```

That's it. This command runs `yarn build` and then publishes the `build/` folder to the `gh-pages` branch of your repo.

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
