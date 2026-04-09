# Requirements Document: gelassenheitundlebensfreude.de

**Version**: 1.2
**Date**: 2026-04-09
**Status**: Draft
**Language note**: This document is written in English for downstream tooling (Claude Code plan mode, OpenSpec). The website itself, all published content, UI labels, and category names remain in German. German terms that are part of the project data (category names, file paths, content excerpts) are kept verbatim.

---

## 1. Document Purpose

This document captures the requirements for the "Gelassenheit und Lebensfreude" website in its first release. It describes **what** the system must do and **which quality properties** it must exhibit, without prescribing concrete implementation choices (CMS product, static site generator, hosting automation). Those belong in the subsequent planning and design phase.

This document is the recommended input for Claude Code plan mode and for OpenSpec.

---

## 2. Business Context

### 2.1 Problem Statement

The owner wants to launch a German-language personal-development blog covering mindfulness, productivity, inner strength and communication. The goal is to build organic reach through SEO-optimised articles and to offer readers a calm, ad-free environment. There is no pre-existing infrastructure; the site is built from scratch and hosted with Caddy on a personal VPS.

### 2.2 Business Goals

- **BG-01**: Publish a content-focused website with ≥ 24 editorially prepared articles grouped into four thematic categories.
- **BG-02**: Maximise organic discoverability through rigorous SEO best practices.
- **BG-03**: Minimise legal and administrative overhead by avoiding cookies, third-party requests and tracking entirely (no cookie banner required).
- **BG-04**: Give the owner full content autonomy — articles and images must be editable without developer support.
- **BG-05**: Deliver excellent performance and usability across devices, with no operating cost beyond the existing VPS.

### 2.3 Success Criteria

- All 24 articles from `docs/requirements/content/articles/` are reachable via the live site, correctly assigned to one of the four categories and have stable, crawlable URLs.
- Lighthouse (mobile and desktop) reports a score ≥ 95 in all four categories — Performance, Accessibility, Best Practices, SEO — for the Homepage, a Category page and an Article page.
- The Privacy Policy can be written without any sections about cookies, third-party services, CDN resources or tracking technologies.
- The owner can publish a new article end-to-end (including images) without developer involvement and without touching anything but content files.
- Browser DevTools confirm, for every page type, that the site issues zero network requests to foreign domains and sets zero cookies.

---

## 3. Stakeholders and Users

| Role                                     | Description                                                                                     | Primary Needs                                                                                                           |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Owner / Author**                       | Michael van Laar. Owns the project, maintains all content and images, technically proficient.   | Easy content editing without a database; reproducible, understandable publishing workflow; local preview before deploy. |
| **Reader**                               | German-speaking adult interested in personal development, arriving mostly from Google searches. | Fast loading, legible typography on mobile and desktop, clear category navigation, ad-free and banner-free reading.     |
| **Search-engine crawler**                | Googlebot and peers.                                                                            | Clean semantic HTML, consistent URLs, sitemap, structured data, fast responses.                                         |
| **Data-protection authority** (indirect) | GDPR as the legal framework.                                                                    | Transparent, data-minimising processing without tracking.                                                               |

---

## 4. Scope

### 4.1 In Scope (first release)

- Static, publicly accessible website under the domain `gelassenheitundlebensfreude.de`.
- Homepage introducing the project and leading into the four categories (per provided screen design).
- Four Category overview pages, each with an intro text and teasers for that category's articles.
- 24 Article detail pages sourced from the Markdown files in `docs/requirements/content/articles/`.
- Main navigation with exactly the four categories, in this order: _Gelassene Produktivität_, _Innere Stärke_, _Leichte Balance_, _Verbunden kommunizieren_.
- Placeholder pages (site layout and title, filler body copy) for **Impressum** (legal notice) and **Datenschutzerklärung** (privacy policy) — the owner will supply the final copy.
- Logo integration using `docs/requirements/assets/logo-gelassenheitundlebensfreude.svg` in the page header.
- Per-article **header image** (landscape), rendered as a responsive CSS background on a container at the top of the article detail page (auto-cropped by the browser per viewport width).
- Per-article **square teaser image**, used exclusively on the Category overview pages. The Homepage does _not_ show article teasers — only the four category tiles.
- Self-hosted web fonts (no CDN requests).
- Responsive design covering mobile, tablet and desktop viewports.
- Favicon / web-app-manifest integration from the existing asset set at `docs/requirements/assets/favicon/`.
- SEO baseline: semantic HTML, meta tags, Open Graph, JSON-LD structured data, `sitemap.xml`, `robots.txt`, canonical URLs.
- Content workflow without a database — either a flat-file CMS (e.g. Kirby with its Panel) or a static site generator; the decision is deferred to planning.
- Deployment to the owner's existing VPS served by Caddy.

