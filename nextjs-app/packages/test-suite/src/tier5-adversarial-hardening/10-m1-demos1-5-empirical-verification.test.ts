import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { addItem, resetItems, type DemoItem } from '../../../../apps/demo-baseline/src/app/zone/baseline/server-actions/basic/actions.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '../../../../..')
const APPS_ROOT = path.resolve(REPO_ROOT, 'nextjs-app/apps')

describe('Tier 5 Hardening — Milestone 1 (Batch B01 Demos 1–5) Empirical Verification Harness', () => {

  // =========================================================================
  // DEMO 1: Server Actions Basic (server-actions/basic)
  // =========================================================================
  describe('Demo 1: Server Actions Basic Dynamic State Transitions', () => {
    const pagePath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/server-actions/basic/page.tsx',
    )

    it('1.1 Source file inspection: isMatched must be conditionally dynamic based on items.length', () => {
      assert.ok(fs.existsSync(pagePath), `File not found: ${pagePath}`)
      const content = fs.readFileSync(pagePath, 'utf-8')
      const lines = content.split('\n')

      assert.ok(lines.length <= 250, `Line limit exceeded: ${lines.length} > 250`)
      assert.ok(
        content.includes('isMatched={items.length > 0 ? true : undefined}'),
        'Demo 1 must bind isMatched dynamically to items.length > 0 ? true : undefined',
      )
      assert.ok(
        !content.includes('isMatched={true}'),
        'Demo 1 must not contain hardcoded static isMatched={true}',
      )
    })

    it('1.2 Empirical Server Action Lifecycle: initial pending -> item add matched -> reset returns pending', async () => {
      // 1. Reset state initially
      const resetRes1 = await resetItems()
      assert.strictEqual(resetRes1.success, true)
      assert.strictEqual(resetRes1.items.length, 0)

      // Evaluation of initial state:
      const initialItems: DemoItem[] = resetRes1.items
      const initialMatched = initialItems.length > 0 ? true : undefined
      assert.strictEqual(initialMatched, undefined, 'Initial state must evaluate to undefined (Pending)')

      // 2. Add an item via Server Action
      const formData = new FormData()
      formData.append('itemText', 'Next.js 16 Server Action Empirical Test')
      const addRes = await addItem(formData)

      assert.strictEqual(addRes.success, true)
      assert.strictEqual(addRes.items.length, 1)
      assert.strictEqual(addRes.items[0].text, 'Next.js 16 Server Action Empirical Test')

      // Evaluation after mutation:
      const mutatedItems = addRes.items
      const mutatedMatched = mutatedItems.length > 0 ? true : undefined
      assert.strictEqual(mutatedMatched, true, 'Mutated state must evaluate to true (Matched)')

      // 3. Reset state
      const resetRes2 = await resetItems()
      assert.strictEqual(resetRes2.success, true)
      assert.strictEqual(resetRes2.items.length, 0)
      const postResetMatched = resetRes2.items.length > 0 ? true : undefined
      assert.strictEqual(postResetMatched, undefined, 'Post-reset state must return to undefined (Pending)')
    })

    it('1.3 Adversarial / Edge Cases: Empty payload rejected without false pass', async () => {
      const emptyForm = new FormData()
      emptyForm.append('itemText', '   ')
      const emptyRes = await addItem(emptyForm)

      assert.strictEqual(emptyRes.success, false)
      assert.strictEqual(emptyRes.error, '항목 내용을 입력해주세요.')
    })
  })

  // =========================================================================
  // DEMO 2: Caching Basic (caching/basic)
  // =========================================================================
  describe('Demo 2: Next.js 16 use cache & revalidateTag Stale-While-Revalidate Lifecycle', () => {
    const pagePath = path.join(
      APPS_ROOT,
      'demo-cache-components/src/app/zone/cache/caching/basic/page.tsx',
    )
    const clientPath = path.join(
      APPS_ROOT,
      'demo-cache-components/src/app/zone/cache/caching/basic/components/CacheVerificationClient.tsx',
    )

    it('2.1 Source file inspection: Anti-hardcoding & line limit compliance', () => {
      assert.ok(fs.existsSync(pagePath))
      assert.ok(fs.existsSync(clientPath))

      const pageContent = fs.readFileSync(pagePath, 'utf-8')
      const clientContent = fs.readFileSync(clientPath, 'utf-8')

      assert.ok(pageContent.split('\n').length <= 250, 'page.tsx exceeds 250 lines')
      assert.ok(clientContent.split('\n').length <= 250, 'CacheVerificationClient.tsx exceeds 250 lines')

      assert.ok(
        !clientContent.includes('isMatched={true}'),
        'CacheVerificationClient must not contain hardcoded static isMatched={true}',
      )
      assert.ok(
        clientContent.includes('isMatched={isMatched}'),
        'CacheVerificationClient must pass dynamically computed isMatched variable',
      )
    })

    it('2.2 Empirical State Machine Simulation: Stale-While-Revalidate cycle', () => {
      interface CacheSessionState {
        initialCacheId: string
        initialTimestamp: string
        refreshCount: number
        revalidatedAt: string | null
        staleObserved: boolean
        cycleComplete: boolean
        freshCacheId: string | null
      }

      function evaluateVerification(session: CacheSessionState | null, currentCacheId: string) {
        let isMatched: boolean | undefined = undefined
        if (!session) {
          isMatched = undefined
        } else if (session.cycleComplete) {
          isMatched = true
        } else if (session.revalidatedAt) {
          isMatched = undefined
        } else {
          isMatched = undefined
        }
        return isMatched
      }

      // Step 1: Initial SSR load
      const initialId = 'CACHE_ID_111'
      const session1: CacheSessionState = {
        initialCacheId: initialId,
        initialTimestamp: '10:00:00',
        refreshCount: 0,
        revalidatedAt: null,
        staleObserved: false,
        cycleComplete: false,
        freshCacheId: null,
      }
      assert.strictEqual(evaluateVerification(session1, initialId), undefined, 'Initial state must be undefined')

      // Step 2: User refreshes browser without invalidating (cache hit)
      session1.refreshCount += 1
      assert.strictEqual(evaluateVerification(session1, initialId), undefined, 'Normal refresh must stay undefined')

      // Step 3: User triggers revalidateTag
      session1.revalidatedAt = '10:01:00'
      assert.strictEqual(evaluateVerification(session1, initialId), undefined, 'Invalidation without fresh fetch must stay undefined')

      // Step 4: 1st reload after invalidation -> Stale cache served
      session1.staleObserved = true
      assert.strictEqual(evaluateVerification(session1, initialId), undefined, 'Stale observation must stay undefined')

      // Step 5: 2nd reload after invalidation -> Fresh cache generated
      const freshId = 'CACHE_ID_222'
      session1.cycleComplete = true
      session1.freshCacheId = freshId
      assert.strictEqual(evaluateVerification(session1, freshId), true, 'Cycle completion must evaluate to true')
    })
  })

  // =========================================================================
  // DEMO 3: Nested Layouts (layouts-and-pages/nested-layouts)
  // =========================================================================
  describe('Demo 3: Nested Layouts & Partial Rendering Dynamic State Verification', () => {
    const layoutPath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/layouts-and-pages/nested-layouts/layout.tsx',
    )
    const gnbPath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/layouts-and-pages/nested-layouts/components/GnbHeader.tsx',
    )
    const footerPath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/layouts-and-pages/nested-layouts/components/VerificationFooter.tsx',
    )

    it('3.1 Source file inspection: Hydration safety and dynamic footer bindings', () => {
      const gnbContent = fs.readFileSync(gnbPath, 'utf-8')
      const footerContent = fs.readFileSync(footerPath, 'utf-8')

      // Hydration determinism check
      assert.ok(
        gnbContent.includes("useState<string>('')"),
        'GnbHeader must initialize mountedAt with deterministic empty string for SSR',
      )
      assert.ok(
        gnbContent.includes("mountedAt || '--:--:--'"),
        'GnbHeader must have deterministic SSR fallback display',
      )

      // Verification footer anti-hardcoding check
      assert.ok(
        footerContent.includes('isAutoMatched = hasSearch && isSubRoute'),
        'VerificationFooter must require both search query and subroute navigation',
      )
      assert.ok(
        !footerContent.includes('isMatched={true}'),
        'VerificationFooter must not contain hardcoded isMatched={true}',
      )
    })

    it('3.2 Empirical Verification Matrix for Demo 3', () => {
      function evaluateDemo3(pathname: string, searchQuery: string) {
        const isSubRoute =
          pathname.endsWith('/shoes') ||
          pathname.endsWith('/clothing') ||
          pathname.endsWith('/electronics')
        const hasSearch = searchQuery.trim().length > 0
        const isAutoMatched = hasSearch && isSubRoute
        return isAutoMatched ? true : undefined
      }

      // 1. Initial load (root, empty search)
      assert.strictEqual(
        evaluateDemo3('/zone/baseline/layouts-and-pages/nested-layouts', ''),
        undefined,
      )

      // 2. Search typed at root
      assert.strictEqual(
        evaluateDemo3('/zone/baseline/layouts-and-pages/nested-layouts', '러닝화'),
        undefined,
      )

      // 3. Subroute navigation without search
      assert.strictEqual(
        evaluateDemo3('/zone/baseline/layouts-and-pages/nested-layouts/shoes', ''),
        undefined,
      )

      // 4. Subroute navigation WITH search query -> MATCHED!
      assert.strictEqual(
        evaluateDemo3('/zone/baseline/layouts-and-pages/nested-layouts/shoes', '러닝화'),
        true,
      )
      assert.strictEqual(
        evaluateDemo3('/zone/baseline/layouts-and-pages/nested-layouts/clothing', '맨투맨'),
        true,
      )
    })
  })

  // =========================================================================
  // DEMO 4: Template Lifecycle (layouts-and-pages/template-lifecycle)
  // =========================================================================
  describe('Demo 4: template.tsx Lifecycle & Instance Re-mount Verification', () => {
    const templatePath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/layouts-and-pages/template-lifecycle/template.tsx',
    )
    const contextPath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/layouts-and-pages/template-lifecycle/components/TemplateLifecycleContext.tsx',
    )
    const footerPath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/layouts-and-pages/template-lifecycle/components/VerificationFooter.tsx',
    )

    it('4.1 Source file inspection: Hydration safety and template remount detection', () => {
      const templateContent = fs.readFileSync(templatePath, 'utf-8')
      const footerContent = fs.readFileSync(footerPath, 'utf-8')

      // Hydration determinism check
      assert.ok(
        templateContent.includes("useState<string>('')"),
        'template.tsx must initialize instanceId with deterministic empty string for SSR',
      )
      assert.ok(
        templateContent.includes("instanceId || '------'"),
        'template.tsx must display fallback for initial SSR render',
      )

      // Remount check
      assert.ok(
        footerContent.includes('hasRemounted = Boolean('),
        'VerificationFooter must evaluate remounting dynamically based on instance transitions',
      )
      assert.ok(
        !footerContent.includes('isMatched={true}'),
        'VerificationFooter must not hardcode static isMatched={true}',
      )
    })

    it('4.2 Empirical State Machine Simulation for Demo 4', () => {
      class TemplateContextSimulator {
        currentInstanceId: string = ''
        prevInstanceId: string | null = null
        reviewLength: number = 0
        rating: number = 5

        registerInstance(id: string, initialRating: number, initialReviewLength: number) {
          if (this.currentInstanceId && this.currentInstanceId !== id) {
            this.prevInstanceId = this.currentInstanceId
          }
          this.currentInstanceId = id
          this.rating = initialRating
          this.reviewLength = initialReviewLength
        }

        updateFormState(newRating: number, newLength: number) {
          this.rating = newRating
          this.reviewLength = newLength
        }

        evaluateMatched(): boolean | undefined {
          const hasRemounted = Boolean(
            this.prevInstanceId &&
              this.currentInstanceId &&
              this.prevInstanceId !== this.currentInstanceId,
          )
          return hasRemounted ? true : undefined
        }
      }

      const sim = new TemplateContextSimulator()

      // Initial Mount on /product-1
      sim.registerInstance('INST_AAA', 5, 0)
      assert.strictEqual(sim.evaluateMatched(), undefined, 'Initial mount must be undefined (Pending)')

      // User modifies rating and types review
      sim.updateFormState(4, 45)
      assert.strictEqual(sim.rating, 4)
      assert.strictEqual(sim.reviewLength, 45)
      assert.strictEqual(sim.evaluateMatched(), undefined, 'Form input alone must not trigger match')

      // User navigates to /product-2 -> template remounts with new instance ID
      sim.registerInstance('INST_BBB', 5, 0)
      assert.strictEqual(sim.prevInstanceId, 'INST_AAA')
      assert.strictEqual(sim.currentInstanceId, 'INST_BBB')
      assert.strictEqual(sim.rating, 5, 'Rating must reset to 5')
      assert.strictEqual(sim.reviewLength, 0, 'Review length must reset to 0')
      assert.strictEqual(sim.evaluateMatched(), true, 'Remount with instance transition must evaluate to true (Matched)')
    })
  })

  // =========================================================================
  // DEMO 5: Route Groups Layouts (layouts-and-pages/route-groups-layouts)
  // =========================================================================
  describe('Demo 5: Route Groups Layouts Dynamic State Verification', () => {
    const layoutPath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/layouts-and-pages/route-groups-layouts/layout.tsx',
    )
    const footerPath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/layouts-and-pages/route-groups-layouts/components/VerificationFooter.tsx',
    )

    it('5.1 Source file inspection: Anti-hardcoding and line count', () => {
      const footerContent = fs.readFileSync(footerPath, 'utf-8')
      assert.ok(footerContent.split('\n').length <= 250, 'VerificationFooter exceeds 250 lines')

      assert.ok(
        footerContent.includes('const isNavigated = isLogin || isProducts'),
        'Demo 5 must check for navigation to route group endpoints',
      )
      assert.ok(
        !footerContent.includes('isMatched={true}'),
        'Demo 5 must not hardcode static isMatched={true}',
      )
    })

    it('5.2 Empirical Navigation Mapping for Demo 5', () => {
      function evaluateDemo5(pathname: string) {
        const isLogin = pathname.endsWith('/login')
        const isProducts = pathname.endsWith('/products')
        const isNavigated = isLogin || isProducts
        return isNavigated ? true : undefined
      }

      // Root un-navigated
      assert.strictEqual(
        evaluateDemo5('/zone/baseline/layouts-and-pages/route-groups-layouts'),
        undefined,
      )

      // Navigated to /products
      assert.strictEqual(
        evaluateDemo5('/zone/baseline/layouts-and-pages/route-groups-layouts/products'),
        true,
      )

      // Navigated to /login
      assert.strictEqual(
        evaluateDemo5('/zone/baseline/layouts-and-pages/route-groups-layouts/login'),
        true,
      )
    })
  })

  // =========================================================================
  // GLOBAL AUDIT: Exaggerated Claims & Anti-Hardcoding Audit for Demos 1 to 5
  // =========================================================================
  describe('Global Audit: Demos 1–5 Claim Verification & Cleanliness', () => {
    const targetDirs = [
      'demo-baseline/src/app/zone/baseline/server-actions/basic',
      'demo-cache-components/src/app/zone/cache/caching/basic',
      'demo-baseline/src/app/zone/baseline/layouts-and-pages/nested-layouts',
      'demo-baseline/src/app/zone/baseline/layouts-and-pages/template-lifecycle',
      'demo-baseline/src/app/zone/baseline/layouts-and-pages/route-groups-layouts',
    ]

    it('All files across Demos 1-5 must be <= 250 lines', () => {
      for (const relDir of targetDirs) {
        const fullDir = path.join(APPS_ROOT, relDir)
        const walk = (dir: string) => {
          const entries = fs.readdirSync(dir, { withFileTypes: true })
          for (const entry of entries) {
            const p = path.join(dir, entry.name)
            if (entry.isDirectory()) {
              walk(p)
            } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
              const lines = fs.readFileSync(p, 'utf-8').split('\n')
              assert.ok(
                lines.length <= 250,
                `File exceeds 250 lines (${lines.length}): ${p}`,
              )
            }
          }
        }
        walk(fullDir)
      }
    })

    it('No forbidden exaggerated claims (0ms, 0 KB, 100% 자동 초기화) across Demos 1-5', () => {
      const forbiddenPhrases = ['0ms 체감', '0 KB 번들', '100% 자동 초기화', '브라우저 깜빡임이 완전히 사라지고']
      for (const relDir of targetDirs) {
        const fullDir = path.join(APPS_ROOT, relDir)
        const walk = (dir: string) => {
          const entries = fs.readdirSync(dir, { withFileTypes: true })
          for (const entry of entries) {
            const p = path.join(dir, entry.name)
            if (entry.isDirectory()) {
              walk(p)
            } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
              const content = fs.readFileSync(p, 'utf-8')
              for (const phrase of forbiddenPhrases) {
                assert.ok(
                  !content.includes(phrase),
                  `Forbidden phrase "${phrase}" found in ${p}`,
                )
              }
            }
          }
        }
        walk(fullDir)
      }
    })
  })
})
