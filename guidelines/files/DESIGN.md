# SecondLane — Style Reference
> private office in bottle green and linen

**Theme:** dark-first (green), with linen and white sections
**Version:** 1.1 · 7 Nov 2026
**Files:** `tokens.css` (CSS custom properties) · `tailwind.css` (Tailwind v4 theme) · `tokens.json` (W3C design tokens) · this file
**Visual reference:** the live prototype, https://yyyyyyyyuri.github.io/secondlane-preview/ · full guide with live components: https://yyyyyyyyuri.github.io/secondlane-preview/guidelines/

SecondLane is an introduction network for secondary opportunities in private companies (AI, defense, space, fintech). The site should feel like a private office: calm, established, discreet and expensive, never like a trading app. Bottle green carries most of the page, with linen and white sections for contrast. A single signal yellow marks the main action and active states; a terracotta rust marks labels on light grounds. Headlines are set in Ashcroft, a warm serif, at regular weight with slight negative tracking; everything else is set in SFT Schrifted Sans. Imagery is warm editorial photography plus halftone renderings of sector objects, with a generated yellow dot field as the one recurring texture. Motion is slow and soft: cards lift 6px, content rises once, nothing loops.

---

## Tokens — Colors

The palette has three layers. Components only ever use the third.

1. **Ramps:** four shade ramps (green, neutral, yellow, rust), 50 to 950, built in OKLCH so steps look evenly spaced. **Bold** values are brand anchors: the exact colours the brand already uses. They are fixed; the other steps are generated around them.
2. **Brand aliases:** the names the team uses (`--color-linen`, `--color-yel` …), each pointing at one ramp step.
3. **Role tokens:** names that say what a colour is for (`--bg`, `--fg`, `--accent`, `--danger` …). They switch automatically with the section theme.

### Ramps

| Ramp | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 850 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| green | `#E2EEE8` | `#D4E2DB` | `#B9CAC2` | `#9FB3AA` | `#859D92` | `#6C877B` | `#547264` | `#3C5D4F` | **`#24493A`** | **`#17392A`** | **`#12301F`** | **`#0C2216`** |
| neutral | **`#F5F3EF`** | `#ECE8E0` | **`#D9D2C3`** | **`#CBBFA8`** | `#ACA68F` | `#8E8E78` | `#717763` | **`#55604F`** | `#3D4236` |  | `#252720` | **`#191A16`** |
| yellow | `#F7FFD6` | `#F4FFC2` | **`#EDFF8C`** | **`#E3FD5A`** | **`#CFE844`** | `#B9CF37` | **`#A3B62B`** | `#7F8E1C` | `#5D690E` |  | `#3D4603` | `#2E3500` |
| rust | `#FEE7DE` | `#FCDBCD` | `#F7C1AB` | **`#F0A88A`** | `#DD8C6E` | `#C97054` | **`#B5543A`** | **`#8F442D`** | `#6D3220` |  | `#4C2114` | `#3C190E` |

`green-850` is an extra step between 800 and 900 for raised panels on green.

### Brand aliases

| Name | Value | Token | Ramp step | Role |
|---|---|---|---|---|
| Green | `#12301F` | `--color-green` | `green-900` | Primary ground: hero, nav, footer, most sections, cards |
| Green 2 | `#17392A` | `--color-green-2` | `green-850` | Raised panels on green |
| Linen | `#F5F3EF` | `--color-linen` | `neutral-50` | Text on green; light ground |
| Stone | `#D9D2C3` | `--color-stone` | `neutral-200` | Lead text on green |
| Sand | `#CBBFA8` | `--color-sand` | `neutral-300` | Secondary text on green, footer |
| Mute | `#55604F` | `--color-mute` | `neutral-700` | Secondary text on linen and white |
| Ink | `#191A16` | `--color-ink` | `neutral-950` | Text on yellow |
| SL Yellow | `#E3FD5A` | `--color-yel` | `yellow-300` | Signal: primary buttons, eyebrows on green, active states, dot field |
| Rust | `#8F442D` | `--color-rust` | `rust-700` | Eyebrows and error text on light grounds |

### Role tokens

