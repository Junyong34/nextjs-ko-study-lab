# Original User Request

## Initial Request — 2026-09-03T02:51:03Z

Configure Open Graph (OG) images, Twitter cards, metadataBase, and page-specific metadata for all demo routes in `apps/demo-baseline` and `apps/demo-cache-components` within `nextjs-app`.

Working directory: /Users/devpark/workspace/devpark/nextjs-ko-study-lab/nextjs-app
Integrity mode: development

## Requirements

### R1. Base Layout Metadata & Asset Provision
- In `apps/demo-baseline/src/app/layout.tsx` and `apps/demo-cache-components/src/app/layout.tsx`, configure comprehensive root metadata:
  - `metadataBase` pointing to the public URL (`process.env.NEXT_PUBLIC_SITE_URL` fallback to `https://learn-nextjs-lab.space` or appropriate zone host)
  - `openGraph` with title template, description, locale (`ko_KR`), type (`website`), and default OG image
  - `twitter` with `card: 'summary_large_image'` and default image
  - Favicon and icons configuration (`icon.svg`, `apple-icon.tsx`, or static public assets)
- Copy `og-image.png` and icon assets from `apps/shell` to both demo apps (`apps/demo-baseline` and `apps/demo-cache-components`).

### R2. Page-Specific Metadata for Demo Routes
- For all demo pages in `apps/demo-baseline/src/app/zone/baseline/**/page.tsx` and `apps/demo-cache-components/src/app/zone/cache/**/page.tsx`:
  - Provide individual, relevant `title`, `description`, `openGraph`, and `twitter` metadata matching each demo's topic/title.
  - Utilize existing demo manifest data (`@study/demos` or `demos.yaml`) or explicit page metadata exports / `generateMetadata` so that each page generates appropriate `<meta>` tags and Open Graph information.

### R3. Root Route (`/`) Handling
- Add `src/app/page.tsx` to both demo apps to provide clean entry or navigation to respective zone demos rather than 404/blank pages.

## Acceptance Criteria

### Metadata & OG Verification
- [ ] Build succeeds for all apps (`pnpm --filter @study/demo-baseline build` and `pnpm --filter @study/demo-cache build`).
- [ ] Rendered HTML / server response for both base layouts and individual demo pages includes:
  - `<meta property="og:title" ...>`
  - `<meta property="og:description" ...>`
  - `<meta property="og:image" ...>`
  - `<meta name="twitter:card" content="summary_large_image">`
  - `<link rel="icon" ...>`
- [ ] TypeScript type checks pass with 0 errors across `@study/demo-baseline`, `@study/demo-cache`, and `@study/shell`.
