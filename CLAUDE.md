# Rekraft Design

## Project overview

**Rekraft Design** ([rekraft.design](https://rekraft.design)) is the bespoke-studio sister site to [rekraft.agency](https://rekraft.agency). While Agency is productised marketing for UK tradespeople, Design takes on a small number of general-client projects: brand, websites, social for businesses that mean business.

Tagline: **Made to stand out. Built to stand up.**

**This is not a reskin of rekraft.agency.** It has its own visual language, its own IA, and its own voice. Do not import Agency copy, Agency sections, or Agency palette choices without asking. The two sites are siblings, not clones.

## Stack

- Astro 5, TypeScript strict
- Tailwind CSS v4 via `@tailwindcss/vite` (token-first, `@theme` in `src/styles/global.css`)
- GSAP 3 + ScrollTrigger + Lenis smooth scroll
- Vanilla `motion.ts` bootstraps everything; no React / framework overhead
- Deployment: Vercel (new project under marksebj, separate from Agency)

## Design system — "Editorial Cream"

Warm cream paper foundation with near-black ink, rich cherry burgundy for italic emphasis, and deep forest green for structural accents. **This is deliberately opposite to rekraft.agency** (which is a dark "Electric Concrete" palette). The two are visual siblings, not twins.

Classic editorial trio: **cream + burgundy + forest green**. Think Penguin book covers, The Gentlewoman, Kinfolk.

### Colour tokens (in `src/styles/global.css` under `@theme`)

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#F2EDE1` | Page background — warm cream paper |
| `--color-surface` | `#E8E2D2` | Elevated sections / dividers |
| `--color-card` | `#FFFFFF` | Pure white cards against cream bg |
| `--color-card-hover` | `#FAF6EC` | Card hover state |
| `--color-border` | `#D8D1BF` | Default borders |
| `--color-border-active` | `#A59E8A` | Hover/active borders |
| `--color-ink` | `#141418` | Primary text, primary CTA background (near-black) |
| `--color-ink-muted` | `#4F4B43` | Body copy |
| `--color-ink-dim` | `#86807A` | Captions, meta |
| `--color-ink-faint` | `#B8B1A3` | Decorative / very subtle text |
| `--color-lime` | `#264027` | **Forest green** — structural accent (labels, bullets, nav underline, scroll progress). Name is legacy; value is green. |
| `--color-lime-soft` | `rgba(38, 64, 39, 0.10)` | Forest green low-opacity for hovers |
| `--color-lime-glow` | `rgba(38, 64, 39, 0.18)` | Forest green glow |
| `--color-cream` | `#8B1E2A` | **Rich cherry burgundy** — italic emphasis accent. Tuned against Tommy's Aventador SVJ wrap. Name is legacy; value is burgundy. |
| `--color-ambient` | `rgba(139, 30, 42, 0.10)` | Burgundy-tinted ambient glow (hero / manifesto / contact) |

### Typography

| Tier | Family | Role |
|---|---|---|
| Display | **Instrument Serif** (0 + italic) | All large headlines. Italic gives emphasis. This is the single biggest visual differentiator from Agency. |
| UI / body | Inter Tight | CTAs, buttons, body copy |
| Mono | JetBrains Mono | Eyebrow labels, meta, captions, numeric |

Type scale utilities (`.display-1`, `.display-2`, `.display-3`, `.lead`, `.eyebrow`) are defined in `global.css`. Use those, not ad-hoc `text-[Npx]`.

### Tone & voice

- **citizenM-disruptive**: confident, high-end, not cocky. "Businesses that mean business."
- Lowercase in nav / eyebrows / mono labels. Title case in display headlines.
- Italic accent is **cherry burgundy** `#8B1E2A`, never forest green. Forest green is for structure (labels, underlines, bullets), not emphasis. Ambient glows use a warm burgundy tint (not green) to keep cream + burgundy + green in balance.
- Sub-brand wordmark in nav uses sans "rekraft" + italic serif "design" — that lockup is load-bearing. Don't redesign it casually.

## Motion

- **Lenis** handles smooth scroll. `html.lenis` is added by `initLenis()`.
- **GSAP ScrollTrigger** is bridged to Lenis via `gsap.ticker`.
- **Hero headline** splits into `.word-inner` spans and reveals on mount (`data-hero-headline`).
- **Section headlines** split + reveal on scroll via `data-reveal-headline`.
- **Generic fade-up** via `.fade-up` + `is-in` toggle.
- **Parallax** via `[data-parallax="0.15"]` attributes.
- **Cursor glow** — subtle bone-white radial, auto-stops on idle. Hidden on touch.

### Performance rules (from the Rekraft Agency lessons)

- `html` uses `overflow-x: clip` — never `hidden` (creates a second scroll container).
- Never `transition: all` — always specify properties.
- No `filter: blur()` transitions (forces per-frame rasterisation).
- Cursor glow rAF must stop on idle.
- No infinite `box-shadow` animations, no conic-gradient animations.
- Respect `prefers-reduced-motion` — the reveal utilities have reduced-motion overrides at the end of `global.css`.

## File structure

```
astro.config.mjs            # Tailwind v4 via @tailwindcss/vite plugin
package.json                # deps, dev runs on port 8003
.claude/launch.json         # per-project preview server config
src/
  layouts/Base.astro        # HTML shell, <head>, fonts, JSON-LD, body slot
  pages/index.astro         # home — composes all section components
  components/
    Nav.astro · Hero.astro · Marquee.astro · Manifesto.astro
    Work.astro · Approach.astro · Services.astro
    About.astro · Contact.astro · Footer.astro
  scripts/motion.ts         # Lenis + GSAP bootstrap + reveals
  styles/global.css         # @theme tokens + primitives + reveals + buttons
public/images/              # logo, favicons, founder photo
```

## Copy conventions

- **Never** reuse Agency copy verbatim. Agency speaks to tradespeople. Design speaks to founders and brand owners.
- No em-dashes in display copy (use `,` or `.`).
- Italic accents go on the *payoff* word/phrase, never the whole line.
- Section labels are numbered: "01 — SELECTED WORK", "02 — APPROACH", etc.
- Three-principle and three-service patterns are load-bearing. Keep them tight.

## A / B / C capability convention

Case studies are tagged by the capability they lead with. Use this consistently across the site:

- **A · Cinematic** — WebGL, kinetic, scroll-driven interactivity
- **B · Editorial** — craft-led, editorial type, image-forward (this site itself is a B reference point)
- **C · Brand-forward** — bold colour, expressive identity, personality-driven

When a new case study is added, pick one dominant tag. Don't dual-tag.

## Obsidian sync

Vault: `/Users/marksebj/Library/Mobile Documents/iCloud~md~obsidian/Documents/MJs Second Brain/Projects/Rekraft/`

**Canonical note for this site:** `Business/Rekraft Design Website.md` (sibling to `Business/Rekraft Website.md` which covers the Agency). The vault README at `Projects/Rekraft/README.md` links to both arms under a "Sites (two arms)" section.

When a significant change ships (new case study, new section, palette tweak, copy rewrite), update `Business/Rekraft Design Website.md`. Don't let Obsidian drift from the code.

## Contact

- Email: mark@rekraft.design
- Based: London, UK
- Availability: Q3 2026 (update this when the date rolls over)

## Sibling site

- [rekraft.agency](https://rekraft.agency) — trades-only productised agency. Different codebase (static HTML), different palette (Electric Concrete with hot pink), different voice. **Don't import from Agency without asking.**
