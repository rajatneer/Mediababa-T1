# Mediababa

Mediababa is a mobile-first and desktop-compatible editorial web application design inspired by modern media portals and rebuilt with a cleaner, faster, and bolder user experience.

## What is included

- Mobile-first homepage with bold editorial hierarchy
- Category listing template
- Article detail template
- Live updates panel
- Global search over story dataset
- Newsletter subscribe form with validation
- Light and dark themes with persistent preference
- Tokenized CSS architecture (Figma-style system workflow)

## Tech stack

- HTML
- CSS
- Vanilla JavaScript

## Project structure

- index.html
- pages/category.html
- pages/article.html
- src/css/tokens.css
- src/css/themes.css
- src/css/base.css
- src/css/layout.css
- src/css/components.css
- src/js/theme.js
- src/js/search.js
- src/js/live.js
- src/js/app.js
- src/data/content.json

## Run locally

Use any static server. Example with Python:

```powershell
python -m http.server 5500
```

Then open:

- http://localhost:5500/index.html

## Notes

- Content currently uses sample JSON data in src/data/content.json.
- This is frontend-only and does not include backend persistence for subscriptions.
- You can replace sample content with CMS or API data later without changing core layout components.
