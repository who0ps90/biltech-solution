# Connection status — 14 October 2026

The protected personal test Preview is deployed on Vercel Hobby. See PREVIEW-DEPLOYMENT.md for its URL, verification evidence and deployment target correction.

Latest layout refresh: dpl_CdMvYtXUBevUM3UYGE5BwV3qa12P is READY (Preview/staging). The refreshed homepage and About page were verified in the signed-in browser. Backend/admin evidence below refers to the preceding deployment; backend code and environment configuration are unchanged.

## Completed

- Supabase Biltech-Solution (jrbrmzqqhacxckejwkyi) is ACTIVE_HEALTHY in Singapore, in who0ps90's Org. The older Tokyo project was not changed.
- Migration client_enquiries_and_invoices (20261014033917) created admins, enquiries, invoices and enquiry_limits. RLS is enabled on all four. Browser roles have no direct table access; accept_enquiry is SECURITY INVOKER and only service_role can execute it.
- Live database checks accepted five synthetic enquiries and rejected a sixth; every test record was rolled back. Five live public-key access-denial checks passed. No real clients or payments were created.
- Admin chris.keith5463@gmail.com has a confirmed email, a password set and an allow-list entry. No password was read.
- Vercel biltech-solution (prj_vccYJdAToH5tiZyZgyFNe34WoMjS) has public Supabase settings, a sensitive Supabase secret and sensitive rate-limit salt configured. Secret values were not read.
- Client capture remains false, enforced in both frontend and backend. Billplz mode remains sandbox. Missing payment credentials are checked before claiming an invoice.
- All 13 automated checks pass. Local normal and Preview builds pass. Preview HTML and robots.txt discourage indexing.
- Vercel deployment dpl_GjRBqR4Pe8id9Ma3gd47BzFhHHgC is READY, API target staging (Preview), protected by Vercel SSO. After the user signed in through the Codex browser, the deployed homepage and authenticated admin dashboard were directly verified. Record refresh succeeded with no error, validating the private backend key without reading it.
- Deployed desktop and 390px mobile layouts were checked. Mobile navigation reaches Contact without horizontal overflow. The homepage canonical matches the Preview host and noindex,nofollow is present. No console errors were captured.

## Remaining verification

1. Client capture remains disabled for personal testing. Creating enquiries and invoices against the deployed database has not been exercised.
2. Configure BILLPLZ_SECRET_KEY, BILLPLZ_COLLECTION_ID and BILLPLZ_X_SIGNATURE_KEY in Vercel, then verify sandbox checkout and signed callbacks. Deployment protection currently also protects callback routes; provider callback access needs an explicit setup before that test.
3. Set the final SITE_ORIGIN and VITE_SITE_ORIGIN before a future commercial launch. Preview uses its assigned VERCEL_URL automatically. The user authorized personal testing on Hobby; commercial hosting eligibility remains a future launch decision.
4. Disable public Supabase Auth sign-ups if they are still enabled. The website has no public signup screen.

## Access and replacement status

Connector protected page fetches and build logs were denied by scope permissions. Authenticated website verification subsequently succeeded through the signed-in Codex browser. A separate direct anonymous API navigation was blocked by the browser client; its deployed rejection response was not inspected. Checkout remains pending the Billplz configuration above.

The first deployment request unexpectedly received target production when target was omitted. It remains protected, with capture disabled and sandbox mode; the Preview target was explicitly corrected on the next deployment. See PREVIEW-DEPLOYMENT.md for the exact IDs. Existing porfolio-website remains in place pending a verified replacement.
