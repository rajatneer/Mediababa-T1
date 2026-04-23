# Mediababa Design System Notes

## Figma-style workflow in code

1. Tokens first
- Color roles
- Type roles
- Spacing scale
- Radius and elevation
- Motion durations and easing

2. Themes second
- Light theme and dark theme map semantic roles to color values.

3. Components third
- Header, nav pills, cards, live feed, newsletter block, and buttons all consume tokens.

4. Pages last
- Home, category, and article pages are composed from reusable styles and shared JavaScript rendering functions.

## Naming strategy

- Global tokens use the prefix-style semantic pattern, for example: --bg-canvas, --text-main, --brand-primary.
- Components avoid hardcoded values and consume tokens.

## Responsiveness strategy

- Mobile-first base layout.
- Progressive enhancement at 48rem and 64rem breakpoints.
- Content density increases on desktop while preserving touch ergonomics for mobile.

## Accessibility baseline

- Skip link for keyboard users.
- Focus-visible styles.
- Form labels and consent validation.
- ARIA live region for newsletter feedback.
