## Context

`gelassenheitundlebensfreude.de` is a greenfield personal-development blog. The input material already exists: 24 Markdown articles under `docs/requirements/content/articles/`, a `categories-and-articles.csv` index, a binding Homepage and Article-page desktop screen design, a logo SVG, and a full favicon set. The requirements document (`docs/requirements/REQUIREMENTS.md` v1.2) imposes hard constraints that rule out most hosted or JavaScript-heavy options:

- No database, no CDN assets, no third-party runtime resources, no cookies, no tracking (CON-002..CON-005, NFR-022..NFR-025).
- Self-hosted Montserrat (Regular + Bold only) — no Google Fonts (CON-003, CON-011, NFR-040).
- Lighthouse ≥ 95 across all four categories on mobile and desktop, LCP ≤ 1.0 s on Slow 4G, typical article page ≤ 500 KB transfer (NFR-001..NFR-004).
- Build and preview run locally; deployment is automated via GitHub Actions pushing built artefacts to the existing Caddy/VPS host (CON-010, FR-024).
- WCAG 2.1 AA, responsive 320 px → 1920 px, semantic HTML5 (NFR-030..NFR-033, FR-037).

The sole unresolved strategic question coming out of the requirements phase is **OQ-001**: static site generator vs. flat-file CMS (Kirby). This design document resolves it and sets the remaining technical direction so that `specs/` and `tasks.md` can be derived mechanically.

## Goals / Non-Goals

**Goals:**

- Resolve OQ-001 so the implementation path is unambiguous.
- Choose a build tool, templating approach, asset pipeline and deployment mechanism that satisfy every "Must" requirement without adding third-party runtime dependencies.
- Define the content model (front matter schema, directory layout) so that FR-020..FR-023 can be specified and tasked without further debate.
- Define the styling and token strategy so that NFR-040..NFR-042 and the screen designs can be implemented consistently.
- Keep the moving parts small enough that the owner can maintain the site solo.

**Non-Goals:**

- Final colour token values (derived during implementation from the logo SVG and screen designs; specs will demand that they exist, not what they are).
- Final category intro and homepage hero copy (lorem ipsum is explicitly acceptable per FR-023 / OQ-006).
- Analytics, search, comments, RSS, newsletter, multi-language — all out of scope per §4.2 of REQUIREMENTS.
- Image production pipeline (owner supplies header and teaser images; placeholders used until then per ASS-003).
- CMS UI / Panel authoring flows — decided against, see Decisions.

## Decisions

### D-01 — Implementation path: SSG, not Kirby (resolves OQ-001)

**Decision:** Build the site as a **static site generator (SSG)** pipeline. Reject the Kirby / flat-file CMS alternative.

**Why:**

- CON-010 and FR-024 both describe "build + preview locally, deploy built artefacts via GitHub Actions". An SSG matches that model one-to-one; Kirby would require PHP running on the VPS, live rendering, and a fundamentally different deploy model (rsync source + runtime). The requirements doc itself flags FR-024 as needing re-scoping if Kirby were chosen.
- NFR-002 (Lighthouse ≥ 95 across the board, mobile + desktop) and NFR-001 (LCP ≤ 1.0 s) are dramatically easier to guarantee when every response is a static HTML file served by Caddy than when requests hit PHP-FPM.
- NFR-011 (rollback by redeploying a prior build artefact) is native to an SSG: every build is a self-contained bundle. With Kirby, rollback means restoring source + assets + configuration on the running server.
- NFR-051 (reproducible offline build once deps are installed) is a natural fit for an SSG; Kirby's Panel is network-driven by design.
- The owner is technically proficient and comfortable with Git + Markdown (ASS-001), removing the main reason to prefer a CMS UI.

**Alternatives considered:** Kirby with Panel served directly from the VPS. Rejected for the reasons above. The owner's familiarity with Kirby is acknowledged but does not outweigh the architectural fit of the SSG path.

### D-02 — SSG choice: Eleventy (11ty)

**Decision:** Use **Eleventy** as the static site generator, with **Nunjucks** as the primary template language.

**Why:**

- Node-based, widely used, active, and produces clean minimal HTML with zero client-side JavaScript by default — which is exactly what NFR-003 and NFR-005 require.
- Native first-class support for Markdown + front-matter, which maps directly to FR-021 (per-article metadata) with no plugins.
- Pagination and collection APIs map trivially to "four Category pages each listing their articles" (FR-003..FR-004) and to `sitemap.xml` generation (FR-033).
- Fast enough to hit NFR-052 (≤ 30 s full build) for a 30-page site with orders of magnitude to spare.
- No runtime framework, no hydration, no JS bundle — trivially satisfies NFR-005 ("no render-blocking foreign request") and helps NFR-003.
- Nunjucks is expressive enough for the layout primitives the screen designs demand (header, hero, category tiles, teaser cards, article header container with CSS background) without introducing a component framework.

**Alternatives considered:**

