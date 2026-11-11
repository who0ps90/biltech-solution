# Biltech Solution — Complete Website Project

Stage 9 SEO, accessibility and performance optimisation completed. See STAGE-9-OPTIMISATION.md for changes, verification and launch requirements. Earlier reports remain in STAGE-8-QA.md and STAGE-7-AUDIT.md.
React + Tailwind CSS + Vite, with nine prerendered pages.

## Structure
- src/components/site.jsx: page components, shared UI and route metadata
- src/styles/style.css: design and responsive styles
- src/data/content.json: services, packages and FAQs
- src/config/config.js: WhatsApp, form endpoint and site origin
- src/main.jsx: browser entry
- src/entry-server.jsx: page renderer
- public/: logo and favicon
- scripts/prerender.mjs: HTML, metadata and sitemap generation
- index.html: source HTML template
- dist/: compiled website for static hosting
- package.json and package-lock.json: dependencies and commands
- vite.config.js and postcss.config.js: build settings

## Run locally
Use Node.js 22.12 or newer compatible Node.js and npm. In this folder run:

    npm ci
    npm run dev

Open the address printed by Vite. Do not double-click the source index.html.

## Build

    npm run build

This regenerates dist/. Dependencies are excluded from the ZIP; npm ci installs them.

## Host elsewhere
Upload the CONTENTS of dist/ to your domain web root. For source-based hosting, the build command is npm run build and output directory is dist.
Use a host with directory index.html support for routes such as /services/website-design/.
The site assumes hosting at the domain root.

Before moving domains, change origin in src/config/config.js to the new HTTPS domain and rebuild. This updates canonical URLs, social metadata, structured-data URLs, sitemap and robots.txt. The included dist still references the original Biltech domain.

## Form setup
With formEndpoint: null, Send Enquiry opens a WhatsApp draft for the visitor to review and send. It does not deliver email automatically. Email links open the visitor's email app.
For direct form delivery, supply an HTTPS endpoint accepting the form JSON and allowing requests from your domain. Never place API secrets in frontend code. Email delivery is not included.

## Outstanding work
Commercial terms, package inclusions, hosting/support and ownership policies require business decisions. Visuals are illustrative. Physical-device checks, production hosting/delivery configuration and Stage 10 remain.

## Form regression tests

    node --test scripts/enquiry.test.mjs

Tests cover phone validation, WhatsApp message formatting, JSON delivery and simulated delivery failures. They send no external requests.

## Export validation
Production build and prerendering checked for nine routes. Includes source, public assets and compiled output. Excludes Git history, credentials, node_modules and temporary build files.


Client enquiries/admin/payment integration: see CLIENT-PAYMENTS-SETUP.md. Enable only after account configuration and sandbox verification.
