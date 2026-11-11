# Personal test deployment — 14 October 2026

The user authorized personal testing on Vercel Hobby. This is a protected test deployment; client enquiry capture is disabled and Billplz is configured for sandbox mode.

- Preview: https://biltech-solution-3mejrwr2c-chriskeith5463-4431s-projects.vercel.app
- Admin: https://biltech-solution-3mejrwr2c-chriskeith5463-4431s-projects.vercel.app/admin/
- Vercel project: biltech-solution / prj_vccYJdAToH5tiZyZgyFNe34WoMjS
- Deployment: dpl_CdMvYtXUBevUM3UYGE5BwV3qa12P
- API target: staging (the API's Preview target); READY; Singapore; Node 24; Vite.
- Uploaded source: 30 explicitly selected application/configuration/assets files. Private environment files, local Vercel metadata, dependencies and documentation were excluded.

## Layout refresh

The latest Preview adds an inset rounded header, blue hero accent and benefit badges, rounded service panels, expandable illustrative industry journeys and a shorter homepage. The detailed process now appears on About. Existing hero animation and backend code are unchanged.

The local build passes. Desktop and 390px mobile layouts, navigation and example disclosures were checked; there is no horizontal overflow. The deployed homepage and About page render correctly, About has its correct title and process content, and noindex,nofollow is present. No deployed console errors were captured. Local Vite preview at /about without a trailing slash falls back to the homepage HTML and produces a hydration warning; Vercel serves the correct prerendered page. Screenshot: biltech-layout-refresh.png in the current visualization directory.

The backend/admin checks below were performed on the preceding Preview dpl_GjRBqR4Pe8id9Ma3gd47BzFhHHgC. This layout deployment does not change backend files or project environment settings.

## Verification

Local application build succeeds. The Preview build using the assigned host succeeds, generates nine marketing pages plus 404 and private route shells, and emits noindex metadata and robots.txt with Disallow: /. All 13 automated checks pass, including origin enforcement, disabled server-side enquiry capture, and avoiding invoice mutation when Billplz credentials are missing.

Vercel reports the Preview READY. Project SSO protection remains enabled for all Vercel domains. After the user signed in through the Codex browser, the deployed homepage and admin dashboard were verified directly. The dashboard loaded empty enquiries/invoices and refreshed successfully with an empty error alert, validating the authenticated backend and configured Supabase key. No password, session token or private key was read.

The homepage has one h1, its canonical URL matches the Preview host, and its robots metadata is noindex,nofollow. Desktop assets and hero render correctly with no captured console errors. At 390px width, the homepage and contact page have no horizontal overflow; the mobile menu opens and navigates to Contact. The contact form confirms the WhatsApp draft fallback while database capture remains disabled. Screenshots were saved as biltech-hobby-preview.png, biltech-hobby-admin.png and biltech-hobby-mobile.png in the current visualization directory.

The connector still denied protected fetches/build logs with a scope 403. A direct browser navigation to the anonymous admin API was blocked by the browser client, so the separate anonymous deployed endpoint response was not inspected; the automated unauthenticated-request check passes locally.

## Deployment target correction

The initial API request omitted target and unexpectedly created READY deployment dpl_2DMJwNND3mkvUaWfpH3GbpLJzP1B with target production. Cancellation was rejected because the build had already completed. A subsequent explicit staging request created the Preview above. The initial deployment remains protected by the same project SSO setting, with client capture disabled and sandbox payments. The existing porfolio-website project was not deleted or replaced. No real client or payment records were created during this work.

## Remaining checks

Authenticated admin sign-in and record refresh are verified. Database capture remains disabled for this personal preview, so no enquiry creation or invoice creation was exercised against the deployed database.

Billplz requires BILLPLZ_SECRET_KEY, BILLPLZ_COLLECTION_ID and BILLPLZ_X_SIGNATURE_KEY before sandbox checkout can run. A signed provider callback must also be reachable through deployment protection before a complete checkout test. The current protected Preview is not yet verified for that callback. Explicit production origins and commercial hosting eligibility remain future launch tasks.
