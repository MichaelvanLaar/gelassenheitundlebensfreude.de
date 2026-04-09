## ADDED Requirements

### Requirement: Full Markdown rendering on article pages

Each Article detail page SHALL render the full Markdown content of its source file, preserving headings, paragraphs, lists, emphasis, and links, with every Markdown element mapped to the appropriate semantic HTML element.

#### Scenario: Markdown elements survive rendering

- **WHEN** a sample article containing headings, paragraphs, emphasis, links and a list is rendered
- **THEN** the rendered HTML contains the corresponding `<h2>`/`<h3>`, `<p>`, `<em>`/`<strong>`, `<a>` and `<ul>`/`<ol>` elements with content matching the source

### Requirement: Responsive landscape header image via CSS background

Each Article detail page SHALL display the article's dedicated landscape header image as the `background-image` of a header container at the top of the page, cropped responsively per viewport width via `background-size: cover` (or equivalent), using a single source file per article.

#### Scenario: Header container renders the background image

- **WHEN** an article detail page is loaded at viewport widths of 320 px, 768 px and 1440 px
- **THEN** the header container shows the article's unique image as a CSS background that fills the container without distortion at each width

#### Scenario: Each article has a unique header image

- **WHEN** all 24 article pages are inspected in production content
- **THEN** no two articles reference the same header image file

### Requirement: Square teaser image used only on Category pages

Each article SHALL have a dedicated square teaser image that is distinct from its header image and is rendered only on the Category overview page for that article's category. The square teaser image SHALL NOT appear on the Homepage or on the Article detail page.

#### Scenario: Teaser appears on the category page

- **WHEN** a Category page listing a given article is rendered
- **THEN** the teaser for that article contains its square teaser image

#### Scenario: Teaser does not appear elsewhere

- **WHEN** the Homepage or any Article detail page is rendered
- **THEN** no square teaser image is present anywhere on the page

### Requirement: Minimum teaser contents and navigation

Each article teaser on a Category page SHALL contain at minimum the article's square teaser image, its title, and a link to the article detail page. Clicking any part of the teaser SHALL navigate to the correct detail page.

#### Scenario: Teaser is clickable end-to-end

- **WHEN** any teaser on any Category page is clicked on any of its visible elements
- **THEN** the browser navigates to that article's detail page URL

### Requirement: Visual consistency between category tiles and teasers

Category-page article teasers SHALL follow the same visual language as the Homepage category tiles: matching tile shape, image aspect ratio, typography and spacing.

#### Scenario: Side-by-side review passes

- **WHEN** a Category page and the Homepage are rendered side by side at the same viewport width
- **THEN** the teaser tiles and the category tiles share the same aspect ratio, spacing scale and typographic style

### Requirement: Short descriptive excerpt in teasers

Each article teaser on a Category page SHOULD contain a short descriptive excerpt between 100 and 200 characters in length, sourced from the article's front matter (`excerpt` field) or meta description.

#### Scenario: Excerpt length is within bounds

- **WHEN** a Category page is rendered
- **THEN** every teaser contains an excerpt whose character length is between 100 and 200 inclusive

### Requirement: Article detail page matches screen design

The Article detail page SHALL visually match `docs/requirements/screendesign/screen-design-article-page-in-desktop-viewport.png` in desktop view with respect to layout, typographic hierarchy, spacing, header-image placement, and logo placement.

#### Scenario: Desktop review confirms match

- **WHEN** an article detail page is rendered at desktop width and compared side by side with the screen design
- **THEN** layout, typographic hierarchy, spacing, header-image placement and logo placement match

### Requirement: Reading-time or word-count indicator

Each Article detail page SHOULD display either an estimated reading time or a word count near the article title.

#### Scenario: Indicator is visible near the title

- **WHEN** an article detail page is rendered
- **THEN** a reading-time or word-count element is present within the article header region near the title
