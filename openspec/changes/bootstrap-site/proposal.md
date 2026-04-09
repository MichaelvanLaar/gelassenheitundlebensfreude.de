## Why

The "Gelassenheit und Lebensfreude" project has 24 editorially finished German articles and a binding visual identity (logo, homepage and article screen designs, favicon set) but no working website. The owner wants a calm, ad-free, cookie-free, SEO-strong personal-development blog launched from scratch on an existing Caddy/VPS setup, with full content autonomy and zero third-party dependencies — something no off-the-shelf hosted platform satisfies. This change defines the first release: a complete, launch-ready site built from the requirements captured in `docs/requirements/REQUIREMENTS.md` v1.2.

## What Changes

- Introduce a Git-tracked project that turns the 24 Markdown articles under `docs/requirements/content/articles/` into a publicly reachable German website at `gelassenheitundlebensfreude.de`.
- Add a Homepage, four Category overview pages (_Gelassene Produktivität_, _Innere Stärke_, _Leichte Balance_, _Verbunden kommunizieren_), 24 Article detail pages, placeholder _Impressum_ and _Datenschutzerklärung_ pages, and a custom 404 page — all wired into a main navigation that is identical site-wide.
- Render each article with its full Markdown content, a unique landscape header image as a responsive CSS `background-image`, and a unique square teaser image used exclusively on Category pages.
- Establish a file-based content authoring workflow (no database) where the owner can add or edit articles, metadata, category intros and the homepage hero text without developer involvement; lorem-ipsum placeholders are acceptable for intro copy at launch.
- Ship a full SEO baseline: unique `<title>`/meta description per page, canonical URLs, Open Graph tags, JSON-LD `Article`/`BlogPosting` with `Organization` publisher (no dates, no person author), `sitemap.xml`, `robots.txt`, semantic HTML5 with a clean heading hierarchy.
- Enforce a strict privacy posture: HTTPS-only, no cookies, no third-party requests, no tracking, no CDN assets, no external fonts — enabling a cookie-banner-free site and a trivial Datenschutzerklärung.
- Define the visual system: Montserrat (self-hosted, Regular + Bold only), a color token set derived from the logo SVG and screen designs, and responsive layouts from 320 px to ≥ 1920 px meeting WCAG 2.1 AA.
- Add a reproducible local build + preview workflow, and a GitHub Actions pipeline that deploys the built static artefacts to the Caddy/VPS host, with a documented rollback-by-redeploy procedure. (The SSG-vs-Kirby decision — OQ-001 — is made in `design.md`.)
- Meet the performance budget: Lighthouse ≥ 95 across Performance, Accessibility, Best Practices, SEO on mobile and desktop; LCP ≤ 1.0 s on Mobile Slow 4G; typical article page ≤ 500 KB transfer; modern image formats with responsive `srcset` for `<img>` content.

## Capabilities

### New Capabilities

- `site-structure`: Page inventory, URL scheme, main navigation, legal placeholder pages, 404 handling and favicon integration for the whole site.
- `article-rendering`: Markdown-to-HTML rendering of article detail pages, header-image container behaviour, square teaser composition on Category pages, and optional reading-time / related-articles affordances.
- `content-authoring`: File-based content model, per-article metadata schema, category and homepage intro authoring, and the rules that let the owner publish without touching code.
- `seo-metadata`: Title/description, canonical URLs, Open Graph, JSON-LD structured data, `sitemap.xml`, `robots.txt`, and semantic HTML / heading-hierarchy rules.
- `privacy-and-security`: No-cookies / no-third-parties posture, HTTPS + TLS configuration, security headers, and GDPR data-minimisation guarantees that let the Datenschutzerklärung stay trivial.
- `performance-budget`: Lighthouse thresholds, LCP target, transfer-size ceiling, image-format and responsive-image rules, and the "no render-blocking foreign request" guarantee.
- `accessibility-and-responsive`: WCAG 2.1 AA conformance, responsive layout from 320 px to ≥ 1920 px, typography and contrast thresholds, keyboard navigability and focus styles.
- `visual-design-system`: Typography (Montserrat Regular + Bold, self-hosted), color tokens derived from the logo and screen designs, binding desktop screen designs and inferred mobile layouts, shared visual language between Homepage category tiles and Category-page teasers.
- `build-and-deploy`: Single Git repository, reproducible offline-capable local build, local preview workflow, GitHub Actions deployment to the Caddy/VPS host, and rollback by redeploying a prior build artefact.

### Modified Capabilities

_None — this is the initial release; no prior specs exist under `openspec/specs/`._

## Impact

- **New repository scaffolding**: build tool / SSG or flat-file CMS (decided in `design.md` — resolves OQ-001), templates, layouts, styles, content pipeline, asset pipeline for images and fonts.
- **Content migration**: import the 24 articles from `docs/requirements/content/articles/` into the authoring source format with metadata (title, category, slug, meta description, header-image path, square-teaser-image path) — source files themselves stay read-only per CON-006.
- **Assets**: wire in `docs/requirements/assets/logo-gelassenheitundlebensfreude.svg`, the favicon set under `docs/requirements/assets/favicon/`, self-hosted Montserrat Regular + Bold font files, and placeholder header/teaser images until the owner supplies final art (ASS-003).
- **CI/CD**: new GitHub Actions workflow with SSH/rsync (or equivalent) credentials to the VPS, and a Caddyfile configuration covering HTTPS, HSTS, CSP and the security headers from NFR-024.
- **Operational**: documented local build/preview commands, deploy trigger, and rollback procedure; Lighthouse and axe-core checks added to the verification workflow.
- **Deferred / out of scope (reaffirmed)**: analytics, cookie banner, comments, search, newsletter, RSS, multilingual content, final legal copy, and licensing of decorative imagery (owner's responsibility).
