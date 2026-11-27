/* ==========================================================================
   PROJECTS — the permanent collection
   Edit this file to swap in Krist's real work. No other file needs changing.

   Each project:
     title   string   — project name
     year    string   — e.g. "2025" (optional, shown next to the title)
     blurb   string   — one or two short sentences (optional)
     tags    string[] — any of: "product", "web", "type", "play"
     href    string   — link to case study / live site (use "#" if not ready)
     medium  string   — museum label: what kind of piece it is
     role    string   — museum label: what Krist did on it
     stack   string   — museum label: what it's made of
     status  string   — "live" | "wip" | "stored" — shown as the plaque badge
     art     number   — 1–6, picks a CSS-generated cover (used when no image)
     colors  string[] — [background, accent] for the generated cover
     image   string   — OPTIONAL path or URL; overrides the generated cover
   ========================================================================== */

window.KRIST_PROJECTS = [
  {
    title: "Neon Dodgers",
    year: "2026",
    blurb: "A neon browser arcade about dodging everything. Twelve modes — from Endless and Ninja to Boss Rush — built to be picked up in seconds.",
    tags: ["play", "web"],
    href: "https://neon-dodgers.vercel.app",
    medium: "Browser arcade · interactive",
    role: "Design, code & game feel",
    stack: "HTML · CSS · vanilla JavaScript",
    status: "live",
    art: 1,
    colors: ["#12121c", "#ff4fd8"],
    image: "images/neon-dodgers.jpg"
  },
  {
    title: "Geometric Rhythm",
    year: "2026",
    blurb: "A neon rhythm game you can play in the browser. Pick a track, hit the beat, and spend the coins you earn on new looks.",
    tags: ["play", "web"],
    href: "https://geometric-rhythm.vercel.app",
    medium: "Rhythm platformer · interactive",
    role: "Design, code, levels & music picks",
    stack: "Canvas · Web Audio · vanilla JavaScript",
    status: "live",
    art: 4,
    colors: ["#ffb7d5", "#2b3bff"],
    image: "images/geometric-rhythm.jpg"
  },
  {
    title: "My Web Museum",
    year: "2026",
    blurb: "This site — a small, dependency-free portfolio built as a museum, with CSS-only cover art, museum wall labels and zero trackers.",
    tags: ["web", "product"],
    href: "https://krist-web-museum.vercel.app",
    medium: "Portfolio · static site",
    role: "Design & code",
    stack: "HTML · CSS · vanilla JavaScript",
    status: "live",
    art: 6,
    colors: ["#f4efe4", "#131110"],
    image: "images/museum.jpg"
  },
  {
    title: "Iq-Math",
    href: "https://iq-math-krist.vercel.app/",
    tags: ["web"],
    status: "live",
    art: 5,
    colors: ["#d9ff43", "#131110"]
  }
];
