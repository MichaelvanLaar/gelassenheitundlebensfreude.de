# gelassenheitundlebensfreude.de

German personal development blog covering mindfulness, productivity, and inner strength. Deployed via Caddy on a personal VPS. Tech stack TBD.

## Key Config Files

| File | Purpose |
|------|---------|
| `.claude/settings.json` | Permissions, hooks, environment variables            |
| `.claude/skills/cc-init/SKILL.md` | TODO: add description   |
| `.claude/skills/cc-optimize/SKILL.md` | TODO: add description   |
| `.gitignore` | Git ignore patterns                                  |

## Commands

```sh
# TODO: Add build command once stack is chosen
# TODO: Add dev server command
# TODO: Add test command
# TODO: Add deploy command (Caddy on VPS)
```

## Structure

```
docs/requirements/
  content/articles/   # Source markdown articles (24 articles)
  screendesign/       # Homepage and article page mockups (desktop)
  assets/             # Logo and other raw assets
  categories-and-articles.csv  # Article index with categories and SEO keywords
```

## Conventions

- Site language is German — all user-facing content stays in German.
- Article filenames are kebab-case German slugs (UTF-8 encoded).
- Categories: Gelassene Produktivität, Innere Stärke, Leichte Balance, Verbunden kommunizieren.
- TODO: Add code style/formatter conventions once stack is decided.

## Don't

- Don't commit secrets or credentials to git.
- Don't use `--force` flags — fix the underlying issue instead.
- Don't modify source articles in `docs/requirements/content/` — they are input material, not generated output.

## Learnings

When the user corrects a mistake or points out a recurring issue, append a one-line
summary to `.claude/learnings.md` instead of modifying this file directly.

## Compact Instructions

When compacting, preserve: list of modified files, current test status, open TODOs, and key decisions made (especially stack choice once decided).
