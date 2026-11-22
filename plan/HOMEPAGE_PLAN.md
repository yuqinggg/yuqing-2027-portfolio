# Homepage Plan: 2027 Portfolio

Source: Figma `PLAYGROUND-2027-PORTFOLIO`, frame **"04 Project Shelves"** (node `2:2103`, 1470 px wide desktop frame).
Goal: replace `index.html` with the new dark homepage. This plan changes nothing yet.

## Decisions (answered 2026-11-22)

| Question | Answer |
|---|---|
| What sits below the headline | **Keep the old project grid** (5 cards) for now, restyled to sit on the dark page. Project shelves will replace it once they're designed. |
| Logo names | Star mark = **Star Alliance**. Hackathons: cube = **Cursor**, ring = **Monad** (updated 2026-11-22). |
| "Projects" pill target | Will link to a section on the page later. **No link for now.** |
| About page | **Leave `about.html` as it is** (old white look) and restyle it later. |
| Footer year | Static "2026", as in the design (default, not asked). |

## What the design contains

```
┌──────────────────────────────────────────────────────── 1470 ─┐
│ nav bar (76px, sticky, black→transparent + blur)  [Projects][About] │
│                                                                      │
│   Hi, I enjoy                                                        │
│   building things                                                    │
│   for work [SIA] [Star Alliance] [GovTech],                          │
│   for hackathons [Cursor] [Monad],                                   │
│   and for fun.                                                       │
│                                                                      │
│   ┌──────┐ ┌──────┐ ┌──────┐   ← old project grid (not in Figma,     │
│   └──────┘ └──────┘ └──────┘     kept on purpose; see step 4)        │
│ ──────────────────────────────────────────────────── (border)        │
│ 2026 © Made possible with Claude [✳]                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### Design values (from Figma)

| Token | Value |
|---|---|
| Page background | `#15140f` |
| Headline text | `#f2ede0`, Clash Display Regular, 96px / 96px line-height, letter-spacing -0.96px (-0.01em) |
| Footer text | `#b8b09b`, IBM Plex Mono Regular, 11px, letter-spacing 1.1px (0.1em) |
| Footer rule | 1px top border `#322e21`, 20px padding-top |
| Container | max-width 1400px, side padding 58.8px, bottom padding 90px, min-height 835px |
| Hero spacing | padding-top 133.6px (below the 76px nav), padding-bottom 40px; 56px gap to the next block |
| Nav bar | height 76px, `linear-gradient(to bottom, rgba(0,0,0,.8), transparent)`, `backdrop-filter: blur(12px)`, pills right-aligned |
| Nav pill | TikTok Sans 16px / 17.92px, padding 8px 12px, radius 999px, gap 8px |
| Pill, active | bg `#fff`, text `#000` ("Projects") |
| Pill, inactive | bg `#2a2a2a`, text `#c8c8c8` ("About") |
| Inline logos | 64px tall (80px for the GovTech box), 16px horizontal margin, 8px gap between items |

### Assets to download → `img/home/`

| Figma node | What | File | Size in design |
|---|---|---|---|
| `2:2149` | Singapore Airlines bird | `sia.svg` | 52×64 |
| `2:2153` | Star Alliance | `star-alliance.png` | 67×64 |
| `7:122` / `7:123` | GovTech logo: an 80×80 crop of a wider 834×333 image | `govtech.png` | 80×80 |
| `2:2161` | Cursor (cube) | `cursor.svg` | 56×64 |
| `2:2167` | Monad (ring) | `monad.svg` | 71×64 (includes its margin) |
| `7:177` | Claude mark (footer) | `claude.png` | 16×16 |

The Figma asset URLs expire after 7 days. Run `get_design_context` again on `2:2103` when the build starts and `curl -L` each asset into `img/home/` right away.

## Approach

**Plain HTML + one new CSS file. No Bootstrap, jQuery, isotope or TS component on this page.**

- The design is a new visual direction with nothing Bootstrap-shaped in it.
- The old grid currently needs jQuery + isotope (layout), `custom.js` (it swaps `data-img` into background images) and `style.css`/`custom.css` (card styles, plus body and font rules that would clash with the dark theme). Five cards in a CSS grid take about 25 lines of CSS, so it's smaller to rebuild them in `home.css` than to load and override the old stack.
- `src/Components/Navigation.ts` renders the old white Bootstrap navbar, and no page loads it. Don't use it here.
- The other project pages keep their current CSS untouched.

## Build steps

### 1. Fonts (15 min)
- **Clash Display**: free from Fontshare. Self-host `ClashDisplay-Regular.woff2` in `fonts/` with an `@font-face`.
- **IBM Plex Mono 400** and **TikTok Sans 400**: Google Fonts, one `<link>` with `display=swap`. Check that TikTok Sans is listed on Google Fonts. If it isn't, self-host it like Clash.
- Remove the Muli and line-awesome links from this page.

### 2. Assets (15 min)
- Download the 6 assets above into `img/home/` under the file names in the table.
- GovTech: export just the mark from Figma as its own 80×80 image. If that isn't possible, copy the crop in CSS (`overflow:hidden` box, `<img>` at 250% width, vertically centred).

