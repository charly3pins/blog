# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

This is a personal blog built with [Hugo](https://gohugo.io/) (static site
generator). Content is written in Markdown, layouts are Go HTML templates, and
the site is deployed to GitHub Pages via GitHub Actions.

- **Site URL:** https://charly3pins.dev
- **Hugo version (CI):** 0.115.4 extended
- **Languages:** English (default) and Spanish (`es`)

---

## Build & Development Commands

| Command      | Description                                          |
|--------------|------------------------------------------------------|
| `make run`   | Start local dev server with drafts (`hugo server -D`) |
| `hugo`       | Build the site to `./public/`                        |
| `hugo --gc --minify` | Production build (used by CI)                |
| `hugo server -D` | Dev server at http://localhost:1313 with drafts  |

### Generate syntax highlighter CSS

```bash
hugo gen chromastyles --style=tokyonight-night > static/css/syntax.css
```

Currently configured style is `tokyonight-night` (set in `config.yaml`).

### There are no automated tests

This is a static content site. "Testing" means:
1. Run `make run` and verify the site renders correctly in a browser.
2. Run `hugo` (build only, no `--serve`) and confirm it exits without errors.

---

## Repository Structure

```
blog/
├── config.yaml          # Hugo site configuration
├── Makefile             # Dev convenience targets
├── content/             # All Markdown content
│   ├── blog/            # Blog posts (EN + ES translations)
│   ├── projects/        # Project write-ups
│   ├── about.md         # About page (EN)
│   └── about.es.md      # About page (ES)
├── layouts/             # Hugo Go HTML templates (custom theme)
│   ├── _default/
│   │   ├── baseof.html  # Base template wrapping all pages
│   │   ├── single.html  # Individual post/page template
│   │   ├── list.html    # Section list + taxonomy template
│   │   └── taxonomy.html
│   ├── partials/        # Reusable template fragments
│   │   ├── head.html
│   │   ├── nav.html
│   │   ├── footer.html
│   │   ├── social.html
│   │   └── svg.html
│   ├── shortcodes/
│   │   └── rawhtml.html # Allows raw HTML inside Markdown
│   ├── index.html       # Home page template
│   └── 404.html
└── static/
    ├── css/             # style.css, syntax.css, pagination.css
    └── images/          # All site images
```

---

## Content Conventions

### Front Matter Format

All content files use **TOML front matter** (delimited by `+++`):

```toml
+++
title = "Post Title Here"
date = "2025-04-21"
author = "charly3pins"
description = "One-sentence summary used as meta description and on list pages."

tags = ["go", "hugo", "software-engineering"]

image = "/images/my-image.png"
+++
```

- `title`: Title case, human-readable.
- `date`: ISO 8601 (`YYYY-MM-DD`).
- `author`: Always `"charly3pins"`.
- `description`: Required. One concise sentence. Used on listing pages and OG meta.
- `tags`: Lowercase, hyphen-separated slugs (e.g. `"software-engineering"`, not `"Software Engineering"`).
- `image`: Absolute path from `static/` root (e.g. `/images/foo.png`). Leave empty string `""` if no image.
- `weight`: Used in `projects/` to control display order (numeric string, e.g. `"1"`).

### Naming Conventions for Content Files

- Use **kebab-case** slugs that match the post title: `my-post-title.md`
- Spanish translations append `.es` before `.md`: `my-post-title.es.md`
- Both language files must share the same base slug.
- Place blog posts in `content/blog/`, project write-ups in `content/projects/`.

### Content Writing Style

- Write in clear, direct prose. First person is appropriate.
- Use `##` for top-level sections within a post (the page `<h1>` is the title).
- Use `###` / `####` for subsections.
- Code blocks must specify a language for syntax highlighting (e.g. ` ```go `).
- Embed raw HTML via the `rawhtml` shortcode when needed:
  ```
  {{< rawhtml >}}
  <div>...</div>
  {{</ rawhtml >}}
  ```
- Image paths in Markdown: use absolute paths from `static/` (e.g. `![alt](/images/foo.png)`).
- For centered/sized images, use the `rawhtml` shortcode with inline styles.

---

## Template (Layout) Conventions

### Go HTML Template Style

- Use Hugo's built-in template functions and variables; avoid JavaScript-based templating.
- Wrap logical blocks with blank lines for readability.
- Always use `absURL` for asset paths (CSS, images referenced in templates).
- Use `relLangURL` for internal navigation links to support multilingual routing.
- Sanitize untrusted HTML with `safeHTML` only where explicitly required.

### Partials

- Extract repeated HTML into `layouts/partials/`.
- Call partials with `{{- partial "name.html" . -}}` (trim whitespace with `-`).
- Pass the page context (`.`) unless the partial needs a specific data structure (e.g. `social.html` receives `.Site.Params.socialIcons`).

### Template Variable Naming

- Follow Hugo conventions: `.Title`, `.Content`, `.Params.Tags`, `.Site.Params.*`.
- Use `$` prefix for variables assigned in range loops (e.g. `$paginator`).

---

## CSS Conventions

All styles are in `static/css/style.css`. The design uses CSS custom properties:

```css
--bg1: rgb(32, 31, 38);   /* primary background */
--bg2: rgb(19, 19, 23);   /* secondary background */
--fg1: rgb(188, 191, 210); /* primary text */
--fg2: rgb(134, 140, 171); /* secondary text */
--text-link: rgb(142, 116, 189);
--text-link-hover: rgb(144, 134, 221);
```

- Font family: `Roboto Mono, monospace` — monospace throughout.
- Use CSS variables for all colors; do not hardcode hex/rgb values.
- Dark theme only; no light mode.

---

## Hugo Configuration (`config.yaml`)

- Syntax highlight style: `tokyonight-night`, with `noClasses: true` (inline styles, not CSS classes).
- Multilingual: `en` (weight 1) and `es` (weight 1). Both share the same menu structure.
- Taxonomies: `categories`, `tags`, `series` — currently `tags` is actively used.
- Social icons are configured under `params.socialIcons` and rendered via `partials/social.html`.

---

## CI / Deployment

- **Trigger:** Push to `main` branch.
- **Workflow:** `.github/workflows/hugo.yaml`
- **Build command:** `hugo --gc --minify --baseURL "<pages-origin>/"`
- **Deploy target:** GitHub Pages (via `actions/deploy-pages`).
- **Hugo version in CI:** `0.115.4 extended` (installed as `.deb` from GitHub releases).

If you upgrade the Hugo version, update the `HUGO_VERSION` env var in `.github/workflows/hugo.yaml`.

---

## Dependency Updates

Renovate is configured (`.github/renovate.json`) to:
- Group all updates into a single PR.
- Use semantic commit style with type `chore`.
- Run on weekends (Europe/Madrid timezone).
- Auto-merge all package updates.

---

## Key Rules & Constraints

1. **No build system other than Hugo.** There is no npm, webpack, or other JS toolchain. Do not introduce one without explicit discussion.
2. **No inline styles in templates** except where unavoidable (e.g. the rawhtml shortcode is for author-controlled content, not template logic).
3. **Images must be committed to `static/images/`** and referenced with an absolute path.
4. **Both language files must be kept in sync** when creating or editing a post that has an ES translation. If only one language is written, the ES file can be omitted — but do not delete an existing translation without intent.
5. **Front matter must use TOML** (`+++` delimiters), not YAML (`---`) or JSON.
6. **Tags are lowercase hyphen-separated slugs.** Check existing tags in `config.yaml` and existing posts before inventing new ones.
7. **Do not commit the `public/` directory.** It is the Hugo build output and is managed by CI.
