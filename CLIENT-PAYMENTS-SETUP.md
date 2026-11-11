# Client enquiries, admin and Billplz setup

Implemented for Vercel + Supabase. Not deployed or connected to live services yet. Existing public layout and WhatsApp flow are preserved until capture is enabled.

## Provision and configure

1. Create a Supabase project. Run supabase/001-client-payments.sql once in its SQL editor. All tables have RLS enabled; anon/authenticated have no table access. Only the server uses the secret key.
2. In Supabase Authentication, disable public user sign-ups. Create/invite the administrator through Supabase, complete password setup, then add that user's UUID to public.admins using the SQL editor: `insert into public.admins(user_id) values ('YOUR_AUTH_USER_UUID');`. Never use editable user metadata to grant admin access.
3. Import this project folder into Vercel. Build: npm run build; output: dist. Functions are in api/. Set the environment variables from .env.example in Vercel; do not paste secrets into chat or frontend code.
4. Set SUPABASE_URL and VITE_SUPABASE_URL to the project HTTPS URL; SUPABASE_PUBLISHABLE_KEY and VITE_SUPABASE_PUBLISHABLE_KEY to its public key. Set SUPABASE_SECRET_KEY to the server secret/service-role key. Set SITE_ORIGIN to the exact public HTTPS origin without trailing slash. Generate a random RATE_LIMIT_SALT.
5. Start with BILLPLZ_MODE=sandbox and separate sandbox Secret Key, X Signature key and Collection ID. Enable X Signature in Billplz. The supplied key must match the account receiving callbacks. Configure callback delivery to the public deployment; localhost cannot receive real provider callbacks.
6. Enable VITE_ENABLE_CLIENT_CAPTURE=true only after the database and API work. Rebuild. Set VITE_SITE_ORIGIN to the exact new HTTPS origin for canonical metadata (the same value as SITE_ORIGIN) and rebuild as well.
7. Review privacy/contact/legal wording, access permissions and a retention/deletion policy before collecting real client data. This integration stores enquiry details and invoices; it does not automatically send confirmation emails.

## Use

Visitors submit name, business, phone, email, service and message through the existing Contact page. The API validates them and allows up to five submissions per IP bucket per hour. IPs are stored only as salted hashes. Enquiry submission does not create a payment or charge anyone.

Open /admin/ to sign in. Only Supabase user IDs explicitly present in public.admins can list enquiries or create invoices. Session tokens are held in browser memory and lost on reload; sign in again after expiry. The dashboard shows the newest 100 enquiries/invoices. Create an invoice using an agreed description and MYR amount. Share the resulting private payment link with that client manually. Anyone holding the link can view that invoice's description/amount and pay it, so share it only with its intended recipient.

The customer's /payment/ page reads the private token from the URL fragment, posts it to the same-origin API, and redirects to Billplz checkout. Raw tokens are not stored in the database; their SHA-256 hashes are. Only verified, signed callbacks with matching collection, invoice, bill and exact amount can mark an invoice paid. Redirect parameters are never trusted as payment confirmation. Duplicate callbacks do not duplicate payment updates.

## Provider timeout recovery

Invoice creation claims the record atomically so concurrent clicks cannot create duplicate bills. A network timeout or malformed successful response leaves status `creating` because Billplz may have created a bill. Do not blindly reset/retry: check Billplz for the invoice reference first. If a bill exists, reconcile its bill_id/bill_url/status in Supabase using the Billplz dashboard; if definitively no bill exists, reset status to draft and clear creation_lock. Signed paid callbacks can reconcile a bill before its creation response arrives. This manual reconciliation is intentional to avoid accidental double billing.

## Verification and launch checks

Run `node --test --test-isolation=none scripts/client-payments.test.mjs scripts/enquiry.test.mjs` and `npm run build`. Local tests cover validation, amount bounds, signatures and authentication rejection without sending external payments. No live database/auth/Billplz end-to-end test has been performed without account configuration.

Before enabling real payments, test sandbox enquiry persistence, admin allow-list denial, invoice creation, duplicate clicks, success/failure, cancelled/closed browser, signed callback replay, amount mismatch, delayed callbacks and timeout recovery. Confirm customer status after payment. Verify public keys cannot read tables. Set Vercel WAF/rate rules on login/enquiry/payment endpoints, restrict admin accounts, and monitor function failures without logging contact payloads or keys. Account/provider fees and payment methods depend on your selected plans.

After sandbox verification, switch all Billplz variables to the live account together and set mode live. Never mix sandbox/live collection or signature keys. No automatic deployment or charge was performed.