Set `data-theme="green"`, `"linen"` or `"white"` on each section; role tokens resolve to the values below. Green is the default on `:root`.

| Token | Green theme | Linen / white theme | Use |
|---|---|---|---|
| `--bg` | `green-900` #12301F | `neutral-50` #F5F3EF | Section background |
| `--bg-raised` | `green-850` #17392A | `white` #FFFFFF | Panels and cards that sit on the background |
| `--bg-inverse` | `neutral-50` #F5F3EF | `green-900` #12301F | A block in the opposite theme |
| `--fg` | `neutral-50` #F5F3EF | `green-900` #12301F | Headings and body text |
| `--fg-lead` | `neutral-200` #D9D2C3 | `neutral-700` #55604F | Standfirsts and lead paragraphs |
| `--fg-muted` | `neutral-300` #CBBFA8 | `neutral-700` #55604F | Secondary text, captions, footer links |
| `--fg-subtle` | `neutral-400` #ACA68F | `neutral-600` #717763 | Placeholders and disabled text (large text only) |
| `--eyebrow` | `yellow-300` #E3FD5A | `rust-700` #8F442D | Uppercase labels above titles |
| `--accent` | `yellow-300` #E3FD5A | `yellow-300` #E3FD5A | Primary button fill, active underline, arrows on green |
| `--accent-hover` | `yellow-200` #EDFF8C | `yellow-200` #EDFF8C | Primary button hover |
| `--accent-pressed` | `yellow-400` #CFE844 | `yellow-400` #CFE844 | Primary button pressed |
| `--on-accent` | `neutral-950` #191A16 | `neutral-950` #191A16 | Text and icons on the accent |
| `--action` | `neutral-50` #F5F3EF | `green-900` #12301F | Secondary solid button fill (green button on light) |
| `--action-hover` | `neutral-100` #ECE8E0 | `green-800` #24493A | Secondary solid button hover |
| `--on-action` | `green-900` #12301F | `neutral-50` #F5F3EF | Text on the secondary solid button |
| `--arrow` | `yellow-300` #E3FD5A | `green-900` #12301F | Arrow-link icon |
| `--focus` | `yellow-300` #E3FD5A | `green-900` #12301F | Focus outline (2px, 3px offset); at least 3:1 on the ground |
| `--focus-field` | `yellow-600` #A3B62B | `yellow-600` #A3B62B | Input border when focused, always paired with --focus-ring |
| `--danger` | `rust-300` #F0A88A | `rust-700` #8F442D | Error text and icons |
| `--danger-border` | `rust-300` #F0A88A | `rust-600` #B5543A | Error field border |
| `--danger-bg` | `rust-950` #3C190E | `rust-50` #FEE7DE | Error message background |
| `--success` | `green-300` #9FB3AA | `green-700` #3C5D4F | Success text and icons |
| `--success-bg` | `green-850` #17392A | `green-50` #E2EEE8 | Success message background |
| `--warning` | `yellow-300` #E3FD5A | `yellow-800` #5D690E | Warning text and icons |
| `--warning-bg` | `yellow-950` #2E3500 | `yellow-50` #F7FFD6 | Warning message background |
| `--border` | `rgb(245 243 239 / .18)` | `rgb(18 48 31 / .14)` | Hairlines and dividers |
| `--border-strong` | `rgb(245 243 239 / .6)` | `rgb(18 48 31 / .6)` | Outline button border |
| `--border-card` | `rgb(113 119 99 / .6)` | `rgb(18 48 31 / .12)` | Card edge |
| `--field-border` | `rgb(18 48 31 / .35)` | `rgb(18 48 31 / .35)` | Input border (inputs are always white) |
| `--focus-ring` | `rgb(227 253 90 / .3)` | `rgb(227 253 90 / .3)` | 4px ring around focused inputs |
| `--accent-glow` | `rgb(227 253 90 / .16)` | `rgb(227 253 90 / .16)` | 4px ring on primary button hover |
| `--scrim` | `rgb(18 48 31 / .88)` | `rgb(18 48 31 / .88)` | Sticky nav once scrolled |
| `--glass` | `rgb(18 48 31 / .55)` | `rgb(18 48 31 / .55)` | Glass panel fill (with 24px blur) |

