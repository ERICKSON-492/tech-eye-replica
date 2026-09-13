# Production Deployment Guide

## Eyetech Stainless Steel Expert website

This repository contains a TanStack Start application built with Vite and Nitro. The current Vite configuration uses Nitro’s Cloudflare module target, and a successful production build generates a `.output` directory plus a Wrangler configuration. The repository is also connected to Lovable, where pushes to `main` can synchronize the project.

## Recommended deployment choices

| Option | Best for | Recommendation |
|---|---|---|
| Lovable | Fastest deployment with the existing project workflow | Use this if the site will remain managed in Lovable. |
| Cloudflare Workers | Direct production hosting for the current Nitro output | Recommended for a code-first deployment because the build already targets Cloudflare. |
| Other platforms | Teams with an existing hosting standard | Confirm the required Nitro preset before deploying; do not upload the `.output` directory as a static-only site. |

## Pre-deployment checklist

Before publishing, replace the remaining stock photography with verified Eyetech project images where possible. Confirm that the phone number, service descriptions, business location, project claims, and WhatsApp destination are correct. All external image URLs should use HTTPS; the application should not retain any `http://` image references.

The visible development/editor badge should not appear in the production experience. Confirm that the production domain, page titles, canonical URLs, favicon, Open Graph metadata, robots file, and sitemap are correct. Configure analytics for phone clicks, WhatsApp clicks, quote submissions, service-page views, and portfolio interactions.

## Local production validation

Use Node.js and npm, or another compatible package manager, from the repository root:

```bash
npm install
npm run lint
npm run build
```

The production build should complete without TypeScript or bundling errors. The generated output should contain the server bundle and Cloudflare deployment configuration under `.output`.

To inspect the production build locally, use:

```bash
npm run preview
```

Open the URL shown by the preview command and test the following routes:

```text
/
/services
/services/stainless-steel-fabrication
/services/aluminium-works
/services/glass-curtain-walls
/services/frameless-shower-cubicles
/services/glass-railings-balustrades
/services/commercial-kitchen-fabrication
/services/architectural-metalwork
/about-us
/contact
```

Verify that service cards open the correct detail pages, the dedicated service selector is preselected, all required form fields validate, the WhatsApp URL contains the expected information, and the form success message appears after submission.

## Option A: Deploy through Lovable

This is the simplest path for the existing project because the README identifies the live Lovable project and explains that GitHub pushes synchronize with Lovable.

1. Open the project in the Lovable editor.
2. Confirm that the repository is synchronized at the commit containing the service-page implementation.
3. Use Lovable’s publish or deployment workflow to create a new production version.
4. Configure the production domain in the project settings.
5. Verify the public site on desktop and mobile.
6. Test one real WhatsApp handoff only after the synthetic test has passed and the phone number has been confirmed.

If Lovable is the intended long-term host, use the Lovable project as the deployment source of truth and avoid making competing manual deployments that could cause version drift.

## Option B: Deploy to Cloudflare Workers

The current Nitro build is configured for Cloudflare. Install and authenticate Wrangler using the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/):

```bash
npx wrangler login
```

From the repository root, build the application:

```bash
npm install
npm run build
```

Deploy the generated Nitro artifact:

```bash
npx nitro deploy --prebuilt
```

The build output already generates a Wrangler configuration under `.output/server`. If the command asks for a Cloudflare account, select the account and project name that should own the production Worker. Do not commit authentication tokens to the repository.

After deployment:

```bash
npx wrangler deployments list
```

Open the deployed Worker URL and test the complete route list. Then configure the production custom domain in Cloudflare DNS and SSL/TLS settings. Use HTTPS only and confirm that every route works after a direct refresh, not only after client-side navigation.

## GitHub-based continuous deployment

A basic deployment workflow can run on every push to `main` after the repository has been connected to Cloudflare:

```yaml
name: Deploy website

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npx nitro deploy --prebuilt
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Before enabling this workflow, confirm that the repository uses a committed npm lockfile. If the team uses another package manager, replace `npm ci` with the corresponding immutable install command and commit that lockfile. The Cloudflare token should be limited to the required deployment permissions and stored only as a GitHub Actions secret.

## Environment variables

The current quote flow opens a WhatsApp URL directly in the visitor’s browser and does not require a server-side API key. If analytics, email notifications, CRM integration, or server-side form storage is added later, store those values as deployment secrets rather than placing them in source code.

| Variable | Required now | Purpose |
|---|---:|---|
| `CLOUDFLARE_API_TOKEN` | Only for automated Cloudflare deployment | Allows the deployment workflow to publish the Worker. |
| `CLOUDFLARE_ACCOUNT_ID` | Only for automated Cloudflare deployment | Identifies the Cloudflare account. |
| Analytics ID | Optional | Enables traffic and conversion measurement. |
| CRM or email credentials | Not currently required | Needed only if enquiries are stored or emailed server-side. |

## Domain and SEO configuration

After the custom domain is connected, update canonical URLs and Open Graph URLs if they still point to the temporary Lovable domain. Confirm the following files and behaviors:

```text
https://your-domain.example/robots.txt
https://your-domain.example/sitemap.xml
https://your-domain.example/services
https://your-domain.example/contact
```

The current app has page-specific titles, descriptions, canonical links, service routes, and a `public/robots.txt` file. Add a generated sitemap if one is not already available, and ensure the production domain is used consistently in canonical and social metadata.

## Post-deployment acceptance test

| Test | Expected result |
|---|---|
| Homepage loads directly | Returns HTTP 200 and renders the hero. |
| Service landing page loads directly | Displays all seven service cards. |
| Dedicated service route refresh | Renders correctly after a hard refresh. |
| Invalid service slug | Shows the application’s not-found state. |
| Mobile navigation | Opens, closes, and links to each primary section. |
| Quote form validation | Required name, phone, and message fields block empty submission. |
| Quote form payload | Contains name, phone, service, location, project type, timeline, and details. |
| WhatsApp handoff | Opens the correct `wa.me` destination with URL-encoded text. |
| Form reset | Clears fields and shows the success message after submission. |
| HTTPS assets | No mixed-content warnings or blocked images. |
| Analytics | Phone, WhatsApp, and quote interactions are recorded if analytics is enabled. |

## Rollback plan

Keep the previous working deployment version available in the hosting provider. If a production issue is discovered, roll back to the previous Worker or Lovable deployment version, then fix the issue on a branch and repeat the local build and acceptance test before redeploying.

## Current status

The code has been built successfully locally, the Services landing page and dedicated service routes render, and the quote form has been tested with synthetic data. The implementation is committed to the repository as `d113e23` and pushed to the `main` branch. A production deployment still requires a hosting target, domain configuration, and the appropriate account authorization.

## References

[1]: https://developers.cloudflare.com/workers/ "Cloudflare Workers documentation"
[2]: https://developers.cloudflare.com/workers/wrangler/ "Cloudflare Wrangler documentation"
[3]: https://lovable.dev/ "Lovable project platform"
