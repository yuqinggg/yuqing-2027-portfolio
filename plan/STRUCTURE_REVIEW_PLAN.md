# Structure Review Plan — 2027 Portfolio

Goal: decide what this repo (forked from the 2023 site) should keep, fix, delete or restructure before new 2027 work goes on top of it. This plan is the review itself; it changes nothing.

## What's here today

```
/                     9 flat HTML pages (no build step needed to serve them)
css/                  style.css (405 lines), custom.css (447 lines)
js/custom.js          500 lines, jQuery-based (galleries, nav, preloader)
vendor/               bootstrap, jquery, jquery-easing (committed copies)
img/<project>/        per-project images (~65 MB total)
src/                  TypeScript component system (Navigation, BaseComponent) — not used by any page
plan/                 COMPONENT_REFACTOR_PLAN.md (2023-era refactor plan)
compress-images.js    tinify script (needs TINIFY key in .env)
```

## Already spotted (seed findings — confirm in the review)

| # | Finding | Where |
|---|---------|-------|
| 1 | Broken link: `project.html` doesn't exist | `index.html` |
| 2 | Missing images: `krisshop-australia-alignment.jpg`, `photo-1494253109108-2e30c049369b.jpg` | `krisshop-australia.html`, `project-101.html` |
| 3 | Orphan pages nobody links to: `project-101.html` (title says "Interlogue" — looks like a template), `studio_works.html` (standalone, own fonts/styles, 83 KB inline base64 fonts) | root |
| 4 | TS component system compiles to `dist/` but no HTML loads it → dead code today | `src/`, `tsconfig.json` |
| 5 | Existing refactor plan references files that don't exist (`css/tokens.css`) and proposes 7 components + JSON configs + `app.render()` shell — likely too heavy for 8 static pages | `plan/COMPONENT_REFACTOR_PLAN.md` |
| 6 | 36 MB of `.tif` files committed (3 files) — not web-servable | `img/interlogue/` |
| 7 | Misplaced file: a `.css` inside the JS folder | `vendor/bootstrap/js/bootstrap.min.css` |
| 8 | Inconsistent naming: `International-delivery.html` (capital I), `studio_works.html` (underscore), rest kebab-case. Matters on case-sensitive hosts. | root |
| 9 | Package still named `yuqing-2023-portfolio`, repo/homepage URLs point at the 2023 repo | `package.json` |
| 10 | Generic `<title>` on 3 pages (`about`, `index`, `miles-redemption`) | root |
| 11 | Every page loads isotope + line-awesome from third-party CDNs; maxcdn.icons8 is a legacy host | all pages |

## Review steps

### 1. Inventory & intent (15 min)
- For each page, mark: **keep / rewrite / drop** for 2027. Specifically decide the fate of `project-101.html` and `studio_works.html`.
- Decide what "2027 portfolio" means structurally: same static Bootstrap site refreshed, or new visual direction (studio_works suggests the latter).

### 2. Page-level structure (30 min)
- Diff the shared chrome across pages (head, nav, footer, preloader, script tags) to measure real duplication vs. what the old plan claims.
  `diff <(sed -n '1,60p' about.html) <(sed -n '1,60p' pps-voucher.html)`
- Check each project page follows the same section order (hero → metadata → body → gallery → next project).
- Note the `krisshop-australia.html` outlier (4 `<nav>` elements, 45 KB).

### 3. Links, assets, naming (20 min)
- Re-run the link + image existence check across all pages (findings 1–2) and fix or remove.
- List unreferenced images: anything in `img/` no page points to.
- Decide on one naming rule (kebab-case) and list the renames + the links each rename touches.

### 4. CSS & JS (30 min)
- Map which rules in `custom.css` / `style.css` are actually used; flag overlaps with Bootstrap.
- Read `js/custom.js`: list each feature (galleries ×3, nav, preloader, scroll), which pages use it, and whether jQuery + easing + isotope are still needed.
- Check Bootstrap version in `vendor/` and whether a CDN pin would be simpler than committed copies.

### 5. Build & tooling (15 min)
- Decide: keep the TS component system or delete `src/`, `tsconfig.json`, `typescript` dep. Simplest viable option for shared nav/footer on a static site is usually a tiny include script or a static-site generator, not a class hierarchy.
- Update `package.json` name/URLs; confirm `npm run compress` still works.

### 6. Weight & performance (15 min)
- Move `.tif` originals out of git (or convert to `.webp`/`.jpg`); check total page weight of the heaviest pages (`interlogue`, `miles-redemption`).
- Check images have `width`/`height` and `loading="lazy"` below the fold.

### 7. Basics that shouldn't regress (15 min)
- Unique `<title>` + meta description per page; `alt` text on images; nav usable on mobile and by keyboard.

## Output of the review
One ranked list in this folder (`plan/STRUCTURE_REVIEW_FINDINGS.md`), each item tagged **fix now / decide / later**, plus a revised (or retired) `COMPONENT_REFACTOR_PLAN.md`.
