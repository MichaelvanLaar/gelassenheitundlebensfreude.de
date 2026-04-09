## ADDED Requirements

### Requirement: Self-hosted Montserrat as the single typeface

The system SHALL use Montserrat, self-hosted from the site's own domain, as the single typeface for both body text and headings. Only the Regular (400) and Bold (700) weights SHALL be loaded. No italic variants and no additional weights SHALL be used.

#### Scenario: Exactly two Montserrat font files are fetched

- **WHEN** any public page is loaded with a cleared cache
- **THEN** the Network panel shows exactly two font requests, both targeting `gelassenheitundlebensfreude.de`, one for Montserrat Regular (400) and one for Montserrat Bold (700), and no other font files are fetched

#### Scenario: No italic or extra weights

- **WHEN** the built CSS is scanned for `@font-face` declarations
- **THEN** only declarations for Montserrat 400 and Montserrat 700 are present, none with `font-style: italic`

### Requirement: Design tokens derived from logo and screen designs

The colour palette SHALL be derived from the logo SVG (`docs/requirements/assets/logo-gelassenheitundlebensfreude.svg`) and the provided screen designs, and SHALL be documented as a reusable token set (CSS custom properties or equivalent). Every colour used in rendered CSS SHALL resolve to a token defined in that set.

#### Scenario: Token file exists and is authoritative

- **WHEN** the built CSS is scanned for colour values
- **THEN** every colour value in rendered styles is either a CSS custom property from the token file or resolves through one, and raw hex / rgb literals outside the token file are not used for colours

### Requirement: Homepage matches its binding screen design

The Homepage SHALL visually match `docs/requirements/screendesign/screendesign-homepage-in-desktop-viewport.png` in desktop view with respect to layout, typographic hierarchy, spacing, category tile style, and logo placement.

#### Scenario: Desktop review confirms match

- **WHEN** the rendered Homepage at desktop width is compared side by side with the screen design
- **THEN** layout, typographic hierarchy, spacing, category tile composition and logo placement match

### Requirement: Shared visual language between Homepage tiles and Category teasers

The Homepage category tiles and the Category-page article teasers SHALL share the same tile shape, image aspect ratio, typography, and spacing so that the Category-page design is a direct derivation of the Homepage design.

#### Scenario: Tile dimensions and typography align

- **WHEN** a Homepage category tile and a Category-page teaser are inspected at the same viewport width
- **THEN** their aspect ratios, padding, typographic scale and border/shadow treatment match