Chart series, in order: `--chart-1` … `--chart-5` (green theme: linen, yellow, rust light, green 400, neutral 400; light theme: green, yellow 700, rust 600, green 500, neutral 400).

### How we use the ramps

1. **Components use role tokens, never ramp steps.** Write `background: var(--bg)` / `bg-bg`, not `#12301F` or `bg-green-900`. A component built on role tokens works in every section theme without changes.
2. **Ramps are the palette that role tokens draw from.** Reach for a ramp step directly only for one-off cases that have no role yet: chart series, illustration fills, a tinted table row, a status tag. If the same step is used in two places, add a role token for it.
3. **Never type a hex value or invent a colour.** If a step you need is missing, ask design to add a role token; don't pick a nearby hex.
4. **Anchors don't move.** The bold steps are the brand colours. Generated steps may be tuned later; anchors only change with a brand decision.
5. **What each band of a ramp is for:**
   - **50–200:** light surfaces and tints (message backgrounds, selected rows on light, chart fills).
   - **300–500:** decorative fills, borders on light grounds, chart series, text on green (300 and lighter).
   - **600–700:** text and icons on linen and white (these pass AA), error borders.
   - **800–950:** dark surfaces, panels on green, hover states on green.
6. **Contrast pairing rule.** On green (`green-900`): text uses steps **400 or lighter** of neutral, **300 or lighter** of green and rust, and `yellow-300`. On linen and white: text uses steps **700 or darker** (green, neutral, rust) or **800 or darker** (yellow). Every role token pair in this file has been checked against WCAG 2.2 AA.
7. **Yellow is a signal, not a colour scheme.** `yellow-300` appears once or twice a screen: the main button, the active nav underline, arrows and eyebrows on green, the dot field. `yellow-200` and `yellow-400` are its hover and pressed states; `yellow-600` is the input focus border; 700–900 exist only for warning text on light grounds; 50–100 for warning tints. Never use yellow as text on linen or white (1.0:1), never inside photography.
8. **Rust is an accent.** `rust-700` for eyebrows and error text on light, `rust-600` for error borders, `rust-300` for error text on green, 50–100 and 950 for error backgrounds.
9. **Lines use transparency, not ramp steps.** Hairlines are the text colour at 12–20% (`--border`), so they blend on any ground and over images.
10. **Proportion.** Across a page, roughly: green 70%, linen and white 25%, neutrals for text, yellow under 5%, rust under 2%.

---

## Tokens — Typography

### Ashcroft — Headlines, card titles and large figures · `--font-serif`
- **Substitute:** Iowan Old Style, then Georgia
- **Weights:** 300 (figures only), 400 (all headings). 500 is licensed but unused.
- **Sizes:** 24–68px
- **Line height:** 1.02–1.15
- **Letter spacing:** −0.015em on display and H1, −0.012em on H2, −0.01em on figures, 0 below 40px
- **Role:** the brand voice. Regular weight only; hierarchy comes from size, never bold.

### SFT Schrifted Sans — Body, UI, labels, buttons · `--font-sans`
- **Substitute:** Helvetica Neue, Helvetica, Arial
- **Weights:** 400 (body), 500 (buttons, links, labels, nav)
- **Sizes:** 11–18px
- **Line height:** 1.5–1.55 for text, 1 for buttons
- **Letter spacing:** 0, except uppercase eyebrows (+0.07em) and field labels (+0.06em)
- **Role:** everything that isn't a headline.

> **Licensing:** the prototype uses trial files. Production needs web licences for both families, served as WOFF2 with `font-display: swap`.

### Type Scale

