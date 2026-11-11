# Stage 9 — SEO, Accessibility & Performance

Completed 5 October 2026. Approved layout, branding, hierarchy and marketing copy retained. Stage 10 has not started.

## Issues discovered and changes implemented

| Area | Finding | Implemented change |
|---|---|---|
| Images | Both logos fetched the complete 949,006-byte brand board through SVG cropping. | Preserved the crop in a 454 × 188 WebP, 11,326 bytes (98.8% smaller). Added intrinsic dimensions, async decoding and native lazy loading on the footer logo. Original source retained; unused board excluded from dist. |
| Fonts | External Google stylesheet blocked font discovery; unnecessary Manrope weights were requested. | Self-hosted the approved Inter 400–700 and Manrope 600–800 variable Latin WOFF2 fonts, 48,256 + 24,836 bytes. Added two font preloads and font-display: swap. Included OFL licences. Updated privacy text to reflect local hosting. |
| Metadata | Open Graph image and Twitter sharing metadata missing. | Added a 1200 × 630 branded JPEG sharing card (63,037 bytes), image alternatives/dimensions, site name and Twitter summary_large_image metadata on every indexable route. Retained unique natural titles/descriptions. |
| Canonicals | Directory routes and canonical/sitemap URL forms differed. | Generated consistent HTTPS trailing-slash canonical, social and sitemap URLs. All nine pages represented; 404 stays noindex and outside sitemap. Production host must enforce the same URL convention. |
| Structured data | ProfessionalService implied LocalBusiness without an available street address. | Replaced with factual Organization, WebSite and WebPage graph; Service data on three service pages; BreadcrumbList on inner pages. Used only existing name, telephone, email, services and Penang service area. No invented address, ratings, opening hours or claims. |
| Headings | Mock interface text used h4; footer skipped heading levels on 404. | Preserved appearance with styled paragraphs for illustrative headings and h2 footer section headings. One H1 per page; no generated heading-level skips. |
| Links/semantics | Repeated “Explore this step” labels lacked service context; skip target was not explicitly focusable. | Added screen-reader service context to those links and tabIndex=-1 to main. Grouped demo interfaces as labelled illustrative images so sample controls and headings do not confuse screen readers. |
| Forms | Native validation bubbles did not provide persistent error descriptions. | Added inline field errors, aria-invalid, aria-describedby, and focus on the first invalid field. Labels, required fields, autocomplete and native input types retained. |
| Contrast | Small contact labels, optional form label and blueprint labels were below 4.5:1; faint input borders. | Darkened the affected labels and illustrative muted text, strengthened field borders, and improved focus contrast against dark sections. Added mobile bottom scroll clearance for focused controls. |
| Motion | Desktop floating continued indefinitely without a manual stop. | Added a restrained 44px-tall Pause/Resume control. Pausing reveals the complete static scene and stops floating/parallax; resuming does not replay the entrance. Existing reduced-motion immediate display and mobile no-idle-loop behaviour retained. |
| Third parties | External fonts were the only automatic third-party requests. | Removed them. WhatsApp and email remain normal links; no analytics, chat widgets, maps, video or tracking dependencies introduced. |

## SEO and local relevance

Nine readable, prerendered HTML pages expose approved services and local Penang context without requiring hydration or animation. Titles/descriptions are unique, canonical/social URLs match the sitemap, local assets/links resolve, robots permits crawling, and the favicon is retained. Added an Apple touch icon from the supplied brand asset. No keyword stuffing or marketing copy rewrite.

