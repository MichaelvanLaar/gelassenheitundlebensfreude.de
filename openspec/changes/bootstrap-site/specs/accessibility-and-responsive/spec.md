## ADDED Requirements

### Requirement: Responsive layout from 320 px to ≥ 1920 px

The system SHALL render without horizontal scrolling or content overlap on viewport widths from 320 px up to at least 1920 px.

#### Scenario: Visual sweep across viewport widths

- **WHEN** the Homepage, a Category page and an Article page are rendered at viewport widths of 320, 375, 768, 1024, 1440 and 1920 px
- **THEN** no horizontal scrollbar appears and no content overlaps or is clipped at any of these widths

### Requirement: WCAG 2.1 Level AA conformance

The system SHALL conform to WCAG 2.1 Level AA.

#### Scenario: axe-core scan is clean

- **WHEN** an axe-core scan is run against the Homepage, a Category page and an Article page
- **THEN** the scan reports zero violations at WCAG 2.1 AA level

### Requirement: Mobile-readable body typography

Body text SHALL have a computed font size of at least 16 px and a contrast ratio of at least 4.5:1 against its background on mobile viewports.

#### Scenario: Typography thresholds met

- **WHEN** the article page is inspected at a mobile viewport (375 px width)
- **THEN** body paragraph elements report a computed `font-size` of ≥ 16 px and a contrast ratio of ≥ 4.5:1

### Requirement: Keyboard navigability with visible focus

The system SHOULD be fully keyboard-navigable and SHOULD render a visible focus indicator on every interactive element when it receives focus.

#### Scenario: Tab traversal covers every interactive element

- **WHEN** a user tab-traverses the Homepage, a Category page and an Article page using only the keyboard
- **THEN** every link and interactive control receives focus in a logical order and displays a visible focus style

### Requirement: Mobile layout derived from desktop screen designs

The mobile layouts for the Homepage, Category pages and Article pages SHOULD be derived consistently from the provided desktop screen designs, preserving their visual intent even though no mobile mockup exists.

#### Scenario: Owner review confirms intent

- **WHEN** the owner reviews the rendered mobile layouts
- **THEN** they confirm that the layouts preserve the typographic hierarchy, spacing rhythm and tile style of the desktop screen designs
