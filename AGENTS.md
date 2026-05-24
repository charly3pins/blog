# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

This is a personal blog built with [Astro](https://astro.build/) (static site
generator). Content is written in Markdown, layouts are Astro components, and
the site is deployed to GitHub Pages via GitHub Actions.

- **Site URL:** https://charly3pins.dev
- **Runtime:** Bun
- **Language:** English only

---

## Build & Development Commands

| Command      | Description                         |
|--------------|-------------------------------------|
| `make run`   | Start dev server (`bun run dev`)    |
| `make build` | Production build (`bun run build`)  |
| `bun run dev`      | Dev server at http://localhost:4321 |
| `bun run build`    | Build to `./dist/`                  |
| `bun run preview`  | Preview production build            |

### Testing

This is a static content site. "Testing" means:
1. Run `bun run dev` and verify the site renders correctly in a browser.
2. Run `bun run build` and confirm it exits without errors.

---

## Repository Structure

```
blog/
├── astro.config.mjs      # Astro configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript config
├── src/
│   ├── components/       # Reusable Astro/React components
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   └── LibraryTabs.tsx
│   ├── content/
│   │   ├── config.ts     # Zod schemas for blog + projects
│   │   ├── blog/         # Blog posts (EN, YAML frontmatter)
│   │   └── projects/     # Project write-ups
│   ├── layouts/
│   │   └── Base.astro    # HTML shell (head, OG meta, fonts)
│   ├── pages/
│   │   ├── index.astro         # Home page
│   │   ├── about.astro         # About page
│   │   ├── projects.astro      # Projects listing
│   │   ├── library.astro       # Library (books/tools)
│   │   ├── rss.xml.ts          # RSS feed
│   │   └── blog/
│   │       ├── index.astro     # All posts listing
│   │       └── [slug].astro    # Single post template
│   └── styles/
│       └── global.css          # All styles (CSS custom properties)
├── public/
│   ├── favicon.ico
│   └── images/           # All site images
└── .github/
    └── workflows/
        └── deploy.yaml   # GitHub Pages deployment
```

---

## Content Conventions

### Front Matter Format

All content files use **YAML front matter** (delimited by `---`):

```yaml
---
title: "Post Title Here"
date: "2025-04-21"
description: "One-sentence summary used as meta description and on list pages."
tags: ["go", "hugo", "software-engineering"]
draft: false
---
```

- `title`: Title case, human-readable.
- `date`: ISO 8601 (`YYYY-MM-DD`).
- `description`: Required. One concise sentence. Used on listing pages and OG meta.
- `tags`: Lowercase, hyphen-separated slugs (e.g. `"software-engineering"`, not `"Software Engineering"`).
- `draft`: Boolean (defaults to `false`). Draft posts are excluded from production builds.

### Naming Conventions for Content Files

- Use **kebab-case** slugs that match the post title: `my-post-title.md`
- Place blog posts in `src/content/blog/`, project write-ups in `src/content/projects/`.

### Content Writing Style

- Write in clear, direct prose. First person is appropriate.
- Use `##` for top-level sections within a post (the page `<h1>` is the title).
- Use `###` / `####` for subsections.
- Code blocks must specify a language for syntax highlighting (e.g. ` ```go `).
- Image paths in Markdown: use absolute paths from `public/` (e.g. `![alt](/images/foo.png)`).

---

## Template Conventions

- Components use Astro's `.astro` format (HTML-first templating with JS expressions).
- React components (`.tsx`) only when client interactivity is needed. Use `client:load` directive.
- All pages extend `Base.astro` which provides the HTML shell, meta tags, and OG data.
- Colors use CSS custom properties defined in `global.css`.

---

## CSS Conventions

All styles are in `src/styles/global.css`. The design uses CSS custom properties:

```css
--bg: #0c0c0b;         /* primary background */
--fg: #d4d2cc;         /* primary text */
--dim: #85827c;        /* secondary text */
--faint: #383632;      /* borders / faint elements */
--red: #8b3a2a;        /* accent */
--green: #4a6b3a;      /* secondary accent */
```

- Font family: `DM Mono` + `Noto Serif JP` (for CJK).
- Dark theme only; no light mode.
- Use CSS variables for all colors; do not hardcode hex/rgb values.

---

## CI / Deployment

- **Trigger:** Push to `main` branch.
- **Workflow:** `.github/workflows/deploy.yaml`
- **Build command:** `bun run build`
- **Deploy target:** GitHub Pages (via `actions/deploy-pages`).
- The build output goes to `./dist/`.

---

## Dependency Updates

Renovate is configured (`.github/renovate.json`) to:
- Group all updates into a single PR.
- Use semantic commit style with type `chore`.
- Run on weekends (Europe/Madrid timezone).
- Auto-merge all package updates.

---

## Key Rules & Constraints

1. **Runtime is Bun.** Use `bun` for all package management and scripts.
2. **Images must be committed to `public/images/`** and referenced with an absolute path.
3. **Front matter must use YAML** (`---` delimiters), not TOML (`+++`) or JSON.
4. **Tags are lowercase hyphen-separated slugs.** Check existing tags before inventing new ones.
5. **Do not commit the `dist/` directory.** It is the Astro build output and is managed by CI.
