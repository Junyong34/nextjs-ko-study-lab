import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  NEXTJS_APP_ROOT,
  DOCS_ROOT,
  DEMOS_MANIFEST_PATH,
  loadDemosManifest,
  resolveDocFile,
} from '../utils/test-helpers.ts'

describe('Tier 5 Adversarial Hardening — 04: Monorepo Deep Invariant Oracle', () => {
  it('Manifest & Docs SSOT: should assert 100% (241/241) demos map to valid docs and on-disk pages', () => {
    assert.ok(fs.existsSync(DEMOS_MANIFEST_PATH), `Manifest must exist at ${DEMOS_MANIFEST_PATH}`)
    const demos = loadDemosManifest()

    assert.equal(demos.length, 241, 'Must have exactly 241 demos in manifest')

    for (const demo of demos) {
      assert.ok(demo.url, `Demo must have url: ${JSON.stringify(demo)}`)
      assert.ok(demo.zone === 'baseline' || demo.zone === 'cache', `Invalid zone: ${demo.zone}`)
      assert.ok(demo.title, `Demo must have title: ${demo.url}`)
      assert.ok(demo.doc, `Demo must have doc: ${demo.url}`)

      // Verify doc file resolves
      const resolvedDoc = resolveDocFile(demo.doc)
      assert.ok(
        resolvedDoc !== null,
        `Doc file missing for demo ${demo.url}: expected doc '${demo.doc}' in ${DOCS_ROOT}`
      )

      // Verify page.tsx exists
      const pagePath =
        demo.zone === 'baseline'
          ? path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline', demo.url, 'page.tsx')
          : path.join(NEXTJS_APP_ROOT, 'apps/demo-cache-components/src/app/zone/cache', demo.url, 'page.tsx')

      assert.ok(
        fs.existsSync(pagePath),
        `Demo page.tsx missing for ${demo.url}: expected at ${pagePath}`
      )
    }
  })

  it('Dead Code Activation: should verify all previously orphaned demo components are mounted in page.tsx', () => {
    const baselineApp = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline')

    const deadCodeTargets = [
      {
        relPath: 'directives/use-client/window-storage-access/page.tsx',
        expectedExport: 'StorageClientDemo',
      },
      {
        relPath: 'directives/use-server/file-level-action/page.tsx',
        expectedExport: 'DirectiveUseServerDemo',
      },
      {
        relPath: 'directives/use-server/inline-action-closure/page.tsx',
        expectedExport: 'InlineActionClosureDemo',
      },
    ]

    for (const target of deadCodeTargets) {
      const fullPath = path.join(baselineApp, target.relPath)
      assert.ok(fs.existsSync(fullPath), `Page missing: ${target.relPath}`)
      const content = fs.readFileSync(fullPath, 'utf-8')
      assert.ok(
        content.includes(target.expectedExport),
        `Component ${target.expectedExport} must be mounted in ${target.relPath}`
      )
    }
  })

  it('DeepDive Text Polish: should assert no duplicate GeoIP or S3 CDN text in unrelated topics', () => {
    const baselineApp = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline')

    const streamingSseFooter = path.join(
      baselineApp,
      'route-handlers/streaming-sse/components/VerificationFooter.tsx'
    )
    if (fs.existsSync(streamingSseFooter)) {
      const content = fs.readFileSync(streamingSseFooter, 'utf-8')
      assert.ok(
        !content.includes('클라이언트 IP 주소(203.0.113.195)') && !content.includes('CloudFront / S3 CDN'),
        'streaming-sse VerificationFooter must not contain copy-pasted GeoIP or S3 CDN text'
      )
    }

    const routeSegmentFooter = path.join(
      baselineApp,
      'file-conventions/route-segment-config/dynamic-force-dynamic/components/VerificationFooter.tsx'
    )
    if (fs.existsSync(routeSegmentFooter)) {
      const content = fs.readFileSync(routeSegmentFooter, 'utf-8')
      assert.ok(
        !content.includes('클라이언트 IP 주소(203.0.113.195)'),
        'route-segment-config VerificationFooter must not contain copy-pasted GeoIP text'
      )
    }
  })
})
