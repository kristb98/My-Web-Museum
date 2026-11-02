# Krist — project notes

Static portfolio. No build step, no dependencies (besides Google Fonts).
Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Files

| File | What it does |
| --- | --- |
| `index.html` | All page structure & copy (hero, work, about, contact, footer) |
| `styles.css` | Design tokens at the top, then components, then responsive + reduced-motion |
| `projects.js` | **The project list — edit this to swap in real work** |
| `app.js` | Card rendering, museum plaques, filters, scroll reveals, magnetic buttons, copy-email |
| `favicon.svg` | Little "k." mark |
| `.vercelignore` | Keeps `NOTES.md` out of the deploy |

## Swap in the real projects

Everything is driven by the array in `projects.js`. Copy a block, change the fields:

```js
{
  title: "Project name",
  year: "2025",
  blurb: "One or two sentences, lowercase-friendly.",
  tags: ["product", "web"],      // product | web | type | play
  href: "https://…",             // "#" shows a "coming soon" toast
  medium: "Browser game · interactive",   // museum label row
  role: "Design & code",                  // museum label row
  stack: "HTML · CSS · JS",               // museum label row
  status: "live",                // live | wip | stored → plaque badge
  art: 3,                        // 1–6, CSS-generated cover
  colors: ["#131110", "#FFB7D5"],// [background, accent]
  image: "images/project.jpg"    // optional, overrides `art`
}
```

- The work section is framed as a small museum: each card carries a wall
  label (exhibit number, Medium / Role / Stack, and an "On display" badge).
- Adding a new tag? Add a matching `<button class="chip" data-filter="…">` in
  `index.html`; the count updates itself.
- If every project gets a real image, `art`/`colors` can be ignored.
- Keep blurbs short — cards sit in a 2-column editorial grid.

## Task list

### Content (blocking launch)
- [x] Add the rest of Krist's projects (Neon Dodgers + Geometric Rhythm are in)
- [x] Geometric Rhythm live → https://geometric-rhythm.vercel.app (deployed from the GitHub repo, game served at `/`)
- [x] Email wired up (assembled in JS, so the address isn't plain text in the HTML)
- [x] GitHub link → https://github.com/kristb98 (only profile; no repos embedded)
- [ ] Confirm the hero headline + lede (About copy is now Krist's own)
- [ ] Replace "Based in …" with the real city / timezone
- [ ] Add project screenshots to `images/` and point each project at one
- [ ] Optional: add a CV / résumé link somewhere in About

### Design & polish
- [ ] Add an OG/social share image (1200×630) + `og:image` meta
- [ ] Check the cover-art variants still look good on real images
- [ ] Look at the marquee speed on a 27" screen — may want it slower
- [ ] Add a 404 page (or host-level redirect)
- [ ] Optional: dark mode (tokens are already centralised in `:root`)

### Technical
- [ ] Run Lighthouse (perf / a11y / best practices / SEO)
- [ ] Self-host the two fonts or add `font-display: swap` fallback check
- [ ] Add `sitemap.xml` + `robots.txt`
- [ ] Add analytics *only if wanted* — currently zero trackers
- [ ] Test keyboard nav: skip link → nav → filters → cards → email copy
- [ ] Test at 320px, 768px, 1024px, 1440px, 1920px
- [ ] Set real `<title>` / description if the positioning changes

### Deploy
- [x] Host picked: Vercel (static, no build command) — repo `kristb98/spaces`
- [x] `NOTES.md` excluded from deploys via `.vercelignore`
- [ ] Point the domain, add HTTPS
- [ ] Post-launch: check links, check mobile Safari, submit to search

## Design tokens (in `styles.css`)

```
paper   #F4EFE4    ink      #131110    line   rgba(19,17,16,.16)
lime    #D9FF43    coral    #FF5B37    cobalt #2B3BFF
lilac   #C9B8FF    pink     #FFB7D5
display Fraunces (serif) · sans Space Grotesk · mono system
```

## Notes

- The grid is intentionally staggered on desktop (every 2nd card drops down).
- Cover art is pure CSS: `art--1` … `art--6`, driven by `--a` / `--b`.
- All motion is disabled under `prefers-reduced-motion: reduce`.
- Placeholder links (`href="#"`) show a toast instead of jumping to the top.
- Last QA pass: no console errors; Lighthouse 100 / 100 / 100
  (accessibility / best practices / SEO); checked at 390, 768 and 1440px.