- **Hugo**: faster builds, but Go templates are more awkward for the layered partial layout the screen designs imply, and Node tooling integrates more naturally with the rest of the asset pipeline (D-04).
- **Astro**: excellent DX, but its component/island model is overkill for a site that ships zero JS, and its default output includes small runtime shims we would have to actively strip out to satisfy NFR-005 guarantees.
- **Plain make + Pandoc**: minimal dependencies but would require hand-writing collection, pagination and sitemap logic.

### D-03 — Content model and directory layout

**Decision:** Source articles live under `src/content/articles/` as Markdown with YAML front matter. `docs/requirements/content/articles/` stays **read-only input material** per CON-006 — the build step copies or symlinks it into `src/content/articles/` (or Eleventy reads directly from it via an input override). The canonical schema is:

```yaml
---
title: "…"                  # required — used in <h1>, <title>, OG, JSON-LD
category: "gelassene-produktivitaet" | "innere-staerke" | "leichte-balance" | "verbunden-kommunizieren"
slug: "…"                   # required — stable, kebab-case, becomes the URL path segment
metaDescription: "…"        # required — used in <meta description> and OG description
headerImage: "…"            # required — path relative to assets root, landscape
teaserImage: "…"            # required — path relative to assets root, square
excerpt: "…"                # optional — 100–200 chars, for Category page teasers (FR-014)
---
```

No `date`, no `author` — explicit per FR-032. Category intros and the homepage hero text live in their own editable content files (`src/content/categories/<slug>.md` and `src/content/home.md`), each with a single `intro` body; lorem ipsum at launch per FR-023.

URL scheme:

- `/` — Homepage
- `/<category-slug>/` — Category overview (e.g. `/gelassene-produktivitaet/`)
- `/<category-slug>/<article-slug>/` — Article detail (category-nested so category context is in the URL, improving orientation and SEO)
- `/impressum/`, `/datenschutz/` — placeholder legal pages
- `/404.html` — custom 404, served by Caddy via `handle_errors`

**Alternatives considered:** Flat article URLs (`/<slug>/`) — simpler but loses the category breadcrumb in the URL. Dated URLs — rejected, FR-032 forbids dates anywhere.

### D-04 — Styling and asset pipeline

**Decision:** Hand-written CSS organised around **CSS custom properties** (design tokens) at `:root`. No CSS framework, no Tailwind, no PostCSS plugins beyond `postcss-preset-env` for autoprefixing and minification. Single CSS bundle, inlined in `<head>` for pages above a small size threshold (to help NFR-001 LCP) or linked as a versioned file — decided during implementation by measuring.

Montserrat **Regular (400)** and **Bold (700)** are self-hosted as **WOFF2**, preloaded with `<link rel="preload" as="font" crossorigin>`, declared with `font-display: swap`. Exactly two font files on the wire (NFR-040).

Images:

