import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { applyCouponAction } from '../../../../apps/demo-baseline/src/app/zone/baseline/guides/server-actions-advanced/actions.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '../../../../..')
const APPS_ROOT = path.resolve(REPO_ROOT, 'nextjs-app/apps')

describe('Tier 5 Hardening — Milestone 3 (Batch B03 Demos 21–30) Empirical Verification', () => {

  // Demo 21: font-optimization
  describe('Demo 21: next/font Zero CLS & Self-Hosting', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/fonts/font-optimization')
    it('21.1 Font preview state and dynamic verification bindings', () => {
      const client = fs.readFileSync(path.join(dir, 'components/FontPreviewClient.tsx'), 'utf-8')
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(client.includes('hasInteracted'))
      assert.ok(client.includes('selectedWeight'))
      assert.ok(footer.includes('hasInteracted'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 22: static-and-dynamic-metadata
  describe('Demo 22: generateMetadata & Social Preview', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/metadata-and-og-images/static-and-dynamic-metadata')
    it('22.1 Presets, SNS switch and dynamic metadata verification', () => {
      const client = fs.readFileSync(path.join(dir, 'components/MetadataPreviewClient.tsx'), 'utf-8')
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(client.includes('PRESETS'))
      assert.ok(client.includes('previewPlatform'))
      assert.ok(footer.includes('hasInteracted'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 23: opengraph-image
  describe('Demo 23: opengraph-image.tsx ImageResponse Canvas', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/metadata-and-og-images/opengraph-image')
    it('23.1 ImageResponse convention, live canvas and verification footer', () => {
      const ogFile = fs.readFileSync(path.join(dir, 'opengraph-image.tsx'), 'utf-8')
      const client = fs.readFileSync(path.join(dir, 'components/OgGeneratorClient.tsx'), 'utf-8')
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(ogFile.includes('ImageResponse'))
      assert.ok(ogFile.includes('1200'))
      assert.ok(ogFile.includes('630'))
      assert.ok(client.includes('hasInteracted'))
      assert.ok(footer.includes('hasInteracted'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 24: rest-api-crud
  describe('Demo 24: REST API CRUD Route Handlers & Reset', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/route-handlers/rest-api-crud')
    it('24.1 NextResponse.json, dynamic export, reset and dynamic footer', () => {
      const route = fs.readFileSync(path.join(dir, 'api/route.ts'), 'utf-8')
      const client = fs.readFileSync(path.join(dir, 'components/RestApiClient.tsx'), 'utf-8')
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(route.includes("NextResponse.json"))
      assert.ok(route.includes("export const dynamic = 'force-dynamic'"))
      assert.ok(client.includes('reset=true'))
      assert.ok(footer.includes('lastMethod'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 25: streaming-sse
  describe('Demo 25: ReadableStream Server-Sent Events', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/route-handlers/streaming-sse')
    it('25.1 SSE Route Handler, abort listener, live client and 4-state footer', () => {
      const route = fs.readFileSync(path.join(dir, 'api/sse/route.ts'), 'utf-8')
      const client = fs.readFileSync(path.join(dir, 'components/SseStreamClient.tsx'), 'utf-8')
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(route.includes('addEventListener') && route.includes('abort'))
      assert.ok(route.includes('ReadableStream'))
      assert.ok(client.includes('EventSource'))
      assert.ok(footer.includes('isCompleted'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 26: rewrite-and-headers
  describe('Demo 26: Next.js 16 proxy.ts Request Interception & Probe', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/proxy/rewrite-and-headers')
    const proxyFile = path.join(APPS_ROOT, 'demo-baseline/src/proxy.ts')
    it('26.1 Proxy matcher, probe route, real network trigger and footer', () => {
      const proxyCode = fs.readFileSync(proxyFile, 'utf-8')
      const probeCode = fs.readFileSync(path.join(dir, 'api/probe/route.ts'), 'utf-8')
      const client = fs.readFileSync(path.join(dir, 'components/ProxySimulatorClient.tsx'), 'utf-8')
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(proxyCode.includes('/zone/baseline/proxy/:path*'))
      assert.ok(proxyCode.includes('x-proxy-gateway'))
      assert.ok(probeCode.includes('x-proxy-gateway'))
      assert.ok(client.includes('/api/probe'))
      assert.ok(footer.includes('probeResult'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 27: streaming-nested
  describe('Demo 27: Nested Suspense Chunk Streaming & Star Rating Bug Fix', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/guides/streaming-nested')
    it('27.1 Star rating non-empty string, nested hierarchy, mount notifiers and footer', () => {
      const reviewCode = fs.readFileSync(path.join(dir, 'components/LiveReviewStream.tsx'), 'utf-8')
      const prodCode = fs.readFileSync(path.join(dir, 'components/RecommendedProducts.tsx'), 'utf-8')
      const wrapperCode = fs.readFileSync(path.join(dir, 'components/StreamingNestedClientWrapper.tsx'), 'utf-8')
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(reviewCode.includes("'★'.repeat(r.rating)"))
      assert.ok(prodCode.includes('children'))
      assert.ok(wrapperCode.includes('stream-chunk-mounted'))
      assert.ok(footer.includes('recommendedLoaded && reviewsLoaded'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 28: server-actions-advanced
  describe('Demo 28: Server Action Advanced useActionState & Coupon Validation', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/guides/server-actions-advanced')
    it('28.1 Real Server Action discount calculation and footer validation', async () => {
      const fd = new FormData()
      fd.append('couponCode', 'NEXTJS16')
      const res = await applyCouponAction({ success: false, message: '' }, fd)
      assert.strictEqual(res.success, true)
      assert.strictEqual(res.discountAmount, 15000)
      assert.strictEqual(res.appliedCode, 'NEXTJS16')

      const fdFail = new FormData()
      fdFail.append('couponCode', 'INVALID_CODE')
      const resFail = await applyCouponAction({ success: false, message: '' }, fdFail)
      assert.strictEqual(resFail.success, false)

      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(footer.includes('finalPrice'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 29: swr-polling
  describe('Demo 29: SWR Real HTTP Polling & Delivery State Machine', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/guides/swr-polling')
    it('29.1 Delivery Route Handler, polling client, mutate button and dynamic footer', () => {
      const route = fs.readFileSync(path.join(dir, 'api/route.ts'), 'utf-8')
      const client = fs.readFileSync(path.join(dir, 'components/SwrDeliveryClient.tsx'), 'utf-8')
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(route.includes("export const dynamic = 'force-dynamic'"))
      assert.ok(client.includes('fetchDelivery'))
      assert.ok(client.includes('handleManualMutate'))
      assert.ok(footer.includes('pollCount >= 2'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 30: lazy-loading-chart
  describe('Demo 30: next/dynamic Lazy Loading & Bundle Optimization', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/guides/lazy-loading-chart')
    it('30.1 next/dynamic ssr:false, on-demand loading, claim cleanup and dynamic footer', () => {
      const container = fs.readFileSync(path.join(dir, 'components/LazyChartContainer.tsx'), 'utf-8')
      const chart = fs.readFileSync(path.join(dir, 'components/HeavyChartClient.tsx'), 'utf-8')
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(container.includes("ssr: false"))
      assert.ok(!chart.includes('0 KB 초기 번들'))
      assert.ok(footer.includes('hasInteracted && showChart'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Global Line Count & Integrity Check across Demos 21–30
  describe('Global Line Count & Integrity Audit across Demos 21–30', () => {
    const demoDirs = [
      'demo-baseline/src/app/zone/baseline/fonts/font-optimization',
      'demo-baseline/src/app/zone/baseline/metadata-and-og-images/static-and-dynamic-metadata',
      'demo-baseline/src/app/zone/baseline/metadata-and-og-images/opengraph-image',
      'demo-baseline/src/app/zone/baseline/route-handlers/rest-api-crud',
      'demo-baseline/src/app/zone/baseline/route-handlers/streaming-sse',
      'demo-baseline/src/app/zone/baseline/proxy/rewrite-and-headers',
      'demo-baseline/src/app/zone/baseline/guides/streaming-nested',
      'demo-baseline/src/app/zone/baseline/guides/server-actions-advanced',
      'demo-baseline/src/app/zone/baseline/guides/swr-polling',
      'demo-baseline/src/app/zone/baseline/guides/lazy-loading-chart',
    ]

    it('All source files across Demos 21-30 must be <= 250 lines', () => {
      for (const d of demoDirs) {
        const fullDir = path.join(APPS_ROOT, d)
        const walk = (cur: string) => {
          const entries = fs.readdirSync(cur, { withFileTypes: true })
          for (const ent of entries) {
            const p = path.join(cur, ent.name)
            if (ent.isDirectory()) {
              walk(p)
            } else if (ent.name.endsWith('.ts') || ent.name.endsWith('.tsx')) {
              const lines = fs.readFileSync(p, 'utf-8').split('\n').length
              assert.ok(
                lines <= 250,
                `File ${p} has ${lines} lines, exceeding strict 250-line limit!`,
              )
            }
          }
        }
        walk(fullDir)
      }
    })

    it('Zero static isMatched={true} or static literal cheats across Demos 21–30', () => {
      for (const d of demoDirs) {
        const fullDir = path.join(APPS_ROOT, d)
        const walk = (cur: string) => {
          const entries = fs.readdirSync(cur, { withFileTypes: true })
          for (const ent of entries) {
            const p = path.join(cur, ent.name)
            if (ent.isDirectory()) {
              walk(p)
            } else if (ent.name.endsWith('.ts') || ent.name.endsWith('.tsx')) {
              const content = fs.readFileSync(p, 'utf-8')
              assert.ok(!content.includes('isMatched={true}'), `Found static isMatched={true} in ${p}`)
              assert.ok(!content.includes('isMatched: true'), `Found static isMatched: true in ${p}`)
            }
          }
        }
        walk(fullDir)
      }
    })

    it('Zero unmeasured claims in Demos 21–30', () => {
      for (const d of demoDirs) {
        const fullDir = path.join(APPS_ROOT, d)
        const walk = (cur: string) => {
          const entries = fs.readdirSync(cur, { withFileTypes: true })
          for (const ent of entries) {
            const p = path.join(cur, ent.name)
            if (ent.isDirectory()) {
              walk(p)
            } else if (ent.name.endsWith('.ts') || ent.name.endsWith('.tsx')) {
              const content = fs.readFileSync(p, 'utf-8')
              assert.ok(!content.includes('0ms 즉시'), `Found 0ms claim in ${p}`)
              assert.ok(!content.includes('0 KB 초기 번들'), `Found 0 KB claim in ${p}`)
            }
          }
        }
        walk(fullDir)
      }
    })
  })
})
