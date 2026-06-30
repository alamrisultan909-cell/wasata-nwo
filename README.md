# Mediation Platform - Code Export

Static website export for the Wasata platform with three main areas:

## Project Structure
- `/public-site`: public landing pages
- `/crm-system`: administrative and management panels
- `/knowledge-base`: educational and support content
- `/shared`: shared CSS/JS assets used across sections without changing the existing visual identity

## What was improved
- Reduced repeated setup across the static pages by introducing shared assets for base styling and the knowledge-base theme.
- Improved HTML semantics, metadata, focus states, and responsive behavior while preserving the same color palette and overall look.
- Enhanced navigation clarity and reading flow in the knowledge base, especially `knowledge-base/customer-support.html`.
- Kept existing routing behavior intact by updating `vercel.json` to expose shared static assets safely.

## Local preview
Because the project is a static export, you can preview it with any simple static server from the repository root:

```bash
npx serve .
```

Or with Python:

```bash
python3 -m http.server 3000
```

Then open the site locally and navigate through:
- `/public-site/index.html`
- `/crm-system/dashboard.html`
- `/knowledge-base/index.html`
