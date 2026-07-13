# Directory Module v2.1.0 — Release Notes

## Overview

This release completes the Directory Module redesign for the Barangay Bolbok website: a single, unified map + list interface replacing the four previously separate directory sections (Map Locations, Business Directory, Organization Directory, Emergency Directory), plus a fully admin-managed, database-driven category system that now covers all four modules.

## New Features

- **Unified directory interface** — one interactive map and one filterable list serving all four directory types, instead of four stacked, independently-scrolling sections.
- **Marker clustering** — nearby map markers group into clusters at wider zoom levels and separate automatically as the user zooms in.
- **Near Me** — opt-in geolocation with selectable radius chips to filter results by distance from the user's current location.
- **Featured / verified badges** and **computed open/closed status** based on each listing's configured hours.
- **Photo galleries** on listing detail views, with a lightbox for full-size viewing.
- **Admin-managed category taxonomy** for all four modules (Map Locations, Business Directory, Organization Directory, Emergency Directory) — parent categories and subcategories are now created, edited, and organized entirely from the admin panel, with no hardcoded lists in the application code.

## UI/UX Improvements

- Parent-category chip bar with a secondary subcategory chip row that appears when a parent category is selected, so results can be filtered by either level.
- Clear Search (✕) control that resets search text, category selection, and subcategory selection in one action.
- Animated map navigation (smooth `flyTo` transitions between selected listings) in place of instant jump-cuts, with an automatic fallback to instant positioning when the browser's reduced-motion preference is set.
- Selected-listing marker highlight state (enlarged, higher-contrast marker + front-most stacking) so the active selection is unambiguous on the map.
- Popup fade-in animation for map marker popups.
- Loading skeleton placeholders in the results list while directory data is being fetched, replacing a blank list during load.
- Parent category shown alongside subcategory on both list items and the detail panel, so the category hierarchy is always visible at a glance.

## Category Management Enhancements

- Category data model generalized from a Business-only feature to all four directory modules, using a `module`-scoped Parent Category → Subcategory structure.
- Composite `UNIQUE(module, name)` constraints allow the same category name (e.g. "Hospital") to exist independently under different modules (Map Locations and Emergency Directory) without collision.
- Admin Category Management screen gained per-module tabs; the same searchable-select category picker used for Business Directory forms is now used for Map, Organization, and Emergency forms as well.
- Subcategory deletion is now protected against removing a category still in use by an existing listing, checked against the correct underlying table for that subcategory's module.
- New directory modules can be introduced in the future without any code changes — the category system discovers modules dynamically from admin-entered data rather than a hardcoded whitelist.

## Accessibility Improvements

- `aria-label`s added to the subcategory filter row and the interactive map container.
- Reduced-motion handling for map transitions, popup animations, and skeleton-loading shimmer, respecting the user's OS-level motion preference throughout.
- Search field paired with a visible, keyboard-operable Clear Search control with an appropriate accessible label.

## Performance Improvements

- Incremental, batched rendering of the results list (via `IntersectionObserver`) instead of rendering the full result set at once.
- Image lazy-loading for listing photos and gallery images.
- Marker clustering reduces the number of DOM/map elements rendered at low zoom levels.

## Migration Notes

- `migrations/add_directory_category_modules.sql` is the only database migration required for this release. It must be run once in the Supabase SQL Editor **after** the previously-applied `create_directory_categories.sql`.
- The migration is fully idempotent — every statement (column additions, constraint changes, seed data, and the one data remap) is safe to run more than once against the same database without error or data loss.
- It adds a `module` column to `directory_category_groups` and `directory_subcategories`, replaces their prior global `UNIQUE(name)` constraints with `UNIQUE(module, name)`, seeds the Map Locations / Organization Directory / Emergency Directory category taxonomies, removes leftover hardcoded `CHECK` constraints on the `category` columns of `directory_map_locations`, `directory_organizations`, and `directory_emergency`, and remaps one existing Emergency Directory record (`Hospitals` → `Hospital`) to match the new taxonomy.
- No existing directory records are removed or lost by this migration; all changes are additive or metadata-only, aside from the single value remap described above.

## Breaking Changes

None. All changes are additive at the database and API level. Existing listings, categories, and public/admin API response shapes remain compatible; the public category API now returns data grouped under a `modules` key rather than a flat list, which the shipped frontend code already accounts for.

## Known Limitations

- CSRF protection has not been added to admin API routes in this release; it remains a project-wide item outside this release's scope.
- No automated rollback script is provided for the new migration, consistent with this project's existing convention of forward-only, manually-run migrations.
- Admin-panel UI testing for this release was performed via direct API/database verification rather than interactive login-based testing, per the project's standing rule against signing into authenticated admin sessions.

## Future Enhancements

- Extend the admin-managed category system to any additional directory modules introduced later, reusing the existing architecture without further schema changes.
- Consider adding CSRF protection across admin API routes.
- Consider adding an automated migration rollback mechanism if the project's migration set grows further.