JSON-LD is parsed and checked in generated HTML. Organization is used rather than inventing the address needed for Google's LocalBusiness rich-result requirements: [Google LocalBusiness documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business). FAQPage was evaluated and omitted: Google's current documentation records the FAQ rich-result deprecation in May 2026: [Search documentation updates](https://developers.google.com/search/updates). There are no invented testimonials, reviews or certifications.

## Verification

- Production build passes: nine routes plus 404. Final JS 261.04 KB raw / 80.91 KB gzip; CSS 64.81 KB raw / 14.35 KB gzip. No new dependency for Stage 9. Motion continues to use the small Framer Motion native-animation entry point.
- Generated HTML audit passes for every page: title/description uniqueness, canonical alignment, H1, heading order, image alternatives/dimensions, local targets, JSON-LD parsing and sitemap count. See stage-9-static-results.json and scripts/seo-audit.py.
- All nine pages checked in browser at normal desktop viewport and 375 × 812: no horizontal overflow; no detected contrast failures for ordinary leaf text after fixes. Gradient heading colours reviewed separately; illustrative interfaces have descriptive image semantics. This is a targeted contrast review, not an exhaustive WCAG certification. See stage-9-browser-results.json.
- Pause/Resume works; service disclosure and mobile menu close with Escape. Native legal dialog closes with Escape and returns focus to its opening button. Skip link focuses main. Empty form submission exposes five labelled errors and focuses Name.
- Four enquiry regression tests pass: validation, draft formatting, JSON delivery and failure handling. Tests make no external requests.
- Local HTTP checks return 200 for all nine routes, fonts, icons, social image, robots and sitemap; an unknown URL returns an actual 404. See stage-9-http-results.json.
- Production dependency audit reports zero vulnerabilities.
- Reduced-motion handlers/CSS were inspected. This browser provides no supported reduced-motion or CPU/network emulation; an OS-preference test, assistive-technology test and throttled physical-device test remain external checks.

## Performance and Core Web Vitals

LCP: the headline is readable in prerendered HTML. Hero graphics use HTML/SVG, with no large hero photo/video. Font files are discovered early with preload; swap avoids invisible text. Cold font substitution can still change text metrics, so verify LCP and layout on the actual host and a slow device.

INP: hero entrance/floating runs through native animations; mouse parallax is frame-throttled, desktop-only and capped at 3/5/7px. Animation pauses offscreen and when the tab is hidden. Mobile has no continuous floating or parallax. There are no expensive scroll loops or third-party widgets. The 80.91 KB compressed single React bundle is reasonable for this small site; splitting every section would add complexity without a demonstrated benefit. Initial hydration and font rendering still need field validation on lower-end phones.

CLS: logo dimensions, fixed hero canvas sizes and transform/opacity motion preserve layout. Form error expansion is triggered by user interaction. Fonts remain the primary residual layout-shift risk. Do not claim a measured CLS, LCP or INP pass from these source and browser checks: no Lighthouse/throttled CWV benchmark or field data was collected in this environment.

Images: the only page bitmap is the shared optimised logo. Below-fold instance uses lazy loading, header instance is eager. Remaining hero/service visuals are code-native SVG/HTML. The social JPEG is metadata for sharing rather than a page-load asset. Existing SVG favicon and new 180px PNG Apple icon are small. AVIF/responsive variants would add little benefit for an 11 KB logo displayed around 97 × 40px.

## Remaining issues and launch configuration

### P1 — Must fix or confirm before launch

1. Confirm the production HTTPS origin in src/config/config.js. It currently remains https://biltech-solution-v1.chris-keith5463.chatgpt.site. Rebuild when it changes; deploy the new dist, including fonts/icons/metadata. Nothing was published during Stage 9.
2. Configure the host for directory index routes, one canonical domain and trailing-slash redirects, HTTPS, and real 404 responses. Avoid rewriting unknown URLs to a 200 homepage. Local preview checks cannot establish production routing behaviour.
3. Confirm ownership/accuracy of the existing hello@biltech.com address and +60 16-453 2818 contact. Approved commercial/support/ownership decisions and legal text still require business sign-off from earlier stages; no facts were invented to fill them.
4. If direct form delivery is a launch requirement, configure a secure formEndpoint and verify delivery. Otherwise the existing, clearly disclosed WhatsApp draft flow is functional and requires the visitor to press Send in WhatsApp.

### P2 — Recommended before launch

- Enable Brotli/gzip for HTML/CSS/JS/SVG and long cache lifetimes for hashed bundles. Use appropriate revalidation/versioning for fixed-name logo/font files; do not apply an immutable year-long cache to HTML. Serve WOFF2 as font/woff2 and sitemap as XML.
- Test with VoiceOver/TalkBack/NVDA and keyboard-only use, 200% zoom, landscape phones and OS reduced motion. Pay attention to sticky header/CTA focus clearance, dialog focus and form errors. Current review targets WCAG 2.2 AA in practical scope; it is not a conformance certificate.
- Run PageSpeed/Lighthouse on the production HTTPS site with mobile throttling and test on a lower-end physical phone. Inspect font-related layout shifts, main-thread hydration and hero cost. Confirm LCP <=2.5s, INP <=200ms and CLS <=0.1 at the 75th percentile when sufficient field data exists.
- Validate deployed URLs in Google's Rich Results Test and Schema.org validator. A locally parsed graph is not a guarantee of rich-result eligibility or appearance.

### P3 — Optional future improvement

- Introduce indexable standalone legal pages if required by business/legal review.
- Consider further code splitting only if measured hydration or interaction delays justify it.
- Add verified business-profile/social URLs or a verified business address to schema when supplied. Keep genuine reviews and case studies factual.

## After deployment

Check HTTPS redirects, response codes, caching/compression, font/image loading, console and hydration errors, canonical/social tags, robots and sitemap on the live domain. Submit the sitemap in Search Console and inspect representative pages for indexability. Test the social sharing card, WhatsApp/email destinations and any configured form delivery. Monitor Core Web Vitals once traffic produces field data; repeat mobile accessibility checks on real devices.

Stage 9 status: COMPLETE — safe code optimisation and local validation finished. Production configuration and external validation remain as classified above. Stopped before Stage 10.

