## 1. Project scaffolding

- [x] 1.1 Initialize Node project (`package.json`) with pinned versions of Eleventy, `@11ty/eleventy-img`, a Markdown library config, and Nunjucks-related deps; commit `package-lock.json`.
- [x] 1.2 Create the repository layout from design.md §D-08 (`src/`, `src/_includes/`, `src/_data/`, `src/content/{articles,categories}`, `src/styles/`, `src/fonts/`, `src/assets/`).
- [x] 1.3 Add `.eleventy.js` with input/output paths, passthrough copy for fonts and assets, and a collection for articles by category.
- [x] 1.4 Add `.editorconfig`, `.gitignore` (covering `_site/`, `node_modules/`), and a README with local build/preview commands.
- [x] 1.5 Add Prettier (or equivalent) formatter and an `npm run lint` / `npm run format` command; verify a clean run exits zero.
- [x] 1.6 Document the local build (`npm run build`) and local preview (`npm run serve`) commands in the README.

## 2. Content model and migration

- [x] 2.1 Define the article front-matter schema (`title`, `category`, `slug`, `metaDescription`, `headerImage`, `teaserImage`, optional `excerpt`) as an Eleventy data cascade layer.
- [x] 2.2 Implement a build-time validator that fails the build if any article is missing required fields or declares a `category` outside the four canonical slugs.
- [x] 2.3 Create a content ingestion step that reads source Markdown from `docs/requirements/content/articles/` (read-only per CON-006) and merges it with per-article metadata stored in `src/content/articles/*.md` (front-matter only; body comes from the source file).
- [x] 2.4 Populate front-matter metadata for all 24 articles using `docs/requirements/categories-and-articles.csv` as the source for category and slug assignment.
- [x] 2.5 Create `src/content/home.md` with hero / intro lorem-ipsum placeholder copy.
- [x] 2.6 Create `src/content/categories/{gelassene-produktivitaet,innere-staerke,leichte-balance,verbunden-kommunizieren}.md` with intro lorem-ipsum placeholder copy.
- [x] 2.7 Add `src/impressum.md`, `src/datenschutz.md`, `src/404.md` with placeholder body copy and correct front matter (layout, title).

## 3. Templates and layouts

- [x] 3.1 Build the `base.njk` layout with `<head>` (title, meta description, canonical, OG, favicon set, preloaded fonts), `<header>` (logo + main nav), `<main>` slot, `<footer>` (Impressum / Datenschutz links).
- [x] 3.2 Build the `home.njk` layout: hero/intro block and four category tiles, matching `screendesign-homepage-in-desktop-viewport.png`.
- [x] 3.3 Build the `category.njk` layout: category intro + article teaser grid using the shared tile primitive from the Homepage.
- [x] 3.4 Build the `article.njk` layout: header container with inline `--header-image` custom property, article `<h1>`, optional reading-time indicator, rendered Markdown body in a constrained content column — matching `screen-design-article-page-in-desktop-viewport.png`.
- [x] 3.5 Build the `page.njk` layout for Impressum / Datenschutz with standard header, main content, footer.
- [x] 3.6 Build a `404.njk` layout wired to Caddy `handle_errors` that contains the main navigation and a link to `/`.
- [x] 3.7 Build shared partials: `site-header.njk`, `site-footer.njk`, `nav.njk` (exact four categories in the mandated order), `tile.njk` (reusable for Homepage category tiles and Category-page teasers), `head-meta.njk`, `head-og.njk`, `head-jsonld.njk`.
- [x] 3.8 Implement the `tile.njk` partial so that it produces an identical visual outcome for both Homepage category tiles and Category-page teasers (same aspect ratio, typography, spacing).
- [x] 3.9 Wire a reading-time filter (word count / 200 wpm) into the article layout.
- [x] 3.10 Pass the test: every rendered page contains the main navigation with exactly the four mandated links in the mandated order.

## 4. Styling and design tokens

