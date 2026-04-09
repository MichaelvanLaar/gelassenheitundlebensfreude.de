## ADDED Requirements

### Requirement: Database-free file-based authoring workflow

The system SHALL let the owner add or edit articles without developer involvement and without any database operations. All content SHALL live as files in the Git repository.

#### Scenario: New article publishes without code changes

- **WHEN** a previously unknown article file is added under the content directory with the required metadata and the site is rebuilt
- **THEN** the article becomes reachable via its detail page URL and appears on its category page without any code file being modified

### Requirement: Per-article metadata schema

Each article source SHALL carry front-matter metadata containing at minimum the following fields: `title`, `category`, `slug`, `metaDescription`, `headerImage`, `teaserImage`. Metadata SHALL live alongside the article body in the same source file.

#### Scenario: All 24 articles expose the required fields

- **WHEN** the content directory is scanned
- **THEN** every article source contains all six required front-matter fields with non-empty values

#### Scenario: Metadata change reflected on rebuild

- **WHEN** any metadata field on an article is changed and the site is rebuilt
- **THEN** the rendered site reflects the new value on the relevant pages (title, teaser, meta tags, image reference)

### Requirement: Category values restricted to the four canonical slugs

The `category` front-matter field SHALL be one of exactly four kebab-case values: `gelassene-produktivitaet`, `innere-staerke`, `leichte-balance`, `verbunden-kommunizieren`. The build SHALL fail if any article declares a category outside this set.

#### Scenario: Invalid category fails the build

- **WHEN** an article declares `category: unbekannt` and the build runs
- **THEN** the build exits with a non-zero status and an error message naming the offending file

### Requirement: Editable category and homepage intro content

Each Category page and the Homepage SHALL render an intro / hero text sourced from its own editable content file. Lorem ipsum placeholder copy is acceptable for the first release.

#### Scenario: Intro text is editable without code

- **WHEN** the intro content file for a category or the homepage is edited and the site rebuilt
- **THEN** the rendered page shows the updated text without any template or code change

### Requirement: Inline decorative images in article bodies

The authoring workflow SHOULD let the owner embed decorative images inside article bodies via standard Markdown image syntax, with image files stored in the project's asset location.

#### Scenario: Markdown image reference renders

- **WHEN** an article body contains a Markdown image reference with an alt text
- **THEN** the rendered page displays the image scaled to fit the content column and exposes the alt text on the `<img>` element

### Requirement: Source article files remain read-only inputs

The build SHALL NOT modify the Markdown files under `docs/requirements/content/articles/`. Any transformation happens in the build output, not in the source directory.

#### Scenario: Build leaves source directory untouched

- **WHEN** the build is run from a clean checkout
- **THEN** `git status` on `docs/requirements/content/articles/` reports no modifications

### Requirement: Local build and preview

The publishing pipeline SHALL support a local build and a local preview step that run without contacting third-party services (once dependencies are installed).

#### Scenario: Local preview works offline

- **WHEN** the documented local build and preview commands are run on a developer machine with no outbound network access beyond localhost (after `npm ci` has completed)
- **THEN** a local HTTP server serves the built site and the homepage, a category page and an article page all load successfully
