## ADDED Requirements

### Requirement: Homepage at root path

The system SHALL serve a Homepage at `/` that introduces the project and prominently presents all four categories (_Gelassene Produktivität_, _Innere Stärke_, _Leichte Balance_, _Verbunden kommunizieren_), matching the layout in `docs/requirements/screendesign/screendesign-homepage-in-desktop-viewport.png`.

#### Scenario: Root path returns the homepage

- **WHEN** a client requests `https://gelassenheitundlebensfreude.de/`
- **THEN** the response is HTTP 200 and the rendered HTML contains the exact labels _Gelassene Produktivität_, _Innere Stärke_, _Leichte Balance_ and _Verbunden kommunizieren_

#### Scenario: Homepage has no per-article teasers

- **WHEN** the homepage is rendered
- **THEN** the page shows only the four category tiles and does not contain any per-article teaser element

### Requirement: Consistent main navigation on every page

The system SHALL expose, in the main navigation of every rendered page, exactly the four category links in the order _Gelassene Produktivität_, _Innere Stärke_, _Leichte Balance_, _Verbunden kommunizieren_, and no additional navigation items beyond site-wide links that are the same on every page.

#### Scenario: Navigation order is uniform

- **WHEN** any public page is rendered
- **THEN** the `<nav>` element contains exactly those four category links in that exact order

### Requirement: Category overview pages

The system SHALL provide a dedicated Category overview page for each of the four categories under a speaking, kebab-case URL path, and each page SHALL render an introductory text followed by a teaser for every article assigned to that category in `categories-and-articles.csv`.

#### Scenario: Each category URL is reachable

- **WHEN** a client requests `/gelassene-produktivitaet/`, `/innere-staerke/`, `/leichte-balance/` or `/verbunden-kommunizieren/`
- **THEN** the response is HTTP 200 and the page lists only articles assigned to that category

#### Scenario: Teaser count matches the article index

- **WHEN** a Category overview page is rendered
- **THEN** the number of rendered teasers equals the number of articles assigned to that category in `categories-and-articles.csv`

### Requirement: Article detail pages for all 24 articles

The system SHALL provide an Article detail page for every Markdown file under `docs/requirements/content/articles/`, reachable via a stable, SEO-friendly, kebab-case URL that does not change after the first release.

#### Scenario: Every source article is reachable

- **WHEN** the site is built
- **THEN** every one of the 24 source article files produces exactly one reachable detail page URL returning HTTP 200

### Requirement: Legal placeholder pages

The system SHALL provide an _Impressum_ page at `/impressum/` and a _Datenschutzerklärung_ page at `/datenschutz/`, each reachable via a link in the footer of every page. Placeholder body copy is acceptable for the first release; the owner supplies final copy later.

#### Scenario: Footer links resolve

- **WHEN** any public page is rendered
- **THEN** the footer contains a link to `/impressum/` and a link to `/datenschutz/`, both returning HTTP 200 and both containing a top-level heading identifying the page

### Requirement: Custom 404 page

The system SHALL return HTTP 404 for unknown URLs and SHALL render a user-friendly error page that contains the main navigation and a link back to the Homepage.

#### Scenario: Unknown path returns friendly 404

- **WHEN** a client requests an arbitrary nonexistent path
- **THEN** the response status is 404 and the response body contains the main navigation and a link to `/`

### Requirement: Favicon and web-app-manifest integration

The system SHALL embed the favicon asset set from `docs/requirements/assets/favicon/` — `favicon.ico`, `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`, `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png` and `site.webmanifest` — via the correct `<link>` and `<meta>` tags on every page.

#### Scenario: Manifest and icons are reachable

- **WHEN** any page is loaded in a browser
- **THEN** the `<head>` references the favicon assets and the `site.webmanifest` URL returns HTTP 200 with a valid manifest

### Requirement: Nested category/article URL scheme

The system SHALL serve article detail pages under `/<category-slug>/<article-slug>/` so that the category context is part of the URL path.

#### Scenario: Article URLs are category-nested

- **WHEN** any article detail page is linked from a category page or the sitemap
- **THEN** its URL path begins with one of the four category slugs followed by the article slug