| Role | Family | Weight | Size | Phone | Line height | Letter spacing | Token |
|---|---|---|---|---|---|---|---|
| display | Ashcroft | 400 | 68px | 44px | 1.02 | -0.015em | `--text-display` |
| h1 | Ashcroft | 400 | 58px | 36px | 1.04 | -0.015em | `--text-h1` |
| h2 | Ashcroft | 400 | 48px | 34px | 1.05 | -0.012em | `--text-h2` |
| h3 | Ashcroft | 400 | 36px | 28px | 1.1 | 0 | `--text-h3` |
| h4 | Ashcroft | 400 | 30px | 24px | 1.15 | 0 | `--text-h4` |
| figure | Ashcroft | 300 | 64px | 48px | 1 | -0.01em | `--text-figure` |
| lead | SFT Schrifted Sans | 400 | 18px | 16px | 1.5 | 0 | `--text-lead` |
| body | SFT Schrifted Sans | 400 | 17px | 16px | 1.55 | 0 | `--text-body` |
| small | SFT Schrifted Sans | 400 | 15px | 15px | 1.5 | 0 | `--text-small` |
| caption | SFT Schrifted Sans | 400 | 13px | 13px | 1.45 | 0 | `--text-caption` |
| button | SFT Schrifted Sans | 500 | 16px | 15px | 1 | 0 | `--text-button` |
| link | SFT Schrifted Sans | 500 | 17px | 16px | 1.2 | 0 | `--text-link` |
| eyebrow | SFT Schrifted Sans | 500 | 12px | 12px | 1.333 | 0.07em | `--text-eyebrow` |
| label | SFT Schrifted Sans | 500 | 11px | 11px | 1.455 | 0.06em | `--text-label` |

Phone sizes apply below 900px. In Tailwind v4 each `--text-*` token carries its own line height, tracking and weight, so `text-h2` sets all four.

---

## Tokens — Spacing & Shapes

**Base unit:** 4px (Tailwind `--spacing: 4px`, so `p-6` = 24px)
**Density:** generous; sections breathe, content is never crowded

### Spacing Scale

| Token | Value | Tailwind |
|---|---|---|
| `--space-1` | 4px | `*-1` |
| `--space-2` | 8px | `*-2` |
| `--space-3` | 12px | `*-3` |
| `--space-4` | 16px | `*-4` |
| `--space-5` | 24px | `*-6` |
| `--space-6` | 32px | `*-8` |
| `--space-7` | 44px | `*-11` |
| `--space-8` | 56px | `*-14` |
| `--space-9` | 72px | `*-18` |
| `--space-10` | 88px | `*-22` |
| `--space-11` | 136px | `*-34` |

Use only these steps. Small steps (4–24) space things inside a component; large steps (32–136) separate blocks and sections.

### Border Radius

| Element | Value | Token |
|---|---|---|
| Buttons, inputs, tags | 4px | `--radius-sm` |
| Cards, image frames | 8px | `--radius-md` |
| Glass panels (stats, waitlist form) | 12px | `--radius-lg` |

### Layout

- **Container:** 1312px max (`--container-site`), 64px side padding (20px below 900px), so content is 1184px wide
- **Grid:** 12 columns, 24px gap (4 columns, 16px below 900px)
- **Section padding:** 136px top and bottom (88px below 900px)
- **Section head:** title in 6 columns, standfirst in 5, bottom-aligned, 72px above the content
- **Nav:** sticky, 96px tall, 76px once scrolled
- **Breakpoints:** 900px (phone layout), 1180px (directory sidebar moves above the list)

---

## Components

### Primary Button
**Role:** the one main action on a screen (Get introduced, Get on the list, Get connected)

`--accent` fill and border, `--on-accent` text, SFT 500 16px, 52px tall, 26px side padding, `--radius-sm`. Hover: `--accent-hover` plus a 4px `--accent-glow` ring. Pressed: `--accent-pressed`, moves 1px down. Focus: 2px `--focus` outline, 3px offset. Compact version: 46px tall, 22px padding, 15px text (nav).

### Outline Button
**Role:** secondary action beside a primary (See how it works)

Transparent fill, 1px `--border-strong` border, `--fg` text, same size as the primary. Hover fills with `--fg` at 8%. Never more than one primary and one outline side by side.

### Green Button
**Role:** primary action on linen or white where yellow would be too loud (Get the report)

`--action` fill, `--on-action` text, hover `--action-hover`.

### Arrow Link
**Role:** inline navigation (Read all insights, See how funds use Prime)

SFT 500 17px in `--fg`, 10px gap, 16px arrow icon in `--arrow`. Arrow moves 4px right on hover over 180ms.

