# Stage 7 — Mobile & Responsive Audit

Status: COMPLETE (browser viewport validation)

Date: 2 October 2026

## Scope and findings

Reviewed all nine routes at 375, 430, 768, 1024 and 1440 CSS pixels using the compiled production site. The original pages had no document-level horizontal overflow. Improvements addressed small tap targets, cramped tablet package cards and a clipped input area in the illustrative phone.

## Changes

- Compact navigation now covers phone and tablet widths below 1024px. Its JavaScript resize boundary matches the CSS boundary.
- Tablet pricing uses a readable single-column layout, larger text and natural content heights instead of three narrow cards.
- Brand links, footer links, contact links, dropdown controls, mobile service links, FAQ category links and dialog close controls have at least 44px targets.
- The illustrative phone sizes to its content so the bottom input area is visible.
- Legal dialogs stay within short viewports and scroll internally; menus and dialogs contain scroll chaining.
- Form controls have scroll clearance for the fixed header. Existing 16px input text is preserved.
- Mobile footer spacing is reduced to balance the larger links.
- Production dist output was rebuilt with all nine pages and the 404 page.

## Verification

- 45 route/width combinations checked after rebuilding: zero document-level horizontal overflow, no phone content clipping and no undersized visible link/button targets in the checked page states. Results are in stage-7-viewport-results.json.
- Visual spot checks covered phone page heroes, service illustrations, tablet pricing, desktop layout, footer-related controls, FAQ expansion and the contact form.
- Mobile/tablet menu opens and closes; Escape closes it. Resizing an open tablet menu to 1024px resets its state and restores desktop navigation.
- Desktop service dropdown opens and closes with Escape.
- FAQ expansion remains readable on a phone viewport.
- Privacy dialog at 375 x 568 fits the viewport, scrolls internally and has a reachable close control.
- Sticky advice CTA remains visible while browsing mobile service sections.
- npm run build: PASS, including prerendering nine routes and 404.

## Limits and next stage

These are browser viewport checks, not physical iOS/Android device tests. Device keyboards, orientation changes and browser-specific safe-area behavior still merit real-device testing. No enquiry was sent.

npm ci reported two high-severity dependency advisories. Dependency remediation and the broader functionality audit belong to Stage 8; no forced dependency upgrades were applied during this responsive stage.

Business decisions about prices, ownership, hosting and support remain unchanged. Stage 8 has not been started.
