# Full Site Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign charly3pins.dev with a peladonerd-style link-in-bio homepage and an opencode.ai-inspired dark aesthetic across all pages.

**Architecture:** Hugo static site, custom theme (no external theme dependency). All changes are limited to `static/css/style.css` and `layouts/` templates. No JS toolchain is introduced. The design is dark monospace-terminal, single-column, mobile-friendly.

**Tech Stack:** Hugo 0.115.4 extended, Go HTML templates, plain CSS with custom properties.

**Branch:** `full-redesign`

---

## Design Tokens

New CSS custom properties (replacing all existing ones in `style.css`):

```css
--bg1: #0c0c0e;          /* near-black page background */
--bg2: #111115;          /* card / secondary background */
--fg1: #cfcecd;          /* warm off-white — primary text */
--fg2: #7a7875;          /* muted secondary text */
--accent: #7c6db5;       /* purple accent — links, tags, highlights */
--accent-hover: #9088d9; /* lighter purple on hover */
--border: #1e1d24;       /* very subtle divider / border */
```

Font: `Roboto Mono, monospace` (unchanged).

---

## Task 1: Rewrite `static/css/style.css`

**Files:**
- Modify: `static/css/style.css`

Replace the entire file. The new file must:

1. Define all CSS custom properties on `*` (the new tokens above).
2. Reset `body`, `a`, headings, `ul`, `li`, `code`, `blockquote`, `.highlight` using those tokens.
3. Add layout classes:
   - `.main` — `max-width: 48rem; margin-inline: auto; min-height: 80vh; padding-inline: 1.5rem`
   - `.main-content` — `padding-block: 2rem` (remove the old tight fit-content constraint)
4. Add profile/homepage classes:
   - `.profile-card` — `display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.75rem; padding-block: 3rem 2rem`
   - `.profile-avatar` — `width: 96px; height: 96px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border)`
   - `.profile-name` — `font-size: 1.5rem; color: var(--fg1); margin: 0; font-weight: 400; text-decoration: none`
   - `.profile-bio` — `font-size: 0.9rem; color: var(--fg2); margin: 0`
   - `.profile-socials` — `display: flex; gap: 1rem; align-items: center`
5. Add link-button classes:
   - `.link-buttons` — `display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 32rem; margin-inline: auto; padding-bottom: 3rem`
   - `.link-button` — block element, `display: block; padding: 0.75rem 1.25rem; border: 1px solid var(--border); color: var(--fg1); font-family: inherit; font-size: 0.95rem; transition: border-color 0.15s, color 0.15s`
   - `.link-button::before` — `content: "> "; color: var(--accent)`
   - `.link-button::after` — `content: " →"; color: var(--fg2)`
   - `.link-button:hover` — `border-color: var(--accent); color: var(--accent-hover); text-decoration: none`
6. Add post-list classes:
   - `.post-list` — `display: flex; flex-direction: column; padding-block: 1rem`
   - `.post-row` — `padding-block: 1.25rem; border-bottom: 1px solid var(--border)`
   - `.post-row:last-child` — `border-bottom: none`
   - `.post-row-meta` — `font-size: 0.8rem; color: var(--fg2); margin-bottom: 0.25rem`
   - `.post-row-title` — `font-size: 1rem; color: var(--fg1); font-weight: 400` (link styling: accent color, no underline, hover: accent-hover)
   - `.post-row-description` — `font-size: 0.875rem; color: var(--fg2); margin-top: 0.25rem`
7. Style `.tag-label` with new tokens (keep existing shape, update colors).
8. Add `.post-hero-image` — `max-width: 100%; height: auto; margin-block: 1rem`.
9. Add responsive breakpoint:
   ```css
   @media (max-width: 768px) {
     .main { padding-inline: 1rem; }
     .main-content { padding-inline: 0; }
   }
   ```
10. Keep nav styling: centered flex, `gap: 1.5rem`, `padding-block: 1.25rem 2rem`. Active link uses `color: var(--accent)`.
11. Footer: `padding-block: 2rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--fg2)`.

**Step 1: Write the new style.css**

Full replacement — no content from the old file is preserved except the structural intent.

**Step 2: Build-check**

```bash
hugo
```
Expected: exits 0, no errors. (Visual check via `make run` is deferred to after all templates are updated.)

**Step 3: Commit**

```bash
git add static/css/style.css
git commit -m "style: redesign CSS — new dark palette and layout classes"
```

---

## Task 2: Redesign `layouts/index.html` (link-in-bio homepage)

**Files:**
- Modify: `layouts/index.html`

Replace the entire template. The `"main"` block must render:

1. **Profile card** — avatar (`/images/face.png`), name (`charly3pins`), bio (`Software engineer.`), social icons via `partial "social.html"`.
2. **Link buttons** — 3 site-section buttons (Blog, Projects, About) followed by one button per entry in `.Site.Params.socialIcons`, each linking to `.url` with `target="_blank" rel="me"`.

```html
{{ define "main" }}
<div class="profile-card">
  <img class="profile-avatar" src="/images/face.png" alt="charly3pins" />
  <span class="profile-name">charly3pins</span>
  <p class="profile-bio">Software engineer.</p>
  <div class="profile-socials">
    {{- partial "social.html" .Site.Params.socialIcons -}}
  </div>
</div>

<div class="link-buttons">
  <a class="link-button" href="{{ "blog/" | relLangURL }}">Blog</a>
  <a class="link-button" href="{{ "projects/" | relLangURL }}">Projects</a>
  <a class="link-button" href="{{ "about/" | relLangURL }}">About</a>
  {{ range .Site.Params.socialIcons }}
  <a class="link-button" href="{{ .url }}" target="_blank" rel="me noopener">{{ .name | humanize }}</a>
  {{ end }}
</div>
{{ end }}
```

