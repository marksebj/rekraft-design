# Rekraft Design

Independent design studio · London. The studio arm of Rekraft (sister site to [rekraft.agency](https://rekraft.agency)).

**Tagline:** Made to stand out. Built to stand up.

**Domain:** [rekraft.design](https://rekraft.design)

## Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite`)
- **Motion:** GSAP 3 (ScrollTrigger) + Lenis smooth scroll
- **Fonts:** Instrument Serif (display) · Inter Tight (UI) · JetBrains Mono (labels)
- **Deployment:** Vercel (new project, separate from Rekraft Agency)

## Local development

```bash
npm install
npm run dev   # dev server on port 8003
npm run build # static build to dist/
```

## Project structure

```
src/
  layouts/Base.astro         # HTML shell, head meta, font links, JSON-LD
  pages/index.astro          # home page — composes all sections
  components/
    Nav.astro                # fixed pill nav
    Hero.astro               # editorial hero with kinetic type reveal
    Marquee.astro            # infinite scroll disciplines strip
    Manifesto.astro          # centered editorial one-liner
    Work.astro               # case study grid with A/B/C capability tags
    Approach.astro           # sticky-left + principles list
    Services.astro           # three large-type service blocks
    About.astro              # founder bio with sticky portrait
    Contact.astro            # oversized "Start a project" CTA
    Footer.astro             # minimal editorial footer
  scripts/motion.ts          # Lenis + GSAP bootstrap, word-splitter, reveals
  styles/global.css          # Tailwind v4 @theme tokens + primitives
public/
  images/                    # logo, favicons, founder photo
```

## Positioning

- `rekraft.agency` — productised marketing agency **exclusively for UK tradespeople** (warm orange / Electric Concrete palette).
- `rekraft.design` — **bespoke studio** for non-trade clients (editorial dark + restrained lime, serif display).

Same founder. Same brand family. Different product, different IA, different visual language.

## Portfolio A / B / C convention

Case studies are tagged by the capability they lead with, so the studio's range is legible at a glance:

- **A · Cinematic** — kinetic, WebGL, scroll-driven, heavy interactivity
- **B · Editorial** — craft-led, editorial typography, image-forward (this site is itself a B reference)
- **C · Brand-forward** — bold colour, expressive identity, strong personality

## Contact

- Email: mark@rekraft.design
- Location: London, UK