### Eyebrow
**Role:** small label above an H2 or card title

SFT 500 12/16px, +0.07em, uppercase, `--eyebrow` (yellow on green, rust on light). Sits 14px above the title.

### Card
**Role:** the one card style everywhere (verticals, insights, LP advantages)

`--bg` fill on green, 1px `--border-card` edge, `--radius-md`, padding 30px 26px 26px, 18px gap. Title in H3, body 18px in `--fg-muted`, eyebrow at the bottom of the text. The image bleeds to the card's sides and bottom at 5:4 with 7px bottom corners. Hover: lifts 6px with `--shadow-lift` over 700ms `--ease-settle`, and a 1px yellow edge lights up near the pointer. The image never zooms. The whole card is one link.

### Stat Panel
**Role:** key figures (2013 · 17,000+ · 1,500+)

Glass: `--glass` fill, 24px backdrop blur, 1px line at 20%, `--shadow-glass`, `--radius-lg`, padding 30px 34px. Figure in Ashcroft 300 64px; label 14px in `--fg-muted`. Sits over the dot field.

### Text Field
**Role:** email capture (waitlist, report)

White fill on every ground, 52px tall, 16px padding, 1px `--field-border`, `--radius-sm`, 17px text in `green-900`. Label above in the `label` style. Focus: `--focus-field` border plus 4px `--focus-ring`. Error: `--danger-border` border, message below in 13px `--danger`, `aria-invalid` and `aria-describedby` set. After submit, the form is replaced in place by the confirmation.

### Question Accordion
**Role:** FAQs on product pages

Rows separated by `--border`. Question in Ashcroft 32px (24px on phones), plus/minus icon on the right in `--fg-muted`. Answer 16px in `--fg-lead`, max 36em. First row open. Native `details`/`summary` or a button with `aria-expanded`.

### Top Navigation
**Role:** site-wide navigation

Sticky. Transparent over the hero; once scrolled past 40px, `--scrim` fill with 24px blur and a bottom `--border`, height 96 → 76px. Logo 128×32 on the left, links SFT 500 15px 36–44px apart, current page underlined 2px in `--accent`, Sign in and the page's primary button on the right.

### Footer
**Role:** site-wide footer

Green. Brand line on the left; three link columns (Platform, Companies, SecondLane) with headings in the `label` style in `--accent`; links 15px in `--fg-muted`; disclaimers 13px; copyright row.

### Dot Field
**Role:** the brand texture behind stats and panels

Canvas on `green-900`. 9px grid, one dot per cell, radius 1.05px, `yellow-300` at 22%. Within 220px of the pointer (smoothstep falloff `f`): radius `1.05 × (1 + f)`, alpha `0.22 + 0.5 × f`. Pointer eased at 0.12 per frame. Draw only while on screen; static under reduced motion.

---

## Do's and Don'ts

### Do
- Use role tokens in components and set `data-theme` on every section
- Use Ashcroft 400 for every heading and Ashcroft 300 for large figures
- Keep yellow to one or two signals per screen; switch eyebrows to rust and arrows to green on light grounds
- Use sentence case for headings and buttons, balanced headline lines, body lines of 50–75 characters
- Keep one card style, one primary button style and one radius scale across the site
- Leave generous space: 136px between sections, 72px under a section head
- Respect `prefers-reduced-motion`: no lift, rise or moving dots, all content visible

### Don't
- Don't type hex values or use ramp steps inside components
- Don't use yellow as text on linen or white, or inside photographs
- Don't bold headlines, use italics for emphasis, or set body copy in the serif
- Don't add shadows at rest, gradients on buttons or text, or radii above 12px
- Don't zoom images on hover, use parallax, carousels, tilt or bouncing easings
- Don't use trading language before the licence (see Words)

---

## Surfaces

| Level | Name | Value | Purpose |
|---|---|---|---|
| 0 | Green ground | `green-900` #12301F | Default page and section background |
| 0 | Linen ground | `neutral-50` #F5F3EF | Contrast sections (audiences, FAQ) |
| 0 | White ground | `#FFFFFF` | Logo rail |
| 1 | Raised green | `green-850` #17392A | Panels on green |
| 1 | Glass | `rgb(18 48 31 / .55)` + 24px blur | Stats and forms over the dot field or photos |
| 1 | White card | `#FFFFFF` | Panels on linen, inputs |