- Header images: single landscape source per article in WebP (or AVIF), sized for the largest supported viewport, rendered as `background-image` via inline `style="--header-image:url(…)"` (FR-010, NFR-004).
- Teaser + inline decorative images: `<picture>` / `srcset` + `sizes` with WebP/AVIF (NFR-004). Generated at build time from a single source via `@11ty/eleventy-img` (Eleventy's official image plugin, runs offline, satisfies NFR-051).

Colour tokens are derived from the logo SVG and screen designs during implementation and committed to `src/styles/tokens.css`. Spec will require the tokens file to exist and to be the single source of all colour values.

**Alternatives considered:** Tailwind (too much tooling, class noise, doesn't match hand-crafted editorial aesthetic), Sass (unnecessary given modern CSS).

### D-05 — SEO, structured data, sitemap

**Decision:**

- Per-page `<title>` and `<meta name="description">` are derived from front matter in templates; Category and Homepage titles come from their content files.
- `<link rel="canonical">` is rendered by a shared `<head>` partial using Eleventy's `page.url`.
- Open Graph: `og:title`, `og:description`, `og:type`, `og:url`, `og:image` on every page; `og:image` is the article header image on article pages, the logo on other pages. No `article:published_time` (FR-032).
- JSON-LD `BlogPosting` on article pages with `headline`, `image` (header image absolute URL), `mainEntityOfPage`, and `author` + `publisher` set to the site as `Organization`. No date fields (FR-031, FR-032).
- `sitemap.xml` generated via an Eleventy template iterating `collections.all`, filtered to public pages.
- `robots.txt` is a static file with `Sitemap: https://gelassenheitundlebensfreude.de/sitemap.xml` and no `Disallow` rules.

### D-06 — Privacy and security at the edge

**Decision:** Caddy configuration enforces:

- HTTPS-only with automatic ACME, TLS 1.3 (1.2 fallback) — NFR-020, NFR-021.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy: default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`
  - `script-src 'none'` is deliberate: the site ships zero JavaScript.
  - `'unsafe-inline'` on `style-src` accommodates the inline `--header-image` custom property on article pages; revisit if a nonce-based approach becomes practical.
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()`
- `Cache-Control` tuned per asset type: HTML `public, max-age=0, must-revalidate`; immutable fingerprinted assets `public, max-age=31536000, immutable`.
- No `Set-Cookie` headers anywhere. Caddy access logs anonymise the client IP (drop or truncate last octet) to keep the Datenschutzerklärung trivial per NFR-025.

### D-07 — Deployment: GitHub Actions + rsync over SSH

**Decision:** A GitHub Actions workflow on `main` (and `workflow_dispatch`) runs `npm ci`, `npm run build`, then `rsync -a --delete` the `_site/` output to the VPS webroot over SSH using a deploy key stored as a repository secret. Caddy serves the directory directly. Rollback = redeploy a previous commit (`gh workflow run deploy.yml -f ref=<sha>` or a `git revert`).

Build artefacts are not committed; the workflow builds from source each run. The workflow also runs Lighthouse CI and axe-core against the built output (before upload) as a quality gate tied to NFR-002 and NFR-031.

**Alternatives considered:** Pushing via `scp`, using `rclone`, building on the VPS. Rejected — rsync is the simplest atomic-ish sync, and building in CI keeps the VPS minimal.

### D-08 — Repository layout

```
/
├─ .github/workflows/deploy.yml
├─ src/
│  ├─ _includes/         # Nunjucks layouts and partials
│  ├─ _data/             # site-wide data (site name, nav, categories)
│  ├─ content/
│  │  ├─ articles/       # 24 article .md files with front matter
│  │  ├─ categories/     # 4 category intro files
│  │  └─ home.md         # homepage hero content
│  ├─ styles/            # CSS incl. tokens.css
│  ├─ fonts/             # Montserrat WOFF2 Regular + Bold
│  ├─ assets/
│  │  ├─ logo.svg
│  │  ├─ favicon/        # copied from docs/requirements/assets/favicon/
│  │  └─ images/         # per-article header + teaser sources
│  ├─ impressum.md
│  ├─ datenschutz.md
│  └─ 404.md
├─ .eleventy.js          # Eleventy config (collections, filters, image plugin)
├─ package.json
├─ Caddyfile             # checked-in reference config for the VPS
├─ docs/requirements/    # unchanged, read-only input material (CON-006)
└─ openspec/             # this change + archived changes + specs
```

## Risks / Trade-offs

- **[Risk] Lighthouse ≥ 95 on _all four_ categories including Performance on mobile Slow 4G is aggressive.** → Mitigation: inline critical CSS where it helps, preload the two font files, serve images in AVIF with WebP fallback via `<picture>`, keep the article header image size-budgeted (~100–150 KB max), and run Lighthouse in CI so regressions fail the build.
- **[Risk] `'unsafe-inline'` in CSP weakens Mozilla Observatory grade.** → Mitigation: accept for first release (needed for per-article background-image custom property); document; revisit with a nonce pipeline or a pre-generated per-article CSS class once the site is stable.
- **[Risk] CSS `background-image` for header images loses `srcset`-style responsive art direction.** → Accepted per FR-010 / OQ-003 (owner explicitly chose this). Mitigation: use a single sufficiently large AVIF source per article and rely on `background-size: cover`.
- **[Risk] Deploy key on VPS is a blast-radius concern.** → Mitigation: dedicated deploy user with write access only to the webroot, key stored as a GitHub Actions secret, no sudo, key rotated annually.
- **[Risk] Owner may later want Panel-style editing.** → Mitigation: the chosen content model (Markdown + YAML front matter) is a superset of what most flat-file CMSes consume, so a future Kirby or Decap CMS layer can be added without re-authoring content.
- **[Risk] No feed / no search at launch could hurt return visits.** → Explicitly deferred in §4.2 of REQUIREMENTS; not this change's problem.
- **[Risk] Eleventy is a Node ecosystem dependency.** → Mitigation: `package-lock.json` pinned, `npm ci` in CI, offline-capable build after install (NFR-051).

## Migration Plan

This is a greenfield launch; there is nothing to migrate _from_. Rollout steps:

1. Land the scaffolding (Eleventy config, layouts, tokens, fonts, favicon) behind no domain.
2. Import the 24 articles and generate placeholder header + teaser images.
3. Run Lighthouse and axe-core locally; iterate until the budgets in NFR-001..NFR-004 and NFR-031 are met.
4. Stand up the GitHub Actions deploy workflow against a disposable path on the VPS; verify the rsync + Caddy reload cycle.
5. Point DNS (ASS-005) at the VPS, enable HTTPS via Caddy ACME, flip the webroot to the real path.
6. Verify the fit criteria from REQUIREMENTS §2.3 — all 24 article URLs reachable, Lighthouse ≥ 95 across the board, zero third-party network requests, zero cookies.

Rollback: re-run the deploy workflow on the previous green commit (NFR-011). Because every deploy is a full static bundle, rollback is a content swap, not a data migration.

## Open Questions

- **OQ-001 is resolved by D-01** (SSG path chosen). No further open strategic questions remain from REQUIREMENTS §9.
- Implementation-level questions deferred to tasks: exact colour token values (derived from logo/screen designs), whether CSS is inlined or linked (decided by measurement against NFR-001), choice of AVIF vs WebP as primary format (decided by measurement against NFR-003), final CSP nonce strategy for the header-image inline style.
