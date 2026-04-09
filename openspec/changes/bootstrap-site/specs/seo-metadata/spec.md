## ADDED Requirements

### Requirement: Unique title and meta description per page

Every public page SHALL carry a unique, descriptive `<title>` and a unique `<meta name="description">` in the HTML `<head>`. Duplicates across pages SHALL NOT exist.

#### Scenario: Full-site uniqueness scan

- **WHEN** an automated scan extracts the `<title>` and `<meta name="description">` from every page reachable from the sitemap
- **THEN** every title value is unique and every description value is unique

### Requirement: Canonical URL on every page

Every public page SHALL declare a canonical URL via `<link rel="canonical" href="…">` in the head, pointing to its own absolute URL.

#### Scenario: Canonical matches page URL

- **WHEN** any public page is rendered
- **THEN** the `<link rel="canonical">` `href` equals the absolute URL of that page

### Requirement: Open Graph metadata on every page

Every public page SHALL expose Open Graph metadata in the `<head>` containing at minimum `og:title`, `og:description`, `og:type`, `og:url` and `og:image`.

#### Scenario: All five OG tags present

- **WHEN** any public page is rendered
- **THEN** the `<head>` contains `<meta property>` tags for `og:title`, `og:description`, `og:type`, `og:url` and `og:image`, each with a non-empty `content`

#### Scenario: No publication date in OG tags

- **WHEN** an article page is rendered
- **THEN** no `article:published_time`, `article:modified_time` or equivalent date meta tag is present

### Requirement: JSON-LD structured data on article pages

Each article detail page SHALL embed a JSON-LD `<script type="application/ld+json">` block of type `Article` or `BlogPosting`, containing at minimum `headline`, `image` (the article's header image absolute URL), `mainEntityOfPage`, `author` and `publisher`. Both `author` and `publisher` SHALL be typed as `Organization` referring to the website itself. The block SHALL NOT contain `datePublished`, `dateModified`, or any `Person`-typed author.

#### Scenario: Structured data validates

- **WHEN** three sample article pages are tested with the Google Rich Results Test
- **THEN** the structured data validates with zero errors and contains no date or person-author fields

### Requirement: No publication dates or author names anywhere

The system SHALL NOT render article publication dates, "last updated" dates, or natural-person author names in visible content, HTML `<head>` metadata, Open Graph tags, or JSON-LD structured data.

#### Scenario: Full-site date/author scan is empty

- **WHEN** rendered pages and their metadata are scanned for any date string or any author name
- **THEN** no publication date, update date, or person author is present anywhere

### Requirement: sitemap.xml at /sitemap.xml

The system SHALL serve an XML sitemap at `/sitemap.xml` that lists every publicly reachable page — the homepage, all four category pages, all 24 article pages, the Impressum and the Datenschutzerklärung.

#### Scenario: Sitemap is reachable and complete

- **WHEN** `/sitemap.xml` is requested
- **THEN** the response is HTTP 200, the body is valid XML, and the set of `<loc>` entries matches the expected set of public URLs

### Requirement: robots.txt at /robots.txt

The system SHALL serve a `/robots.txt` that references the sitemap URL and does not declare any global `Disallow` rule that would block crawling of public content.

#### Scenario: robots.txt points to sitemap

- **WHEN** `/robots.txt` is requested
- **THEN** the response contains a `Sitemap: https://gelassenheitundlebensfreude.de/sitemap.xml` line and no line that globally disallows crawling

### Requirement: Semantic HTML5 and correct heading hierarchy

Rendered pages SHOULD use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`) and SHOULD maintain a correct heading hierarchy starting at a single `<h1>` with no skipped levels.

#### Scenario: Heading hierarchy validator passes

- **WHEN** the homepage, a category page and an article page are validated with an HTML/accessibility heading-hierarchy checker
- **THEN** each page has exactly one `<h1>`, no skipped heading levels, and uses the listed semantic landmark elements