### 4.2 Out of Scope (first release)

- Any web analytics or tracking, even cookieless variants (explicitly deferred).
- Cookie banner / consent management (unnecessary because no cookies are set).
- Comments, forums, ratings or other user-generated content.
- Newsletter signup, contact form, on-site search.
- User accounts, login, personalised content.
- Any CDN-hosted asset, external library, external web font, embedded social widget, embedded video, third-party iframe.
- Multilingual content — the site is German only.
- Full-text search.
- RSS / Atom feed (deferred to a later release).
- Multi-user editorial workflow — only the owner edits content.
- Final wording of the legal notice and privacy policy (owner supplies).
- Sourcing and licensing of decorative article images (owner's responsibility).

---

## 5. Functional Requirements

Priorities: **Must** (launch-critical) | **Should** (important, deferrable) | **Could** (nice-to-have) | **Won't** (explicitly excluded)

### 5.1 Site Structure and Navigation

**FR-001** [Must]
The system shall serve a Homepage at the root path `/` that introduces the project and prominently presents the four categories.
_Rationale_: Entry point for new readers; anchor for the visual identity defined by the screen design.
_Fit criterion_: Requesting `https://gelassenheitundlebensfreude.de/` returns a page that visibly contains all four category names and matches the layout of `docs/requirements/screendesign/screendesign-homepage-in-desktop-viewport.png`.

**FR-002** [Must]
The system shall expose, in the main navigation on every page, exactly the four categories _Gelassene Produktivität_, _Innere Stärke_, _Leichte Balance_ and _Verbunden kommunizieren_, in that order.
_Rationale_: Consistent orientation across the whole site.
_Fit criterion_: Automated inspection of every rendered page shows the main navigation contains these four links with these exact labels in the specified order, and no others.

**FR-003** [Must]
The system shall provide a dedicated Category overview page for each of the four categories under a speaking, kebab-case URL path (e.g. `/gelassene-produktivitaet/`).
_Rationale_: SEO-friendly, stable per-topic entry points.
_Fit criterion_: Each of the four category URLs returns HTTP 200 and lists only articles assigned to that category in `categories-and-articles.csv`.

**FR-004** [Must]
Each Category overview page shall contain an introductory text followed by a complete list of article teasers for every article assigned to the category.
_Rationale_: Expected content structure.
_Fit criterion_: Each category overview page shows exactly as many article teasers as there are articles assigned to that category in `categories-and-articles.csv`.

**FR-005** [Must]
The system shall provide an Article detail page for every Markdown file under `docs/requirements/content/articles/`, reachable via a stable, SEO-friendly URL.
_Rationale_: These articles are the primary content of the first release.
_Fit criterion_: All 24 source files have a corresponding detail page reachable via its URL, and these URLs do not change after the first release.

**FR-006** [Must]
Each Article detail page shall render the full Markdown content of its source file, preserving headings, paragraphs, lists, emphasis, and links.
_Rationale_: Editorial content must be transported without loss.
_Fit criterion_: A spot check of at least three rendered articles shows every Markdown element present and correctly mapped to HTML compared to the source.

**FR-007** [Must]
The system shall provide a legal notice (Impressum) at a stable URL (e.g. `/impressum/`), linked from every page's footer.
_Rationale_: Legal obligation under § 5 TMG / DDG.
_Fit criterion_: The footer link is present on every page; the Impressum URL returns HTTP 200 and contains a heading identifying the page as Impressum. Placeholder body copy is sufficient.

**FR-008** [Must]
The system shall provide a privacy policy (Datenschutzerklärung) at a stable URL (e.g. `/datenschutz/`), linked from every page's footer.
_Rationale_: Legal obligation under Art. 13 GDPR.
_Fit criterion_: The footer link is present on every page; the Datenschutz URL returns HTTP 200. Placeholder body copy is sufficient.

**FR-009** [Must]
On an unknown URL, the system shall return HTTP 404 with a user-friendly error page containing the main navigation and a link back to the Homepage.
_Rationale_: Graceful handling of typos, broken links and outdated external references; SEO signal.
_Fit criterion_: Requesting an arbitrary nonsense path returns HTTP 404 and a page with a working main navigation and a Homepage link.

**FR-009a** [Must]
The system shall embed the favicon asset set located in `docs/requirements/assets/favicon/` — including `favicon.ico`, `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`, `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png` and `site.webmanifest` — referenced with the correct `<link>` and `<meta>` tags on every page.
_Rationale_: Branding consistency across browsers and installed web-app contexts.
_Fit criterion_: Browser DevTools shows a favicon on every page; the webmanifest is reachable and validates without errors.

### 5.2 Articles, Teasers, Imagery

**FR-010** [Must]
Each article shall have a dedicated **landscape header image**, placed as the CSS `background-image` of a dedicated header container at the top of its detail page. The container shall crop the image responsively per viewport width (via `background-size: cover` or equivalent), so that a single image file per article suffices for all viewport sizes.
_Rationale_: Visual impact and individual recognisability of each article; the owner specified CSS-background responsive cropping instead of a standard `<img>` + `srcset` approach.
_Fit criterion_: Each of the 24 articles is associated with its own header image file; on the article detail page the header container shows the image as a CSS background, correctly cropped and filling the container at viewport widths 320, 768 and 1440 px; no two articles share the same header image in production content.

**FR-011** [Must]
Each article shall additionally have a dedicated **square teaser image**, used exclusively on the Category overview pages to represent the article in the category listing. The square teaser image shall not be used on the Homepage (which only shows the four category tiles) nor on the Article detail page.
_Rationale_: The owner requested that teaser imagery appear only on Category pages. The Homepage uses its own category tile visuals, not per-article teasers.
_Fit criterion_: Each of the 24 articles is associated with its own square image file distinct from its header image; the square teaser image is present on the article's Category page listing and nowhere else on the site.

**FR-012** [Must]
An article teaser on a Category page shall contain, at minimum, the article's square teaser image, its title and a link to the detail page.
_Rationale_: Minimum information needed for readers to decide and navigate.
_Fit criterion_: Every teaser on every Category page contains these three elements; clicking any part of the teaser navigates to the correct detail page.

**FR-013** [Must]
Article teasers on Category pages shall follow the same visual language as the four category tiles on the Homepage (layout, shape, typography, spacing).
_Rationale_: The owner requested visual consistency between Homepage category tiles and Category-page teasers, so the square teaser format mirrors the square category tiles.
_Fit criterion_: A side-by-side visual review of a Category page and the Homepage shows matching tile shape, image aspect ratio, typography and spacing for teaser/tile elements.

**FR-014** [Should]
An article teaser on a Category page should additionally contain a short descriptive excerpt (e.g. the meta description or the opening sentences), 100–200 characters long.
_Rationale_: Increases click-through rate and reader orientation.
_Fit criterion_: On Category pages, every teaser contains an excerpt within the defined length.

**FR-015** [Must]
The Article detail page shall visually match `docs/requirements/screendesign/screen-design-article-page-in-desktop-viewport.png` in desktop view (layout, typographic hierarchy, spacing, header-image placement, logo placement).
_Rationale_: The owner's provided screen design is binding.
_Fit criterion_: A side-by-side comparison of a sample article page against the screen design shows matching layout, typographic hierarchy and positioning.

**FR-016** [Should]
Each Article detail page should display an estimated reading time or word count near the title.
_Rationale_: Common orientation aid in blog layouts.
_Fit criterion_: A reading-time or word-count indicator is visible on the article page near the title.

**FR-017** [Could]
The Article detail page may offer 2–4 "related articles" at the end, ideally from the same category.
_Rationale_: Supports dwell time and internal linking.
_Fit criterion_: At the bottom of an article page, 2–4 teaser-style links to other articles are rendered.

### 5.3 Content Authoring Workflow

**FR-020** [Must]
The system shall be built in a way that lets the owner add or edit articles without developer involvement and without any database operations — either through a file-based workflow (Markdown + images committed to the repository) or through a no-database CMS backend such as Kirby Panel.
_Rationale_: Content autonomy is a core business goal; the owner is experienced with Kirby but open to alternatives.
_Fit criterion_: A previously unknown test article becomes published on the site after it is added through the chosen authoring workflow, without changing any code and without any database operation.

**FR-021** [Must]
Each article shall carry metadata covering at minimum: title, category, slug / URL path, meta description, header-image path and square-teaser-image path. Metadata shall live alongside the article content in the authoring source (e.g. Markdown front matter or a Kirby content file).
_Rationale_: Required for SEO, teasers and category assignment without a database.
_Fit criterion_: Every article source exposes all listed metadata fields; changing any field is reflected in the rendered site after rebuild.

**FR-022** [Should]
The authoring workflow should let the owner embed decorative images inside article bodies through standard Markdown image references (or the CMS equivalent), with image files stored in the project's asset location.
_Rationale_: The owner wants to illustrate each article independently.
_Fit criterion_: An article containing at least two inline image references renders both images scaled correctly and with alt text.

**FR-023** [Must]
Each Category shall carry an intro text, and the Homepage shall carry a hero / intro text, both authored by the owner and editable without code changes. For the first release, placeholder filler text (lorem ipsum) is acceptable for all of these; the owner will supply and replace the final copy later and does not consider it blocking for the build.
_Rationale_: Category pages and the Homepage need editorial openings; the owner explicitly asked for lorem ipsum placeholders and will write the final copy later.
_Fit criterion_: Each of the four Category pages renders an intro text sourced from an editable content file; the Homepage renders a hero / intro text sourced from an editable content file; initial content may be lorem ipsum.

**FR-024** [Must]
The publishing pipeline shall support a **local build + local preview** step before deployment. The deployment to the production VPS shall be automated via a GitHub Action that uploads the rendered static output to the server.
_Rationale_: The owner wants to verify the result locally before going live, and wants deployment to be automated without manual server operations.
_Fit criterion_: Documented commands run locally produce a working preview; a push (or manual trigger) on the main branch causes the GitHub Action to deploy the current build to the VPS without manual server access.
_Note_: If the chosen solution is a CMS backend like Kirby Panel where the live site is served dynamically, this requirement may be re-scoped to reflect that authoring model. See OQ-001.

### 5.4 SEO and Machine Readability

**FR-030** [Must]
Every page shall carry a unique, descriptive `<title>` and a unique `meta description` in the HTML head.
_Rationale_: Baseline SEO.
_Fit criterion_: An automated scan of all URLs shows 100% coverage with unique titles and descriptions, no duplicates.

**FR-031** [Must]
Each article page shall embed JSON-LD structured data of type `Article` (or `BlogPosting`) containing at minimum headline, image (the header image), mainEntityOfPage, and an `author` and `publisher` set to the website as an `Organization` (not a natural person). No `datePublished` or `dateModified` is rendered — see FR-032.
_Rationale_: Eligibility for Google rich results. Because the owner chose not to display dates or an author name, the structured data reflects that choice.
_Fit criterion_: Google Rich Results Test validates structured data on three sample article pages with no errors; no `datePublished`, `dateModified`, or person-typed author is present.

**FR-032** [Must]
The system shall not render article publication dates, "last updated" dates, or author names in user-visible content or metadata (e.g. no OG `article:published_time`).
_Rationale_: The owner explicitly wants the content to appear timelessly relevant and not tied to a specific author.
_Fit criterion_: Inspection of all article pages and their metadata shows no publication date, no update date and no author name in visible copy, head tags or structured data.

**FR-033** [Must]
The system shall provide an up-to-date `sitemap.xml` at `/sitemap.xml` listing every publicly reachable page (Homepage, 4 categories, 24 articles, Impressum, Datenschutz).
_Rationale_: Supports crawling efficiency.
_Fit criterion_: The sitemap is reachable, is XML-valid and contains every expected URL.

**FR-034** [Must]
The system shall provide a `robots.txt` at `/robots.txt` that references the sitemap URL and allows crawling of all public content by default.
_Rationale_: Crawl control and sitemap discovery.
_Fit criterion_: The file is reachable, contains a `Sitemap:` entry and no global `Disallow` rules.

**FR-035** [Must]
Every page shall declare a canonical URL via `<link rel="canonical">` in the head, pointing at itself.
_Rationale_: Prevents duplicate-content issues.
_Fit criterion_: Automated scan shows every page exposes a `canonical` link pointing to the same URL.

**FR-036** [Must]
Every page shall expose Open Graph metadata (at minimum `og:title`, `og:description`, `og:type`, `og:url`, `og:image`) in the head so that messenger and social-network previews render correctly.
_Rationale_: Standard link-sharing experience.
_Fit criterion_: A Facebook sharing debugger (or equivalent validator) shows correct previews for sample pages without warnings.

**FR-037** [Should]
The system should use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`) with a correct heading hierarchy starting at `<h1>` and no skipped levels.
_Rationale_: Accessibility and SEO.
_Fit criterion_: An HTML/accessibility validator reports a valid heading hierarchy with no skipped levels on sample pages.

---

## 6. Non-Functional Requirements

### 6.1 Performance

**NFR-001** [Must]
The system shall deliver every HTML page with a Largest Contentful Paint (LCP) ≤ 1.0 s on a Lighthouse "Mobile Slow 4G" profile.
_Fit criterion_: Lighthouse run (CLI or DevTools) reports LCP ≤ 1.0 s for Homepage, a Category page and an Article page.

**NFR-002** [Must]
The system shall achieve Lighthouse scores ≥ 95 in _Performance_, _Accessibility_, _Best Practices_ and _SEO_, on both mobile and desktop profiles.
_Fit criterion_: Lighthouse reports show ≥ 95 in all four categories for Homepage, a Category page and an Article page on both profiles.

**NFR-003** [Must]
The total transfer size of a typical article page (HTML + CSS + fonts + header image, without additional inline images) shall be ≤ 500 KB.
_Fit criterion_: Chrome DevTools Network panel shows the sum of transferred bytes below the threshold on a clean load.

**NFR-004** [Must]
Images shall be served in a modern format (WebP or AVIF). Content images rendered through `<img>` (square teaser images, decorative in-article images) shall provide responsive sizes via `<picture>` or `srcset`/`sizes`. The per-article landscape header image is exempt from `srcset` because it is rendered as a CSS `background-image` and cropped responsively by the browser (see FR-010); a single, sufficiently large source file per article is acceptable here.
_Fit criterion_: Every content `<img>` on rendered pages uses a modern image format and carries responsive attributes. The article header background image uses a modern format and a file size appropriate for the largest supported viewport.

**NFR-005** [Must]
The system shall not issue any render-blocking request to a foreign domain.
_Fit criterion_: DevTools Network panel shows zero outbound requests to any domain other than `gelassenheitundlebensfreude.de` on first load of any page.

### 6.2 Availability & Reliability

**NFR-010** [Should]
The system should achieve ≥ 99.5% monthly availability, subject to the availability of the underlying VPS.
_Fit criterion_: External uptime monitoring (if configured) reports ≤ 3.6 hours of unplanned downtime per month. [ASSUMPTION — reconcile with VPS SLA.]

**NFR-011** [Must]
Because the deployed site consists of static artefacts, the system shall support rolling back to a previous deployed state without data loss by redeploying a prior build artefact.
_Fit criterion_: The rollback procedure is documented and successfully executed once in practice.

### 6.3 Security & Privacy

**NFR-020** [Must]
The system shall be reachable only via HTTPS; HTTP requests shall be redirected to HTTPS with HTTP 301.
_Fit criterion_: `curl -I http://gelassenheitundlebensfreude.de/` returns HTTP 301 with a `Location:` header pointing to `https://…`.

**NFR-021** [Must]
The system shall serve HTTPS with TLS 1.3 (at minimum TLS 1.2).
_Fit criterion_: SSL Labs / testssl.sh reports at least grade A with TLS 1.2+ support.

**NFR-022** [Must]
The system shall not set any HTTP cookies — neither first-party nor third-party.
_Fit criterion_: Inspection of response headers and of `document.cookie` on every page type yields no cookies.

**NFR-023** [Must]
The system shall not load any resource (script, style, font, image, iframe, tracking pixel) from a third-party domain.
_Fit criterion_: An automated scan (e.g. `webbkoll.dataskydd.net` or Lighthouse) reports zero external connections.

**NFR-024** [Should]
The system should set security-related HTTP headers: tight `Content-Security-Policy` (self-only), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`.
_Fit criterion_: Mozilla Observatory / securityheaders.com awards at least grade A.

**NFR-025** [Must]
The system shall be GDPR-compliant through data minimisation: no personal data is processed beyond what is technically required to deliver the page (HTTP request metadata in server logs).
_Fit criterion_: The privacy policy (written by the owner, out of scope for this project) can be written without sections on cookies, tracking or third parties.

### 6.4 Usability & Accessibility

**NFR-030** [Must]
The system shall render on viewport widths from 320 px to ≥ 1920 px without horizontal scrolling or content overlap.
_Fit criterion_: Visual inspection at widths 320, 375, 768, 1024, 1440 and 1920 px shows no overflow or layout defects.

**NFR-031** [Must]
The system shall meet WCAG 2.1 Level AA.
_Fit criterion_: An axe-core scan (or equivalent) reports zero violations on Homepage, a Category page and an Article page.

**NFR-032** [Must]
Body text shall be comfortably readable on mobile without zooming: body font size ≥ 16 px, contrast ratio ≥ 4.5:1.
_Fit criterion_: Inspection of computed styles and Lighthouse accessibility report confirm the thresholds.

**NFR-033** [Should]
The system should be fully keyboard-navigable with visible focus styles.
_Fit criterion_: Manual tab traversal of main pages reaches every interactive element with a visible focus indicator at each step.

### 6.5 Visual Design & Typography

**NFR-040** [Must]
The site shall use **Montserrat** (self-hosted) as the single typeface for both body text and headings. Only **Regular (400)** and **Bold (700)** weights shall be loaded — no italic, no additional weights.
_Rationale_: Montserrat is already used in the project logo; a single typeface with two weights keeps font payload small and consistent.
_Fit criterion_: The network panel shows exactly two self-hosted Montserrat font files being requested from the site's own domain; no other web fonts are loaded.

**NFR-041** [Must]
The colour palette shall be derived from the logo SVG (`docs/requirements/assets/logo-gelassenheitundlebensfreude.svg`) and the provided screen designs, and documented as a reusable token set (CSS custom properties or equivalent).
_Fit criterion_: A design-tokens file exists listing the colour palette; every colour in the rendered CSS resolves to a token defined in that file.

**NFR-042** [Should]
The mobile layout should be derived consistently from the provided desktop screen designs; screen designs for narrower viewports do not exist and must be inferred in good faith.
_Fit criterion_: Owner review of the mobile layout for Homepage, a Category page and an Article page confirms that the derived mobile design preserves the intent of the desktop screen designs.

### 6.6 Maintainability & Operability

**NFR-050** [Must]
Code, content and the build definition shall live in a single Git repository.
_Fit criterion_: A fresh clone, after documented setup, allows a local build to complete successfully.

**NFR-051** [Must]
The build process shall be reproducible locally and shall not require internet access to third-party resources at build time once dependencies are installed.
_Fit criterion_: A local build without network access produces byte-identical static artefacts to one with network access (aside from timestamps).

**NFR-052** [Should]
A full build of the current site should complete on average development hardware in ≤ 30 seconds.
_Fit criterion_: Timing the build command from a cold cache yields a value below the threshold.

**NFR-053** [Should]
The project should include a linter / formatter setup that enforces consistent formatting via a single documented command.
_Fit criterion_: Running the documented format / lint command on a clean checkout exits with zero warnings.

### 6.7 Compatibility

**NFR-060** [Must]
The site shall render and function correctly in current versions of Chrome, Firefox, Safari (including iOS Safari) and Edge.
_Fit criterion_: Manual visual review on all four desktop browsers plus iOS Safari (current iOS) shows correct rendering and working navigation.

**NFR-061** [Should]
The site should work in browser versions no older than 24 months. Older browsers are not explicitly supported.
_Fit criterion_: Caniuse check for the CSS/JS features in use confirms ≥ 95% global browser support.

---

## 7. Constraints

| ID      | Constraint                                                                                                                                                                                                 | Source            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| CON-001 | Production hosting is **Caddy** on the owner's existing personal VPS.                                                                                                                                      | Owner             |
| CON-002 | No database — content is stored in files (flat-file CMS _or_ static site generator).                                                                                                                       | Owner             |
| CON-003 | No CDN-hosted assets, no external libraries, no Google Fonts, no third-party runtime resources whatsoever.                                                                                                 | Owner             |
| CON-004 | No cookies may be set.                                                                                                                                                                                     | Owner             |
| CON-005 | The site is German-language only and must be GDPR-compliant.                                                                                                                                               | Owner / legal     |
| CON-006 | Article sources in `docs/requirements/content/articles/` are input material and must not be modified; any transformation happens in the build.                                                             | Project CLAUDE.md |
| CON-007 | The logo is provided as a single SVG at `docs/requirements/assets/logo-gelassenheitundlebensfreude.svg`.                                                                                                   | Owner             |
| CON-008 | Desktop screen designs in `docs/requirements/screendesign/` are binding for Homepage and Article page layouts.                                                                                             | Owner             |
| CON-009 | The favicon asset set under `docs/requirements/assets/favicon/` (generated with realfavicongenerator.net) is the canonical favicon source.                                                                 | Owner             |
| CON-010 | Deployment model: build and preview run **locally**; the deployment itself is automated via **GitHub Actions** pushing built artefacts to the VPS. (Applies to the SSG path; see OQ-001 for the CMS path.) | Owner             |
| CON-011 | Primary typeface is **Montserrat**, self-hosted, **Regular and Bold only** — no italic, no further weights.                                                                                                | Owner             |
| CON-012 | The Homepage and Article page designs already exist; the Category page design must be derived in the same visual language (tile / card / teaser style matching the Homepage category tiles).               | Owner             |

---

## 8. Assumptions

| ID      | Assumption                                                                                                                                      | Impact if wrong                                                                                |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| ASS-001 | The owner is comfortable with Git and Markdown, and with either a Kirby Panel UI or a command-line build workflow.                              | Otherwise a more accessible editing UI would need to be added to scope.                        |
| ASS-002 | The 24 article Markdown files reflect the final textual content; edits during implementation are minor and not structural.                      | Structural edits would affect parser logic and metadata handling.                              |
| ASS-003 | Per-article header images and per-article square teaser images will be supplied by the owner; until then, placeholder assets are acceptable.    | Without a placeholder strategy, launch would be blocked on image production.                   |
| ASS-004 | The VPS has sufficient disk and CPU to host a static site and to receive GitHub Action deployments (or to run Kirby, if that path is chosen).   | Hosting model would need to change.                                                            |
| ASS-005 | The domain `gelassenheitundlebensfreude.de` is registered and DNS points to the VPS (or will by launch).                                        | Additional administrative step before launch.                                                  |
| ASS-006 | There are no existing URLs from a predecessor site that need redirecting.                                                                       | Otherwise a redirect map would be required.                                                    |
| ASS-007 | The owner handles licensing and rights for all images supplied to the site.                                                                     | Otherwise an asset-rights workflow would become part of scope.                                 |
| ASS-008 | Default values for cache TTL, log retention etc. are decided during the design phase and must be chosen GDPR-compatibly.                        | Wrong defaults could force privacy-policy changes post-launch.                                 |
| ASS-009 | Category introduction texts will be supplied by the owner before launch; placeholder filler text is acceptable during implementation.           | Otherwise launch would be blocked on copy.                                                     |
| ASS-010 | Square teaser images and landscape header images are provided by the owner; the build pipeline only needs to reference them, not generate them. | If generation from a single source is expected, the build would need image-processing tooling. |

---

## 9. Open Questions

| ID     | Question                                                                                                                                                                                                    | Owner            | Due         |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----------- |
| OQ-001 | Is the chosen implementation path an SSG (e.g. Eleventy, Hugo, Astro) with local build + GitHub Action deployment, or Kirby with Panel served directly from the VPS? The choice affects FR-024 and CON-010. | Owner / planning | in planning |

### 9.1 Resolved During Elicitation

The following questions were raised in earlier drafts and have been answered by the owner; they are kept here as a decision record.

| ID     | Question                                                      | Resolution                                                                                                                                                             |
| ------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OQ-002 | Usage surfaces of the square teaser image.                    | **Category pages only.** Not used on the Homepage (which shows only the four category tiles) nor on the Article detail page. See FR-011.                               |
| OQ-003 | Responsive behaviour of the article header image.             | Rendered as a **CSS `background-image`** on a container, cropped responsively by the browser per viewport width. One source file per article suffices. See FR-010.     |
| OQ-004 | On-site staging environment on a subdomain.                   | **Not needed.** Local preview + automated production deployment is the permanent model.                                                                                |
| OQ-005 | Log retention / IP handling in Caddy logs for privacy policy. | **Out of scope for this project.** The owner will write the privacy policy and will decide log retention separately.                                                   |
| OQ-006 | Homepage hero text authoring.                                 | **Lorem ipsum placeholder** is acceptable for the first release. The owner will replace it with final copy later and does not consider it blocking. Covered by FR-023. |

---

## 10. Glossary

| Term                        | Definition                                                                                                                                                                                    |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Article                     | An editorially written, SEO-optimised German text from `docs/requirements/content/articles/`, assigned to exactly one category.                                                               |
| Category                    | One of the four topic groups: _Gelassene Produktivität_, _Innere Stärke_, _Leichte Balance_, _Verbunden kommunizieren_.                                                                       |
| Teaser                      | A preview representation of an article on a Category page, containing at minimum the square teaser image, the title, and a link to the detail page. Teasers are shown only on Category pages. |
| Header image                | The landscape image at the top of an article's detail page, unique to that article, rendered as a CSS `background-image` on a container and cropped responsively per viewport width.          |
| Square teaser image         | The square image used to represent an article on its Category page listing. Designed in the same visual language as the Homepage category tiles. Not shown on the Homepage.                   |
| Decorative image            | Additional images inside the article body text; not the header and not the teaser image.                                                                                                      |
| Flat-file CMS               | A content management system that stores content as files (e.g. Markdown, YAML) rather than in a database. Example: Kirby.                                                                     |
| Static site generator (SSG) | A tool that renders source files (Markdown, templates) into static HTML at build time. Examples: Eleventy, Hugo, Astro.                                                                       |
| Static site                 | A site composed exclusively of pre-rendered HTML/CSS/JS/image files, requiring no server-side logic at request time.                                                                          |
| Build                       | The process of turning source files and assets into the static output that is deployed.                                                                                                       |
| Screen design               | A visual mock-up of a page; acts as the binding layout reference for the implementation.                                                                                                      |
| Kirby Panel                 | Kirby's web-based editing UI. Kirby stores content in files, not a database, so it still satisfies the "no database" constraint.                                                              |

---

_This document follows IEEE/IEC/ISO 29148, IREB CPRE and BABOK v3. It describes **what** the system must do and **which qualities** it must exhibit — not **how** to implement it. Implementation decisions belong in the design and planning phase (e.g. Claude Code plan mode or OpenSpec)._
