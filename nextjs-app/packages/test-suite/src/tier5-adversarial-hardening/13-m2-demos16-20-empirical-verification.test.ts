import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { submitOrderAction } from '../../../../apps/demo-baseline/src/app/zone/baseline/error-handling/global-error/actions.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '../../../../..')
const APPS_ROOT = path.resolve(REPO_ROOT, 'nextjs-app/apps')

describe('Tier 5 Hardening — Milestone 2 (Batch B02 Demos 16–20) Empirical Verification', () => {

  // Demo 16: segment-error
  describe('Demo 16: Next.js error.tsx Segment Error Boundary', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/error-handling/segment-error')
    it('16.1 Error boundary and context dynamic binding', () => {
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      const errorBoundary = fs.readFileSync(path.join(dir, 'payment/error.tsx'), 'utf-8')
      assert.ok(footer.includes("stage === 'recovered' || stage === 'completed'"))
      assert.ok(errorBoundary.includes('handleReset'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 17: global-error
  describe('Demo 17: 3-Tier Error Handling Architecture', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/error-handling/global-error')
    it('17.1 Form validation return and 3-tier simulator', async () => {
      const fd = new FormData()
      fd.append('email', 'invalid-email')
      fd.append('amount', '0')
      const res = await submitOrderAction({ success: false, message: '' }, fd)
      assert.strictEqual(res.success, false)
      assert.ok(res.fieldErrors?.email)

      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(footer.includes('hasInteracted'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 18: tailwind-v4
  describe('Demo 18: Tailwind v4 Theme Styling & Dynamic Inspector', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/css/tailwind-v4')
    it('18.1 Dynamic active classes and verification footer', () => {
      const client = fs.readFileSync(path.join(dir, 'components/ThemeInspectorClient.tsx'), 'utf-8')
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(client.includes('activeClasses'))
      assert.ok(footer.includes('hasInteracted'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 19: css-modules
  describe('Demo 19: CSS Modules Scope Isolation', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/css/css-modules')
    it('19.1 CSS module classes isolation and controller state', () => {
      const controller = fs.readFileSync(path.join(dir, 'components/CssModulesController.tsx'), 'utf-8')
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(controller.includes('productStyles.card'))
      assert.ok(controller.includes('bannerStyles.card'))
      assert.ok(footer.includes('cartAdded || couponClaimed'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Demo 20: image-optimization
  describe('Demo 20: next/image Automatic Optimization & Zero CLS', () => {
    const dir = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline/images/image-optimization')
    it('20.1 Real next/image component usage and parameter inspection', () => {
      const client = fs.readFileSync(path.join(dir, 'components/ImageComparisonClient.tsx'), 'utf-8')
      const footer = fs.readFileSync(path.join(dir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(client.includes("import Image from 'next/image'"))
      assert.ok(footer.includes('hasInteracted'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // Global Line Count & Integrity Check across Demos 11–20
  describe('Global Line Count & Integrity Audit across Demos 11–20', () => {
    const demoDirs = [
      'demo-baseline/src/app/zone/baseline/fetching-data/use-promise-streaming',
      'demo-baseline/src/app/zone/baseline/mutating-data/server-action-revalidate',
      'demo-baseline/src/app/zone/baseline/mutating-data/optimistic-cart',
      'demo-cache-components/src/app/zone/cache/revalidating/time-based-isr',
      'demo-cache-components/src/app/zone/cache/revalidating/tag-vs-path',
      'demo-baseline/src/app/zone/baseline/error-handling/segment-error',
      'demo-baseline/src/app/zone/baseline/error-handling/global-error',
      'demo-baseline/src/app/zone/baseline/css/tailwind-v4',
      'demo-baseline/src/app/zone/baseline/css/css-modules',
      'demo-baseline/src/app/zone/baseline/images/image-optimization',
    ]

    it('All source files across Demos 11-20 must be <= 250 lines', () => {
      for (const d of demoDirs) {
        const fullDir = path.join(APPS_ROOT, d)
        const walk = (cur: string) => {
          const entries = fs.readdirSync(cur, { withFileTypes: true })
          for (const ent of entries) {
            const p = path.join(cur, ent.name)
            if (ent.isDirectory()) walk(p)
            else if (/\.(tsx|ts|css)$/.test(ent.name)) {
              const lines = fs.readFileSync(p, 'utf-8').split('\n').length
              assert.ok(lines <= 250, `File ${p} has ${lines} lines, exceeding 250!`)
            }
          }
        }
        walk(fullDir)
      }
    })
  })
})