- [ ] 4.1 Extract the brand colour palette from `docs/requirements/assets/logo-gelassenheitundlebensfreude.svg` and the screen designs; commit values to `src/styles/tokens.css` as CSS custom properties.
- [ ] 4.2 Write `src/styles/reset.css` (modern minimal reset) and `src/styles/typography.css` (Montserrat assignments, heading scale, body ≥ 16 px, line-height).
- [ ] 4.3 Write `src/styles/layout.css` (container widths, grid for tiles, responsive breakpoints 320 → 1920).
- [ ] 4.4 Write `src/styles/components.css` for header, nav, footer, tile, article header container, 404 page.
- [ ] 4.5 Add PostCSS (or esbuild-css) pipeline step for autoprefixing and minification; output a single `styles.css` (or inlined `<style>` — decide by measurement against NFR-001 LCP).
- [ ] 4.6 Scan the built CSS and verify that no raw hex / rgb colour literal exists outside `tokens.css`.
- [ ] 4.7 Verify body computed font-size ≥ 16 px and contrast ≥ 4.5:1 on a rendered article page at 375 px viewport.

## 5. Fonts, favicon, logo

- [ ] 5.1 Obtain Montserrat Regular (400) and Bold (700) as WOFF2 under a licence compatible with self-hosting; place under `src/fonts/`.
- [ ] 5.2 Declare exactly two `@font-face` blocks (400 + 700, no italic) with `font-display: swap` and add `<link rel="preload" as="font" crossorigin>` to the base layout.
- [ ] 5.3 Copy the favicon set from `docs/requirements/assets/favicon/` into `src/assets/favicon/` and wire all referenced files in `head-meta.njk`.
- [ ] 5.4 Copy `docs/requirements/assets/logo-gelassenheitundlebensfreude.svg` into `src/assets/logo.svg` and reference it in the header partial.
- [ ] 5.5 Verify in Network panel that exactly two Montserrat files are fetched from the site's own domain on a cold load.

## 6. Images

- [ ] 6.1 Configure `@11ty/eleventy-img` for offline generation of WebP + AVIF derivatives for teaser and inline body images, with responsive widths (e.g. 320/480/640/800 for teasers, 640/960/1280 for body).
- [ ] 6.2 Create placeholder landscape header images (AVIF) for all 24 articles, budgeted around 100–150 KB each, stored at `src/assets/images/headers/<slug>.avif`.
- [ ] 6.3 Create placeholder square teaser images for all 24 articles, stored at `src/assets/images/teasers/<slug>.avif` with corresponding WebP fallback.
- [ ] 6.4 Implement a Nunjucks shortcode for rendering `<picture>` elements from a source path, used by the tile partial and inline body images.
- [ ] 6.5 In `article.njk`, emit the header image as an inline `style="--header-image:url('…')"` on the header container and reference it in CSS via `background-image: var(--header-image); background-size: cover`.
- [ ] 6.6 Verify at 320, 768 and 1440 px viewport widths that the header container renders the background image without distortion.
- [ ] 6.7 Verify that no two articles share the same header image or teaser image in the built output.

## 7. SEO and structured data

