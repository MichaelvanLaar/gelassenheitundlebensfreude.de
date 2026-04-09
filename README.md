# gelassenheitundlebensfreude.de

Static site for [gelassenheitundlebensfreude.de](https://gelassenheitundlebensfreude.de/) — a
German-language personal-development blog on mindfulness, productivity and inner strength.

Built with [Eleventy](https://www.11ty.dev/), deployed to a Caddy-served VPS via GitHub Actions.
Design rationale and architecture are documented under `openspec/changes/bootstrap-site/`.

## Prerequisites

- Node.js ≥ 20.11 (LTS)
- npm ≥ 10

## Setup

```sh
npm ci
```

## Local build

```sh
npm run build
```

Produces the static site in `_site/`.

## Local preview

```sh
npm run serve
```

Starts Eleventy's dev server with live reload at <http://localhost:8080/>.

## Lint / format

```sh
npm run lint    # check formatting
npm run format  # write formatting fixes
```

## Repository layout

```
src/
  _includes/        Nunjucks layouts and partials
  _data/            Global data files
  content/
    articles/       Per-article front-matter (body comes from docs/requirements/content/articles/)
    categories/     Category intro pages
  styles/           CSS (tokens, reset, typography, layout, components)
  fonts/            Self-hosted Montserrat WOFF2 files
  assets/           Favicons, logo, generated images
docs/requirements/  Binding inputs: screen designs, source articles, CSV, assets
openspec/           Spec-driven change history and active changes
```

Source Markdown articles under `docs/requirements/content/articles/` are **read-only inputs** —
do not modify them from the build.