### 3. `index.html` rewrite: nav, hero, footer (40 min)
Replace the file (the old version stays in git history). Structure:

```html
<header class="nav">
  <nav aria-label="Main">
    <!-- TODO: link to the projects section once it exists -->
    <span class="pill is-active" aria-current="page">Projects</span>
    <a class="pill" href="about.html">About</a>
  </nav>
</header>
<main class="container">
  <h1 class="hero">
    <span class="line">Hi, I enjoy</span>
    <span class="line">building things</span>
    <span class="line">for work
      <img src="img/home/sia.svg"           alt="Singapore Airlines" width="52" height="64">
      <img src="img/home/star-alliance.png" alt="Star Alliance"      width="67" height="64">
      <img src="img/home/govtech.png"       alt="GovTech"            width="80" height="80">,</span>
    <span class="line">for hackathons
      <img src="img/home/cursor.svg" alt="Cursor" width="56" height="64">
      <img src="img/home/monad.svg"  alt="Monad"  width="71" height="64">,</span>
    <span class="line">and for fun.</span>
  </h1>

  <section class="projects" aria-label="Projects"> …step 4… </section>
</main>
<footer class="container footer">
  2026 © Made possible with Claude <img src="img/home/claude.png" alt="" width="16" height="16">
</footer>
```

- "Projects" is a `<span>`, not a link, until the section link is decided. That keeps it out of the tab order instead of leaving a dead `href`.
- Write the headline as normal text. The Figma layers split some words oddly ("f" + "or work", "and fo" + "r fun."), and that split shouldn't go into the HTML.
- Keep the page `<title>`, meta description and canonical. Remove the duplicated meta tags in the current `<head>` (lines 9–19 repeat lines 5–8).

### 4. Project grid, carried over (30 min)
Move the 5 live cards from the old `index.html` (KrisShop Australia, Voucher Redemption, Miles Redemption, International Delivery, Interlogue). Leave out the commented-out "Solocademy" card, which points at the missing `project.html`.

```html
<a class="card" href="krisshop-australia.html" style="--hover: rgba(0,0,0,.77)">
  <img src="img/krisshop-australia/krisshop-australia-thumbnail.webp" alt="" loading="lazy" width="400" height="400">
  <span class="card-text"><span class="card-title">KrisShop Australia</span>
  <span class="card-cat">eCommerce & Loyalty Programme</span></span>
</a>
```

- Use a plain `<img>` (with `loading="lazy"`) in place of the `data-img` + JS background trick. Each card's hover colour moves into a `--hover` custom property.
- **Fix a broken link:** the old card points at `international-delivery.html`, but the file is `International-delivery.html`. That breaks on case-sensitive hosts (GitHub Pages, Netlify), so point at the real file name.
- CSS: `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px`. Images are `aspect-ratio: 1; object-fit: cover`. The text overlay fades in on `:hover` and `:focus-visible`, so keyboard users see titles too.
- Spacing: 56px above the grid (the design's hero→footer gap), 56px below it before the footer.

### 5. `css/home.css` (40 min)
- Put the token table above on `:root` as custom properties.
- `.nav`: `position: sticky; top: 0;` with gradient + blur, flex, `justify-content: flex-end`, height 76px, same side padding as the container.
- `.container`: `max-width: 1400px; margin: 0 auto; padding-inline: clamp(16px, 4vw, 58.8px)`.
- `.hero`: `font-size: clamp(44px, 6.5vw, 96px); line-height: 1; letter-spacing: -0.01em`. Each `.line` is `display: flex; align-items: center; gap: 8px; flex-wrap: wrap`.
- Hero logos: size them in `em` (`height: 0.667em`; `0.833em` for GovTech) with `margin-inline: 0.167em`, so they scale with the text.
- `.footer`: border-top, padding-top 20px, mono caption style, `display: flex; gap: 4px; align-items: center`.
- Pills: a `:hover` and `:focus-visible` state on the About link (small brightness change and a visible focus ring).

### 6. Verify (20 min)
- Open the page in the browser pane at 1470×~900 and compare the nav, hero and footer side by side with the Figma screenshot: line breaks, logo sizes and baselines.
- Check every asset: the file exists and isn't empty, and it renders at its design size (52×64, 67×64, 80×80, 56×64, 71×64, 16×16).
- Click all 5 cards: each opens its project page. International Delivery is the one to watch.
- Check 375px width: no horizontal scroll, the headline wraps cleanly, the grid drops to 1 column, pills stay tappable.
- Tab through the page: About and all 5 cards get a visible focus ring, and card titles show on focus.

**Total: about 2.5–3 hours.**

## Still open (doesn't block the build)
- **Contact links.** The old page ends with LinkedIn, email and the old Wix portfolio link. The Figma footer has only the credit line. The plan drops them; say if they should stay (for example, as a mono line above the footer rule).

## Out of scope
- Restyling `about.html` and the project pages.
- The "Projects" section link (waiting on the shelves design).
- Deciding the fate of Bootstrap, jQuery and `src/` site-wide (that's `STRUCTURE_REVIEW_PLAN.md`).
- Motion: the design has no motion data.