**Step 1: Replace layouts/index.html**

**Step 2: Build-check**

```bash
hugo
```
Expected: exits 0.

**Step 3: Commit**

```bash
git add layouts/index.html
git commit -m "feat: redesign homepage as link-in-bio profile card"
```

---

## Task 3: Redesign `layouts/_default/list.html` (blog/projects list)

**Files:**
- Modify: `layouts/_default/list.html`

The `"main"` block must render a minimal post list. Keep the existing `$paginator` logic and taxonomy/tag handling — only replace the HTML structure for each post in the loop.

New post row structure inside the range loop:
```html
<div class="post-row">
  <div class="post-row-meta">
    {{ .PublishDate.Format "02/01/2006" }} · {{ .ReadingTime }}'
    {{ range .Params.Tags }}
    <a class="tag-label" href='{{ "tags/" | absURL }}{{ . }}'>#{{ . }}</a>
    {{ end }}
  </div>
  <a class="post-row-title" href="{{ .Permalink }}">{{ .Title }}</a>
  {{ with .Description }}<p class="post-row-description">{{ . }}</p>{{ end }}
</div>
```

The section title (`<h2>{{.Title}}</h2>`) and taxonomy term listing (the `{{if eq .Kind "taxonomyTerm"}}` block) must be preserved unchanged.

**Step 1: Replace layouts/_default/list.html**

**Step 2: Build-check**

```bash
hugo
```
Expected: exits 0.

**Step 3: Commit**

```bash
git add layouts/_default/list.html
git commit -m "style: redesign blog/projects list with minimal post rows"
```

---

## Task 4: Update `layouts/_default/single.html` (post pages)

**Files:**
- Modify: `layouts/_default/single.html`

Two targeted changes only:

1. Replace `style="max-width: 200px"` on the `<img>` with `class="post-hero-image"`.
2. Wrap the metadata line (`PublishDate`, `ReadingTime`, tags, translation link) in a `<div class="post-row-meta">` instead of bare `<span>` so it picks up the new CSS.

All other template logic (Giscus comments script, `.Content`, section check) is untouched.

**Step 1: Edit layouts/_default/single.html**

**Step 2: Build-check**

```bash
hugo
```
Expected: exits 0.

**Step 3: Commit**

```bash
git add layouts/_default/single.html
git commit -m "style: update post page — use CSS class for hero image and meta"
```

---

## Task 5: Restyle nav and footer partials

**Files:**
- Modify: `layouts/partials/nav.html`
- Modify: `layouts/partials/footer.html`

### nav.html

The active menu item currently gets `class="menu-active"`. Add a rule in `style.css` (already covered in Task 1): `.menu-active { color: var(--accent); }`. No structural change needed to the template.

Only tweak: ensure the `<ul id="menu">` has `class="menu"` (already present). No other change.

### footer.html

No structural change. The CSS updates from Task 1 handle the visual restyling. Confirm the template renders correctly after CSS changes.

**Step 1: Verify nav and footer render correctly**

```bash
hugo
```
Expected: exits 0.

**Step 2: Commit**

```bash
git add layouts/partials/nav.html layouts/partials/footer.html
git commit -m "style: nav and footer pick up new CSS — no structural changes"
```

(If no changes were actually needed, skip the commit.)

---

## Task 6: Final build verification

**Step 1: Full production build**

```bash
hugo --gc --minify
```
Expected: exits 0, `public/` directory is created with minified output.

**Step 2: Check for broken references**

```bash
grep -r 'style="max-width: 200px"' layouts/
```
Expected: no output (the inline style was removed in Task 4).

```bash
grep -r 'padding-inline: 5rem' static/css/
```
Expected: no output (old tight layout removed in Task 1).

**Step 3: Commit any final fixups, then push branch**

```bash
git push -u origin full-redesign
```

---

## Visual QA checklist (manual, via `make run`)

After all tasks are done, run `make run` and check:

- [ ] Homepage: avatar centered, name, bio, social icons, then big link buttons
- [ ] Each link button has `>` prefix and `→` suffix
- [ ] Blog list: minimal rows, date · readingtime · #tags, post title, description
- [ ] Blog post: readable width, no tiny inline-styled hero image
- [ ] Nav: horizontally centered, active page highlighted in accent purple
- [ ] Footer: single centered line, minimal
- [ ] Mobile (resize to 375px): no horizontal overflow, link buttons still full-width
- [ ] Dark background on all pages: near-black `#0c0c0e`
- [ ] Syntax highlighting still works on code blocks (uses `syntax.css`, unchanged)

---

## Notes

- The `social.html` partial is called in two contexts: the new `.profile-socials` div on the homepage, and the footer. Both contexts should render correctly as the partial just outputs `<a>` tags with SVG icons — CSS handles sizing/layout.
- The ES (Spanish) translations of the homepage are handled by Hugo's multilingual routing automatically; no separate `index.es.html` is needed.
- Do not touch `static/css/syntax.css` or `static/css/pagination.css`.
- Do not commit the `public/` directory.
