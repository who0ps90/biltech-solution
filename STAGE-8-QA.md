# Stage 8 — Functionality & Technical QA

Date: 2 October 2026

Status: COMPLETE — local implementation verified; external delivery configuration remains.

## PASS

- All nine production pages render with no browser console or hydration errors observed.
- Current local navigation destinations and assets return HTTP 200; same-page anchor targets exist. Evidence: stage-8-page-results.json and stage-8-http-results.json.
- Desktop service dropdown navigation, mobile menu navigation to Contact, FAQ category links, and 404-to-home recovery work.
- All 18 FAQ answers open and close. Legal dialogs open and Escape closes them.
- Unknown local URLs return HTTP 404 and display the custom not-found page.
- Empty required fields, punctuation-only phone numbers and malformed optional email addresses block submission. Correcting the inputs clears validation; email remains optional in WhatsApp mode.
- Valid test input prepares the correct WhatsApp recipient and an encoded draft with nine lines, real newline characters, and the optional-email fallback. The status and manual draft link appear; editing removes the stale link. No WhatsApp message was sent.
- Seven unique static WhatsApp links target the configured number. Email links target hello@biltech.com. These checks validate links, not account ownership or mailbox delivery.
- Four Node regression tests pass: phone validation; draft encoding/newlines; successful JSON transport; HTTP/network/timeout failures. Network behavior is simulated and sends no external requests.
- Production client build, server renderer and prerendering all pass with the updated dependencies; nine routes and the 404 page generated.
- npm installation audit reports zero known vulnerabilities after the upgrades. Dependency tree is valid.

## FIXED

- Phone validation previously accepted seven hyphens as a number. It now requires at least seven digits and permits only the supported formatting characters.
- Centralized form validation includes the service selector and trims submitted values.
- Replaced draft construction with a tested message builder using actual line breaks.
- Endpoint-mode email requirements are declared in the field and label, rather than changed during submission and left inconsistent after early validation returns.
- Added an Open WhatsApp draft recovery link because the in-app browser did not open the scripted popup. Editing the form clears the old link and status.
- Extracted and tested the optional JSON delivery helper, preserving the 15-second timeout and failure propagation.
- Updated Vite 8.0.13 to 8.3.2 and PostCSS 8.5.6 to 8.5.28, with exact versions and an updated lockfile. This clears the two dependency advisories recorded in Stage 7.

## REQUIRES CONFIGURATION

- formEndpoint remains null: the active flow prepares WhatsApp drafts. Direct email/server delivery, its CORS policy, server validation, spam handling and live delivery require an endpoint before end-to-end testing is possible. Loading/success/error transport paths were tested with simulated responses; live server delivery was not tested.
- Production hosting must serve directory index pages and return 404.html with an HTTP 404 status. The local preview satisfies these checks; a production host has not been tested.
- Set the final site origin before moving domains and rebuilding.
- Confirm WhatsApp handoff on real devices and external email-client behavior. The local browser exposes a usable draft link; external messaging was not completed.

## REQUIRES CLIENT INFORMATION

- Confirm the published business email and WhatsApp number.
- Finalize package scope/prices, hosting and support arrangements, ownership and handover terms.

## Scope notes

No booking, payment, search, filters, calculators or CMS exist in this project, so those checks are not applicable. Physical-device keyboard behavior and measured layout-shift/performance testing remain outside this local Stage 8 pass. Stage 9 has not started.
