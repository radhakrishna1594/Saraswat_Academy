# Saraswat Academy — Standard Page Template

Use `page-template.html` as the starting point for new static pages.

## Required replacements

- `{{PAGE_TITLE}}` — unique, descriptive page title.
- `{{PAGE_DESCRIPTION}}` — unique meta description for the page.
- `{{PAGE_AUTHOR}}` — page author/organization.
- `{{PAGE_PATH}}` — canonical path without the leading domain.
- `{{OG_IMAGE}}` — existing absolute-path image, preferably WebP.
- `{{OG_IMAGE_ALT}}` — useful image description.
- `{{H1_TITLE}}` — the single primary H1.
- `{{BREADCRUMBS}}` — breadcrumb list items.
- `{{HERO_INTRO}}` — optional introductory paragraph.
- `{{PAGE_CONTENT}}` — page-specific semantic HTML.
- `{{STRUCTURED_DATA}}` — optional JSON-LD appropriate to the page.

## Standard head

Every new indexable page should keep:

- UTF-8 charset and responsive viewport
- one unique title
- one unique meta description
- one canonical URL on `https://www.saraswatacademy.in/`
- robots directive
- favicon
- one consistent Open Graph set
- one consistent Twitter card set
- shared `styles.css` and `header.css`
- shared `config.js`, `header.js`, and `loader.js`

## Standard body

Every new page should use:

- the shared header and footer containers
- a skip link
- one semantic `main`
- one primary `h1`
- breadcrumbs where appropriate
- semantic `article` content
- descriptive image `alt` text
- relative internal links that resolve from the page location, or root-absolute links for shared site navigation

Do not copy a large page-specific `<style>` block into new pages. Put reusable styling in shared CSS.

## Page-specific templates

This master template is the baseline for About, Contact, articles, resource pages, link pages, MCQ pages, worksheets, PYQs, notes, and similar static pages. Specialized chapter/solution layouts may extend the same SEO head and structural conventions without changing their existing content model.
