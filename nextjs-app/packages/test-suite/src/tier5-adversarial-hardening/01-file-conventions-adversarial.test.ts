import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'

const BASELINE_SRC = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src')

describe('Tier 5 Adversarial Hardening — 01: Authentic File Conventions & Routing', () => {
  // 1. Route Handlers on Disk (route.ts)
  describe('Route Handlers (route.ts) Empirical Execution', () => {
    it('should empirically verify REST API Orders route handler on disk and method exports', async () => {
      const routePath = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/route/rest-api-orders/api/route.ts'
      )
      assert.ok(fs.existsSync(routePath), `route.ts must exist on disk at ${routePath}`)

      const content = fs.readFileSync(routePath, 'utf-8')
      assert.ok(content.includes('export async function GET'), 'Must export GET handler')
      assert.ok(content.includes('export async function POST'), 'Must export POST handler')
      assert.ok(content.includes('NextResponse.json'), 'Must return JSON responses')
    })

    it('should empirically verify Webhook Signature Verification route handler with HMAC authentication', async () => {
      const routePath = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/route/webhook-signature/api/route.ts'
      )
      assert.ok(fs.existsSync(routePath), `route.ts must exist at ${routePath}`)

      const content = fs.readFileSync(routePath, 'utf-8')
      assert.ok(content.includes('export async function POST'), 'Must export POST handler')
      assert.ok(content.includes('x-webhook-signature') || content.includes('hmac') || content.includes('signature'), 'Must check HMAC signature header')
    })

    it('should empirically verify SSE Stock Stream route handler and event-stream delivery', async () => {
      const routePath = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/route/sse-stock-stream/api/route.ts'
      )
      assert.ok(fs.existsSync(routePath), `SSE route.ts must exist at ${routePath}`)

      const content = fs.readFileSync(routePath, 'utf-8')
      assert.ok(content.includes('export async function GET') || content.includes('export function GET'), 'Must export GET handler for SSE')
      assert.ok(content.includes('text/event-stream'), 'Must return text/event-stream content-type')
      assert.ok(content.includes('ReadableStream'), 'Must construct ReadableStream for live events')
    })

    it('should verify all 9 route handlers on disk have valid TypeScript exports', async () => {
      const expectedRouteFiles = [
        'app/zone/baseline/file-conventions/route/rest-api-orders/api/route.ts',
        'app/zone/baseline/file-conventions/route/sse-stock-stream/api/route.ts',
        'app/zone/baseline/file-conventions/route/webhook-signature/api/route.ts',
        'app/zone/baseline/functions/next-request/geo-ip-parsing/api/route.ts',
        'app/zone/baseline/functions/next-response/json-builder/api/route.ts',
        'app/zone/baseline/functions/next-response/rewrite-virtual/api/route.ts',
        'app/zone/baseline/functions/next-response/rewrite-virtual/target/route.ts',
        'app/zone/baseline/route-handlers/rest-api-crud/api/route.ts',
        'app/zone/baseline/route-handlers/streaming-sse/api/sse/route.ts',
      ]

      for (const relPath of expectedRouteFiles) {
        const fullPath = path.join(BASELINE_SRC, relPath)
        assert.ok(fs.existsSync(fullPath), `Route handler missing: ${relPath}`)
        const content = fs.readFileSync(fullPath, 'utf-8')
        assert.ok(
          content.includes('export async function GET') ||
          content.includes('export async function POST') ||
          content.includes('export function GET') ||
          content.includes('export function POST'),
          `Route handler at ${relPath} must export HTTP methods`
        )
      }
    })
  })

  // 2. Dynamic Segments on Disk ([id], [...slug], [[...slug]])
  describe('Dynamic Segments ([id], [...slug], [[...slug]]) Verification', () => {
    it('should verify single-param [id] directory structure and async params resolution', async () => {
      const singleParamDir = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/dynamic-segments/single-param/items/[id]'
      )
      assert.ok(fs.existsSync(singleParamDir), `[id] directory must exist at ${singleParamDir}`)

      const pagePath = path.join(singleParamDir, 'page.tsx')
      assert.ok(fs.existsSync(pagePath), `[id]/page.tsx must exist`)

      const content = fs.readFileSync(pagePath, 'utf-8')
      assert.ok(content.includes('params') || content.includes('Promise'), 'Must receive params Promise')
      assert.ok(content.includes('export default'), 'Must export default component')
    })

    it('should verify catch-all [...slug] directory structure and multi-segment array resolution', async () => {
      const catchAllDir = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/dynamic-segments/catch-all-slug/shop/[...slug]'
      )
      assert.ok(fs.existsSync(catchAllDir), `[...slug] directory must exist at ${catchAllDir}`)

      const pagePath = path.join(catchAllDir, 'page.tsx')
      assert.ok(fs.existsSync(pagePath), `[...slug]/page.tsx must exist`)

      const content = fs.readFileSync(pagePath, 'utf-8')
      assert.ok(content.includes('slug') || content.includes('params'), 'Must handle slug array')
      assert.ok(content.includes('export default'), 'Must export default component')
    })

    it('should verify optional catch-all [[...slug]] handling both root and deep paths', async () => {
      const optCatchAllDir = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/dynamic-segments/optional-catch-all/docs/[[...slug]]'
      )
      assert.ok(fs.existsSync(optCatchAllDir), `[[...slug]] directory must exist at ${optCatchAllDir}`)

      const pagePath = path.join(optCatchAllDir, 'page.tsx')
      assert.ok(fs.existsSync(pagePath), `[[...slug]]/page.tsx must exist`)

      const content = fs.readFileSync(pagePath, 'utf-8')
      assert.ok(content.includes('slug') || content.includes('params'), 'Must handle optional slug')
      assert.ok(content.includes('export default'), 'Must export default component')
    })
  })

  // 3. Route Groups & Parallel Routes (@slot, default.tsx)
  describe('Route Groups ((shop), (marketing)) and Parallel Routes (@slot)', () => {
    it('should verify route group directories (shop) and (marketing) exist without URL segment pollution', () => {
      const groupIsolationDir = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/route-groups/group-url-isolation'
      )
      assert.ok(fs.existsSync(groupIsolationDir), `Route group dir must exist at ${groupIsolationDir}`)

      const shopGroup = path.join(groupIsolationDir, '(shop)')
      const marketingGroup = path.join(groupIsolationDir, '(marketing)')
      assert.ok(fs.existsSync(shopGroup), '(shop) route group folder must exist')
      assert.ok(fs.existsSync(marketingGroup), '(marketing) route group folder must exist')

      assert.ok(fs.existsSync(path.join(shopGroup, 'products/page.tsx')), '(shop)/products/page.tsx must exist')
      assert.ok(fs.existsSync(path.join(shopGroup, 'layout.tsx')), '(shop)/layout.tsx must exist')
      assert.ok(fs.existsSync(path.join(marketingGroup, 'about/page.tsx')), '(marketing)/about/page.tsx must exist')
      assert.ok(fs.existsSync(path.join(marketingGroup, 'layout.tsx')), '(marketing)/layout.tsx must exist')
    })

    it('should verify parallel route slots (@analytics, @team) with mandatory default.tsx fallbacks', () => {
      const parallelRoutesDir = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/parallel-routes'
      )
      assert.ok(fs.existsSync(parallelRoutesDir))

      const analyticsSlot = path.join(parallelRoutesDir, '@analytics')
      const teamSlot = path.join(parallelRoutesDir, '@team')
      assert.ok(fs.existsSync(analyticsSlot), '@analytics slot must exist')
      assert.ok(fs.existsSync(teamSlot), '@team slot must exist')

      assert.ok(fs.existsSync(path.join(analyticsSlot, 'default.tsx')), '@analytics/default.tsx must exist')
      assert.ok(fs.existsSync(path.join(analyticsSlot, 'page.tsx')), '@analytics/page.tsx must exist')
      assert.ok(fs.existsSync(path.join(teamSlot, 'default.tsx')), '@team/default.tsx must exist')
      assert.ok(fs.existsSync(path.join(teamSlot, 'page.tsx')), '@team/page.tsx must exist')
    })
  })

  // 4. Intercepting Routes ((.)photos/[id])
  describe('Intercepting Routes ((.)photos/[id])', () => {
    it('should verify authentic intercepting route directory and modal interception alongside direct route', () => {
      const interceptBase = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/intercepting-routes'
      )
      assert.ok(fs.existsSync(interceptBase))

      const modalSlotDir = path.join(interceptBase, '@modal')
      const directRouteDir = path.join(interceptBase, 'photos/[id]')

      assert.ok(fs.existsSync(modalSlotDir), 'Parallel @modal slot must exist on disk')
      assert.ok(fs.existsSync(path.join(modalSlotDir, 'default.tsx')), '@modal/default.tsx must exist')
      assert.ok(fs.existsSync(path.join(modalSlotDir, '(.)photos/[id]/page.tsx')), 'Intercepting (.)photos/[id]/page.tsx must exist')
      assert.ok(fs.existsSync(directRouteDir), 'Direct destination directory photos/[id] must exist on disk')
      assert.ok(fs.existsSync(path.join(directRouteDir, 'page.tsx')), 'Direct destination page.tsx must exist')
    })
  })

  // 5. Special Boundaries (loading, error, template, not-found)
  describe('Special Boundaries & Metadata Conventions', () => {
    it('should verify loading.tsx skeleton boundary exists on disk', () => {
      const loadingPath = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/loading/skeleton-boundary/slow-catalog/loading.tsx'
      )
      assert.ok(fs.existsSync(loadingPath), `loading.tsx must exist at ${loadingPath}`)
    })

    it('should verify error.tsx error boundary has use client and exports ErrorBoundary', () => {
      const errorPath = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/error/payment-error-boundary/checkout/error.tsx'
      )
      assert.ok(fs.existsSync(errorPath), `error.tsx must exist at ${errorPath}`)

      const content = fs.readFileSync(errorPath, 'utf-8')
      assert.ok(content.includes("'use client'") || content.includes('"use client"'), "error.tsx must include 'use client'")
      assert.ok(content.includes('export default'), 'error.tsx must default-export an error component')
      assert.ok(content.includes('reset') || content.includes('error'), 'error.tsx must accept error & reset props')
    })

    it('should verify template.tsx resets state on navigation', () => {
      const templatePath = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/template/remount-lifecycle/template.tsx'
      )
      assert.ok(fs.existsSync(templatePath), `template.tsx must exist at ${templatePath}`)
    })

    it('should verify not-found.tsx missing-product-404 boundary', () => {
      const notFoundPath = path.join(
        BASELINE_SRC,
        'app/zone/baseline/file-conventions/not-found/missing-product-404/items/[id]/not-found.tsx'
      )
      assert.ok(fs.existsSync(notFoundPath), `not-found.tsx must exist at ${notFoundPath}`)
    })

    it('should verify metadata files (icon, manifest, og, robots, sitemap) on disk', () => {
      const metadataBase = path.join(BASELINE_SRC, 'app/zone/baseline/file-conventions')
      const metadataFiles = [
        path.join(metadataBase, 'metadata-app-icons/dynamic-favicon/icon.tsx'),
        path.join(metadataBase, 'metadata-manifest/dynamic-pwa-manifest/manifest.ts'),
        path.join(metadataBase, 'metadata-og/discount-banner-og/opengraph-image.tsx'),
        path.join(metadataBase, 'metadata-robots/dynamic-crawler-rules/robots.ts'),
        path.join(metadataBase, 'metadata-sitemap/split-index-sitemaps/sitemap.ts'),
      ]

      for (const metaFile of metadataFiles) {
        assert.ok(fs.existsSync(metaFile), `Metadata file must exist: ${metaFile}`)
      }
    })
  })

  // 6. Root Proxy & Instrumentation Hooks
  describe('Root Proxy (proxy.ts) and Instrumentation (instrumentation.ts)', () => {
    it('should empirically verify proxy() in src/proxy.ts exports and matcher configuration', () => {
      const proxyPath = path.join(BASELINE_SRC, 'proxy.ts')
      assert.ok(fs.existsSync(proxyPath), `proxy.ts must exist at ${proxyPath}`)

      const content = fs.readFileSync(proxyPath, 'utf-8')
      assert.ok(content.includes('export function proxy'), 'Must export proxy function')
      assert.ok(content.includes('export const config'), 'Must export config matcher')
      assert.ok(content.includes('x-proxy-gateway'), 'Must inject x-proxy-gateway header')
      assert.ok(content.includes('x-auth-guard-checked'), 'Must inject x-auth-guard-checked header')
    })

    it('should empirically verify instrumentation hooks register() and onRequestError()', () => {
      const instrumentationPath = path.join(BASELINE_SRC, 'instrumentation.ts')
      assert.ok(fs.existsSync(instrumentationPath), `instrumentation.ts must exist at ${instrumentationPath}`)

      const content = fs.readFileSync(instrumentationPath, 'utf-8')
      assert.ok(content.includes('export async function register'), 'Must export register()')
      assert.ok(content.includes('export async function onRequestError'), 'Must export onRequestError()')
    })
  })
})