- [ ] 7.1 Implement `head-meta.njk` so every page has a unique `<title>` (from `title` + site suffix) and unique `<meta name="description">` (from `metaDescription`).
- [ ] 7.2 Render `<link rel="canonical">` using the absolute site URL + `page.url`.
- [ ] 7.3 Render Open Graph tags (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`) on every page; use the logo for non-article pages and the header image for articles; do NOT emit `article:published_time` or any date/author OG tag.
- [ ] 7.4 Render JSON-LD `BlogPosting` on article pages with `headline`, `image`, `mainEntityOfPage`, and `author` + `publisher` as `Organization` (the site). Exclude `datePublished`, `dateModified`, and any `Person` author.
- [ ] 7.5 Generate `sitemap.xml` via an Eleventy template iterating `collections.all`, filtered to public pages, and emit an `<urlset>` with `<loc>` entries for homepage, four categories, 24 articles, `/impressum/`, `/datenschutz/`.
- [ ] 7.6 Add `src/robots.txt` (passthrough copy) with `User-agent: *`, no global `Disallow`, and a `Sitemap:` line pointing to the absolute sitemap URL.
- [ ] 7.7 Run a uniqueness scan over all built HTML to confirm 100% unique `<title>` and `<meta description>` values.
- [ ] 7.8 Validate three sample article pages with Google Rich Results Test and confirm zero errors and no date/person-author fields.
- [ ] 7.9 Run an HTML heading-hierarchy validator on the three page types and confirm exactly one `<h1>` and no skipped heading levels.

## 8. Caddy configuration and privacy posture

- [ ] 8.1 Write a checked-in `Caddyfile` covering HTTPS-only, automatic ACME, HTTP→HTTPS 301 redirect, and static file serving from the webroot.
- [ ] 8.2 Add a `handle_errors` block routing 404 responses to `/404.html`.
- [ ] 8.3 Set security headers in the Caddyfile: `Strict-Transport-Security`, `Content-Security-Policy` (`default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`.
- [ ] 8.4 Configure `Cache-Control`: HTML `public, max-age=0, must-revalidate`; fingerprinted assets `public, max-age=31536000, immutable`.
- [ ] 8.5 Configure Caddy access log with IP anonymisation (drop last IPv4 octet / last 80 bits IPv6) and a retention-friendly format.
- [ ] 8.6 Document the Caddy reload procedure used by the deploy workflow.
- [ ] 8.7 Verify no response contains a `Set-Cookie` header and `document.cookie` is empty on every page type.

## 9. GitHub Actions deployment

- [ ] 9.1 Create `.github/workflows/deploy.yml` triggered on `push` to `main` and `workflow_dispatch`, with a `ref` input for rollback.
- [ ] 9.2 Job steps: checkout, setup Node (pinned version), `npm ci`, `npm run build`, run Lighthouse CI against the built output, run axe-core, fail the job if any gate fails.
- [ ] 9.3 Upload `_site/` to the VPS webroot via `rsync -a --delete` over SSH using a deploy key stored in repository secrets.
- [ ] 9.4 Reload Caddy (or rely on Caddy picking up files directly, depending on config) after a successful sync.
- [ ] 9.5 Document the rollback procedure: `gh workflow run deploy.yml -f ref=<sha>` (or `git revert` + push) and validate with a rehearsal.
- [ ] 9.6 Provision a dedicated deploy user on the VPS with write access only to the webroot, no sudo; rotate the deploy key and document the rotation cadence.

## 10. Quality gates and fit-criteria verification

- [ ] 10.1 Run Lighthouse CI in Mobile + Desktop profiles against the Homepage, a Category page and an Article page; confirm scores ≥ 95 in Performance, Accessibility, Best Practices, SEO.
- [ ] 10.2 Confirm LCP ≤ 1.0 s on Mobile Slow 4G for the three page types.
- [ ] 10.3 Measure transfer size of a typical article page (HTML + CSS + fonts + header image, no body images) in Chrome DevTools with a cold cache; confirm ≤ 500 KB.
- [ ] 10.4 Run axe-core against the three page types; confirm zero WCAG 2.1 AA violations.
- [ ] 10.5 Manually verify responsive behaviour at 320, 375, 768, 1024, 1440, 1920 px widths on the three page types.
- [ ] 10.6 Manual keyboard traversal of the three page types confirms every interactive element receives focus with a visible focus style.
- [ ] 10.7 Manual cross-browser smoke test on current Chrome, Firefox, Safari, Edge and iOS Safari.
- [ ] 10.8 Verify zero foreign-domain requests and zero cookies on the three page types using DevTools.
- [ ] 10.9 Verify the sitemap lists exactly the expected URL set (1 + 4 + 24 + 2 = 31 URLs) and is XML-valid.
- [ ] 10.10 Verify all 24 source articles from `docs/requirements/content/articles/` are reachable via their production URLs and that `git status` on the source directory reports no modifications.
- [ ] 10.11 Rehearse a rollback by redeploying a previous commit and confirm the live site reverts.
- [ ] 10.12 Run SSL Labs / testssl.sh against the live host; confirm at least grade A and TLS 1.3 support.
- [ ] 10.13 Run Mozilla Observatory / securityheaders.com; confirm at least grade A.
