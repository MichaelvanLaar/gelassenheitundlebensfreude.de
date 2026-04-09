## ADDED Requirements

### Requirement: Lighthouse score thresholds

The system SHALL achieve a Lighthouse score of at least 95 in each of the four categories — Performance, Accessibility, Best Practices, and SEO — on both Mobile and Desktop profiles, for the Homepage, a representative Category page and a representative Article page.

#### Scenario: Lighthouse CI run passes

- **WHEN** Lighthouse (CLI or DevTools) is run against the built site for the three page types on both profiles
- **THEN** every reported category score is ≥ 95

### Requirement: Largest Contentful Paint budget

The system SHALL deliver every HTML page with a Largest Contentful Paint of 1.0 seconds or less under a Lighthouse "Mobile Slow 4G" profile.

#### Scenario: LCP ≤ 1.0 s

- **WHEN** Lighthouse is run on the Homepage, a Category page and an Article page with the "Mobile Slow 4G" profile
- **THEN** each reported LCP value is ≤ 1.0 s

### Requirement: Article page transfer-size ceiling

The total transfer size of a typical article page — HTML + CSS + fonts + the single landscape header image, excluding additional inline decorative images — SHALL be at most 500 KB on a clean load.

#### Scenario: Network panel sum is within budget

- **WHEN** an article page without inline body images is loaded in Chrome DevTools with a cold cache
- **THEN** the sum of transferred bytes for HTML, CSS, fonts and the header image is ≤ 500 KB

### Requirement: Modern image formats and responsive sources

Content images rendered via `<img>` (square teaser images and inline decorative images) SHALL use a modern image format (WebP or AVIF) and SHALL provide responsive sizes via `<picture>` or `srcset`/`sizes`. The per-article landscape header image MAY be a single source file (exempted from `srcset` because it is rendered as a CSS background) but SHALL also use a modern image format and be sized appropriately for the largest supported viewport.

#### Scenario: Content images use responsive modern formats

- **WHEN** the built HTML is scanned for `<img>` elements in article bodies and Category teasers
- **THEN** every such element uses a WebP or AVIF source and declares `srcset` (or is wrapped in a `<picture>` with modern-format sources) and `sizes`

#### Scenario: Header image is a modern format

- **WHEN** the header background image for any article is inspected
- **THEN** the file served is in WebP or AVIF format

### Requirement: No render-blocking third-party requests

The system SHALL NOT issue any render-blocking request to any foreign domain during initial page load.

#### Scenario: No foreign-domain requests on first load

- **WHEN** any public page is loaded with a cleared cache
- **THEN** zero requests in the network waterfall target a domain other than `gelassenheitundlebensfreude.de`