## Elevation

- **Card hover:** `0 27px 67px rgb(0 0 0 / .45)`, with a 6px lift
- **Glass panel:** `inset 0 1px 0 rgb(245 243 239 / .12)` + `backdrop-filter: blur(24px)`
- **Everything else:** no shadow; depth comes from surface tone and 1px lines

## Imagery

Two approved styles. **Editorial photography** for people, places and details: natural light, warm tones, real materials (stone, wood, wool, brass), unposed moments, no filters, no trading screens, handshakes or staged stock. **Halftone objects** for the sectors SecondLane covers (AI, crypto, fintech, consumer tech, gaming, space, deep tech, autonomy, defense, energy): one object per image; dark version on `#12301F` with a soft dot halo that fades out, light version alone on `#F5F3EF`; one small terracotta or bronze accent; no yellow or neon inside images. Ratios: 3:2 home hero art, 4:5 page hero, 5:4 cards, 4:3 split images, 3:4 portraits. Serve AVIF or WebP with JPEG fallback through `srcset`, lazy-load below the first screen, and give meaningful `alt` text (empty for decorative halftones). Prototype images are placeholders.

## Motion

| Use | Duration | Easing | Detail |
|---|---|---|---|
| Card lift | 700ms | `--ease-settle` cubic-bezier(.2,.7,.2,1) | 6px up plus `--shadow-lift` |
| Reveal | 900ms | `--ease-settle` | 24px rise and fade, items 160ms apart, once per page view |
| Buttons, links | 180ms | ease | Press moves 1px down in 80ms |
| Lit edge, nav | 350ms | ease | Opacity and background |
| Tabs, accordions | 600ms | `--ease-brand` cubic-bezier(.65,0,.35,1) | Height and opacity |

Animate `transform` and `opacity` only. Content hidden for a reveal must default to visible if scripts fail. Under `prefers-reduced-motion`, durations go to 0 and nothing moves.

## Layout

The page is a sequence of full-width sections, each with its own `data-theme`, holding one centred 1312px container. Sections mostly sit on green; a linen or white section breaks the rhythm every two or three sections. A section opens with a head (eyebrow, H2 in 6 columns, standfirst in 5 columns, bottom-aligned), then content 72px below: three cards (3 × 4 columns), four tiles (4 × 3), a 5 + 7 split, or a full-bleed band. The home hero is 80vh with the art on the right 64% fading into green. Every block starts and ends on the container's edges.

## Accessibility

WCAG 2.2 AA on every page. All role token pairs above meet 4.5:1 for text (except `--fg-subtle` on light, large text only). Focus is always visible (2px `--focus`, 3px offset, at least 3:1). Click targets at least 44 × 44px. One H1 per page, headings in order, landmarks, labelled fields with text errors, `role="status"` for confirmations, decorative canvases `aria-hidden`.

## Words and compliance

SecondLane is an introduction network until its licence is live. Interface copy, buttons, alt text and metadata use the pre-licence glossary: **opportunity** (not deal, trade, investment), **introduction / get introduced** (not buy, sell, trade, invest), **interested party, existing holder** (not buyer, seller), **qualified participants** (not investors), **private company interests** (not shares, stock), **dedicated vehicle** (not SPV), **last publicly reported valuation** (not price). Main actions: Get introduced (default), Access network (home hero), Get on the list (Access), Get connected (Capital), Get the report (newsletter). The disclaimer "SecondLane is an introduction network and is not a registered broker-dealer in the United States." appears under the home hero and in every footer. No promised returns, price predictions or fake countdowns (FINRA Rule 2210).

---

## Agent Prompt Guide

