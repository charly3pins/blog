# charly3pins.dev — Astro

Personal site of [@charly3pins](https://github.com/charly3pins). Built with Astro.

## Stack

- [Astro](https://astro.build) — static site generator
- React — only for the Library tab switcher (`client:load` island)
- DM Mono + Noto Serif JP — typography
- CSS custom properties — no Tailwind, no UI frameworks
- Vercel — hosting

## Local dev

```bash
bun install
bun run dev        # → http://localhost:4321
```

## Build

```bash
bun run build
bun run preview    # preview production build locally
```

## Content

### Blog posts

Add Markdown files to `src/content/blog/`:

```md
---
title: "Your post title"
date: 2024-11-01
description: "Optional short description for SEO and OG."
tags: ["AI", "Architecture"]
draft: false
---

Your content here...
```

### Projects

Add Markdown files to `src/content/projects/`:

```md
---
name: "project-name"
description: "One-line description."
year: "2024"
url: "https://example.com"        # optional: live URL
repo: "https://github.com/..."    # optional: source repo
tags: ["Go", "CLI"]
---
```

### Library

Edit `src/components/LibraryTabs.tsx` — the three arrays at the top:
- `BOOKS` — books you recommend
- `TOOLS` — tools you use
- `RESOURCES` — channels, podcasts, newsletters

## Migrating from Hugo

If you have existing Hugo posts, use the migration script:

```bash
bun migrate-hugo.ts ../old-blog/content/posts ./src/content/blog
```

This transforms Hugo frontmatter fields to Astro-compatible format.

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Framework preset: **Astro**
4. Build command: `bun run build`
5. Output dir: `dist`

For GitHub Actions auto-deploy, set these secrets in your repo:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Structure

```
src/
├── components/
│   ├── Nav.astro
│   ├── Footer.astro
│   └── LibraryTabs.tsx    ← only React component
├── content/
│   ├── config.ts          ← Zod schemas for collections
│   ├── blog/              ← .md posts
│   └── projects/          ← .md projects
├── layouts/
│   └── Base.astro         ← HTML shell, meta, fonts
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── library.astro
│   ├── projects.astro
│   └── blog/
│       ├── index.astro
│       └── [slug].astro
└── styles/
    └── global.css         ← design tokens + utilities
```
