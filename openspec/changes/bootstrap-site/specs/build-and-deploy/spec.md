## ADDED Requirements

### Requirement: Single Git repository holds code, content and build definition

All source code, content, assets and the build definition SHALL live in a single Git repository. A fresh clone SHALL, after the documented setup steps, allow a local build to complete successfully.

#### Scenario: Fresh clone builds

- **WHEN** a developer clones the repository into a clean directory and runs the documented install and build commands
- **THEN** the build completes successfully and produces a static output directory

### Requirement: Reproducible offline-capable build

The build process SHALL be reproducible and SHALL NOT require outbound network access to third-party resources at build time once dependencies have been installed.

#### Scenario: Build runs with no network

- **WHEN** the build is run on a machine with no outbound network access, after `npm ci` has populated `node_modules`
- **THEN** the build completes successfully and produces a static output directory

### Requirement: Build performance ceiling

A full build of the current site SHOULD complete in ≤ 30 seconds on average development hardware starting from a cold cache.

#### Scenario: Cold-cache build is fast enough

- **WHEN** the build command is timed from a cold cache on average development hardware
- **THEN** the elapsed time is ≤ 30 seconds

### Requirement: Linter / formatter setup

The project SHOULD include a linter / formatter configuration that is invoked via a single documented command and reports zero warnings on a clean checkout.

#### Scenario: Lint command exits cleanly

- **WHEN** the documented lint / format command is run on a clean checkout
- **THEN** the command exits with status zero and reports no warnings

### Requirement: Automated deployment via GitHub Actions

Deployment to the production VPS SHALL be automated via a GitHub Actions workflow that builds the static output in CI and uploads it to the Caddy-served webroot without requiring manual SSH access.

#### Scenario: Push to main deploys the site

- **WHEN** a commit lands on the `main` branch (or `workflow_dispatch` is triggered)
- **THEN** the GitHub Actions workflow runs the build and publishes the resulting artefacts to the production webroot so that the updated site is reachable at `https://gelassenheitundlebensfreude.de/`

### Requirement: Rollback by redeploying a prior build

The system SHALL support rolling back to a previously deployed state without data loss by redeploying a previous build artefact. The rollback procedure SHALL be documented.

#### Scenario: Rollback drill succeeds

- **WHEN** an operator redeploys a previous green commit following the documented rollback procedure
- **THEN** the live site returns to the state of that prior build and no content is lost

### Requirement: Browser compatibility

The site SHALL render and function correctly in current versions of Chrome, Firefox, Safari (including iOS Safari) and Edge. Browsers older than 24 months are not required to be supported.

#### Scenario: Manual cross-browser review

- **WHEN** the Homepage, a Category page and an Article page are opened in current Chrome, Firefox, Safari, Edge and iOS Safari
- **THEN** layout, navigation and images render correctly in each browser with no functional regressions