QUICK COLOR REFERENCE:
- background: `--bg` (green-900 #12301F; linen #F5F3EF in light sections)
- text: `--fg` (linen on green; green on light)
- lead text: `--fg-lead` (stone #D9D2C3 on green; mute #55604F on light)
- muted text: `--fg-muted` (sand #CBBFA8 on green; mute on light)
- primary action: `--accent` yellow-300 #E3FD5A with `--on-accent` #191A16 text
- eyebrow: yellow-300 on green, rust-700 #8F442D on light
- border: `--border` (linen 18% on green; green 14% on light)
- raised panel: `--bg-raised` (green-850 #17392A; white on light)

EXAMPLE COMPONENT PROMPTS:

1. Create the home hero. Section `data-theme="green"`, min-height 80vh. Left, 740px max: H1 in Ashcroft 400 58px, line height 1.04, −0.015em, `--fg`: "Get into the companies defining AI, defense, and space before they go public." 28px below, lead in SFT 18px `--fg-lead`. 36px below, a primary button "Access network" (52px, `--accent`, `--on-accent`, radius 4) and an outline button "See how it works". At the bottom, 13.5px `--fg-muted` disclaimer. Right 64% of the width: hero image, `object-fit: cover`, masked to fade into green on the left and bottom.

2. Create a three-card row. Section head: eyebrow "Three verticals" (`eyebrow` style), H2 "Liquidity starts here." in 6 columns, standfirst in 5 columns, bottom-aligned, 72px above the cards. Three cards on a 12-column grid (4 columns each, 24px gap): `--bg` fill, 1px `--border-card`, radius 8, padding 30px 26px 26px, title in Ashcroft 36px, body 18px `--fg-muted`, eyebrow at the bottom, 5:4 image bleeding to the card's sides and bottom. Hover: translateY(−6px) with `--shadow-lift` over 700ms `--ease-settle`.

3. Create the stats band. Green section with the dot field canvas behind. Three glass panels side by side: `--glass` fill, 24px backdrop blur, 1px `rgb(245 243 239 / .2)` line, radius 12, padding 30px 34px. Figures in Ashcroft 300 64px `--fg` (2013, 17,000+, 1,500+), labels 14px `--fg-muted`.

4. Create the waitlist form on Access. Glass panel 12px radius, eyebrow "SecondLane Access · Opening soon", H2-size title "Get on the list" in Ashcroft 32px, 15px intro in `--fg-lead`. Field label "Email" (`label` style), white 52px input with `--field-border`, focus `--focus-field` border plus 4px `--focus-ring`. Full-width primary button "Get on the list". 13px help line in `--fg-muted`. On submit, replace the form with "You're on the list." and four numbered next steps.

5. Create a FAQ section. `data-theme="linen"`. Centred eyebrow "Questions" in rust, H2 "Before you join". Below, a 720px list of `details` rows separated by `--border`: question in Ashcroft 32px `--fg`, plus/minus icon in `--fg-muted`, answer 16px `--fg-lead` max 36em. First row open. Under the list, a 13px risk disclaimer in `--fg-muted`.

---

## Quick Start

### Tailwind v4

```css
@import "tailwindcss";
@import "./secondlane.css"; /* tailwind.css from this pack */
```

```html
<section data-theme="green" class="bg-bg text-fg py-section">
  <div class="wrap">
    <span class="eyebrow">Three verticals</span>
    <h2 class="text-h2 mt-3.5">Liquidity starts here.</h2>
    <p class="text-lead text-fg-lead max-w-[34em]">…</p>
    <a class="inline-flex h-13 items-center rounded-sm bg-accent px-6.5 text-button text-on-accent hover:bg-accent-hover">Get introduced</a>
  </div>
</section>
```

### CSS custom properties

```css
@import "./tokens.css";

.section { background: var(--bg); color: var(--fg); padding-block: var(--section-y); }
.btn-primary { background: var(--accent); color: var(--on-accent); border-radius: var(--radius-sm); }
.btn-primary:hover { background: var(--accent-hover); box-shadow: 0 0 0 4px var(--accent-glow); }
```

### Design tokens

`tokens.json` follows the W3C Design Tokens Community Group format (2025.10): `color` (ramps), `brand` (aliases), `theme.green` and `theme.light` (role tokens), plus `font`, `typography`, `space`, `layout`, `radius`, `shadow`, `duration` and `easing`. Load it in Figma Tokens Studio or Style Dictionary to generate platform files.
