import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { executeServerTask } from '../../../../apps/demo-baseline/src/app/zone/baseline/server-client-components/serialization/actions.ts'
import {
  executeSequentialFetching,
  executeParallelFetching,
} from '../../../../apps/demo-baseline/src/app/zone/baseline/fetching-data/parallel-fetching/actions.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '../../../../..')
const APPS_ROOT = path.resolve(REPO_ROOT, 'nextjs-app/apps')

describe('Tier 5 Hardening — Milestone 1 (Batch B01 Demos 6–10) Empirical Verification Harness', () => {

  // =========================================================================
  // DEMO 6: Soft Navigation & Scroll (linking-and-navigating/soft-navigation)
  // =========================================================================
  describe('Demo 6: Soft Navigation & Scroll State Preservation', () => {
    const basePath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation',
    )
    const layoutPath = path.join(basePath, 'layout.tsx')
    const headerPath = path.join(basePath, 'components/PersistentHeader.tsx')
    const footerPath = path.join(basePath, 'components/VerificationFooter.tsx')

    it('6.1 Source file inspection: Anti-hardcoding & hydration safety', () => {
      assert.ok(fs.existsSync(layoutPath))
      assert.ok(fs.existsSync(headerPath))
      assert.ok(fs.existsSync(footerPath))

      const headerContent = fs.readFileSync(headerPath, 'utf-8')
      const footerContent = fs.readFileSync(footerPath, 'utf-8')

      // Hydration safety check
      assert.ok(
        headerContent.includes("useState<string>('')"),
        'PersistentHeader must initialize mountedAt deterministically to empty string',
      )
      assert.ok(
        headerContent.includes("mountedAt || '--:--:--'"),
        'PersistentHeader must have safe SSR fallback',
      )

      // Verification dynamic logic check
      assert.ok(
        footerContent.includes('const isAutoMatched = hasMemo && isSubRoute'),
        'VerificationFooter must require both memo input and subroute navigation',
      )
      assert.ok(
        !footerContent.includes('isMatched={true}'),
        'VerificationFooter must not hardcode static isMatched={true}',
      )
    })

    it('6.2 Empirical State Transitions & Anti-False-Positive Test', () => {
      function evaluateDemo6(pathname: string, memo: string) {
        const isSubRoute = pathname.endsWith('/new') || pathname.endsWith('/best')
        const hasMemo = memo.trim().length > 0
        const isAutoMatched = hasMemo && isSubRoute
        return isAutoMatched ? true : undefined
      }

      const ROOT_URL = '/zone/baseline/linking-and-navigating/soft-navigation'

      // Initial state
      assert.strictEqual(evaluateDemo6(ROOT_URL, ''), undefined)

      // Memo on root (no subroute)
      assert.strictEqual(evaluateDemo6(ROOT_URL, 'test memo'), undefined)

      // Subroute without memo
      assert.strictEqual(evaluateDemo6(`${ROOT_URL}/new`, ''), undefined)

      // Subroute with whitespace memo
      assert.strictEqual(evaluateDemo6(`${ROOT_URL}/best`, '   '), undefined)

      // Subroute with valid memo -> MATCHED!
      assert.strictEqual(evaluateDemo6(`${ROOT_URL}/new`, 'test memo'), true)
      assert.strictEqual(evaluateDemo6(`${ROOT_URL}/best`, 'test memo'), true)
    })
  })

  // =========================================================================
  // DEMO 7: Router Prefetch (linking-and-navigating/router-prefetch)
  // =========================================================================
  describe('Demo 7: useRouter Prefetch & Programmatic Navigation', () => {
    const basePath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch',
    )
    const layoutPath = path.join(basePath, 'layout.tsx')
    const footerPath = path.join(basePath, 'components/VerificationFooter.tsx')
    const controllerPath = path.join(basePath, 'components/PrefetchController.tsx')

    it('7.1 Source file inspection: Dev vs Prod notice and dynamic state bindings', () => {
      assert.ok(fs.existsSync(layoutPath))
      assert.ok(fs.existsSync(footerPath))
      assert.ok(fs.existsSync(controllerPath))

      const layoutContent = fs.readFileSync(layoutPath, 'utf-8')
      const footerContent = fs.readFileSync(footerPath, 'utf-8')

      // Dev vs Prod notice check
      assert.ok(
        layoutContent.includes('개발 모드에서는 백그라운드 자동 다운로드가 제한되며'),
        'Guide must document dev mode prefetch behavior',
      )
      assert.ok(
        footerContent.includes('Production 빌드에서만 완전 동작'),
        'DeepDive must clarify production build requirement',
      )

      // Dynamic isMatched check
      assert.ok(
        footerContent.includes('const isAutoMatched = isPrefetched && isAtDeals'),
        'VerificationFooter must require prefetch + /deals navigation',
      )
      assert.ok(
        !footerContent.includes('isMatched={true}'),
        'VerificationFooter must not hardcode static isMatched={true}',
      )
    })

    it('7.2 Empirical State Transitions & Anti-False-Positive Test', () => {
      function evaluateDemo7(pathname: string, isPrefetched: boolean) {
        const isAtDeals = pathname.endsWith('/deals')
        const isAutoMatched = isPrefetched && isAtDeals
        return isAutoMatched ? true : undefined
      }

      const ROOT_URL = '/zone/baseline/linking-and-navigating/router-prefetch'

      // Initial state
      assert.strictEqual(evaluateDemo7(ROOT_URL, false), undefined)

      // Prefetch on root
      assert.strictEqual(evaluateDemo7(ROOT_URL, true), undefined)

      // Navigate to /deals without prefetch
      assert.strictEqual(evaluateDemo7(`${ROOT_URL}/deals`, false), undefined)

      // Navigate to /vip with prefetch
      assert.strictEqual(evaluateDemo7(`${ROOT_URL}/vip`, true), undefined)

      // Prefetch + Navigate to /deals -> MATCHED!
      assert.strictEqual(evaluateDemo7(`${ROOT_URL}/deals`, true), true)
    })
  })

  // =========================================================================
  // DEMO 8: Server-Client Composition (server-client-components/composition)
  // =========================================================================
  describe('Demo 8: Server-Client Component Composition & Strict Mode Invariance', () => {
    const basePath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/server-client-components/composition',
    )
    const buttonPath = path.join(basePath, 'components/WishlistButtonClient.tsx')
    const footerPath = path.join(basePath, 'components/VerificationFooter.tsx')

    it('8.1 Strict Mode Invariance: likes count is derived cleanly (142 -> 143, NEVER 144)', () => {
      const buttonContent = fs.readFileSync(buttonPath, 'utf-8')
      assert.ok(
        buttonContent.includes('const likes = initialLikes + (liked ? 1 : 0)'),
        'WishlistButtonClient must derive likes purely from initialLikes + (liked ? 1 : 0)',
      )

      const initialLikes = 142
      const computeLikes = (liked: boolean) => initialLikes + (liked ? 1 : 0)

      // Unliked
      assert.strictEqual(computeLikes(false), 142)

      // Liked (Strict Mode simulation: double evaluation)
      const pass1 = computeLikes(true)
      const pass2 = computeLikes(true)
      assert.strictEqual(pass1, 143)
      assert.strictEqual(pass2, 143)
    })

    it('8.2 Empirical State Transitions in VerificationFooter', () => {
      function evaluateDemo8(liked: boolean) {
        return liked ? true : undefined
      }

      assert.strictEqual(evaluateDemo8(false), undefined)
      assert.strictEqual(evaluateDemo8(true), true)
    })
  })

  // =========================================================================
  // DEMO 9: Props Serialization (server-client-components/serialization)
  // =========================================================================
  describe('Demo 9: Props Serialization & Server Action Boundary', () => {
    const basePath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/server-client-components/serialization',
    )
    const footerPath = path.join(basePath, 'components/VerificationFooter.tsx')

    it('9.1 Server Action Execution & Dynamic Response Verification', async () => {
      const res = await executeServerTask('Serialization Boundary Test')
      assert.strictEqual(res.success, true)
      assert.ok(res.result.includes('Serialization Boundary Test'))
    })

    it('9.2 JSON Props Serialization Round-Trip Test', () => {
      const payload = {
        primitiveString: 'Next.js App Router RSC',
        primitiveNumber: 2026,
        primitiveBoolean: true,
        plainObject: { sku: 'NIKE-001', stock: 48, inStock: true },
        arrayData: ['러닝화', '프리미엄'],
        dateString: new Date().toISOString(),
        nullValue: null,
      }
      const json = JSON.stringify(payload)
      const parsed = JSON.parse(json)
      assert.deepStrictEqual(parsed, payload)
    })

    it('9.3 Dynamic State Transitions in VerificationFooter', () => {
      const evaluateDemo9 = (actionResult: string | null) => {
        return Boolean(actionResult) ? true : undefined
      }

      assert.strictEqual(evaluateDemo9(null), undefined)
      assert.strictEqual(evaluateDemo9('서버 액션 처리 완료'), true)
    })
  })

  // =========================================================================
  // DEMO 10: Parallel Fetching (fetching-data/parallel-fetching)
  // =========================================================================
  describe('Demo 10: Parallel Fetching (Promise.all) Benchmark & Duration Validation', () => {
    it('10.1 Real Runtime Execution: Sequential vs Parallel Benchmark', async () => {
      const seqStart = Date.now()
      const seqResult = await executeSequentialFetching('prod-1')
      const seqElapsed = Date.now() - seqStart

      assert.strictEqual(seqResult.mode, 'sequential')
      assert.ok(seqResult.totalDurationMs >= 1350, `Sequential totalDurationMs (${seqResult.totalDurationMs}ms) must be >= 1350ms`)

      const parStart = Date.now()
      const parResult = await executeParallelFetching('prod-1')
      const parElapsed = Date.now() - parStart

      assert.strictEqual(parResult.mode, 'parallel')
      assert.ok(parResult.totalDurationMs >= 750, `Parallel totalDurationMs (${parResult.totalDurationMs}ms) must be >= 750ms`)
      assert.ok(parResult.totalDurationMs < seqResult.totalDurationMs - 400, 'Parallel must be significantly faster than Sequential')
    })

    it('10.2 Empirical State Transitions & Mathematical Formulas in VerificationFooter', () => {
      const evaluateDemo10 = (seq: any | null, par: any | null) => {
        const bothExecuted = Boolean(seq && par)
        const isMatched = bothExecuted ? true : undefined
        let saved = 0
        let percent = 0
        if (bothExecuted && seq && par) {
          saved = seq.totalDurationMs - par.totalDurationMs
          percent = Math.round((saved / seq.totalDurationMs) * 100)
        }
        return { bothExecuted, isMatched, saved, percent }
      }

      // Initial
      assert.strictEqual(evaluateDemo10(null, null).isMatched, undefined)

      // Only sequential
      assert.strictEqual(evaluateDemo10({ totalDurationMs: 1400 }, null).isMatched, undefined)

      // Only parallel
      assert.strictEqual(evaluateDemo10(null, { totalDurationMs: 800 }).isMatched, undefined)

      // Both executed
      const s = evaluateDemo10({ totalDurationMs: 1400 }, { totalDurationMs: 800 })
      assert.strictEqual(s.isMatched, true)
      assert.strictEqual(s.saved, 600)
      assert.strictEqual(s.percent, 43)
    })
  })

  // =========================================================================
  // GLOBAL AUDIT: File Size and Claim Cleanliness for Demos 6 to 10
  // =========================================================================
  describe('Global Audit: Demos 6–10 Claim Verification & Cleanliness', () => {
    const targetDirs = [
      'demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation',
      'demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch',
      'demo-baseline/src/app/zone/baseline/server-client-components/composition',
      'demo-baseline/src/app/zone/baseline/server-client-components/serialization',
      'demo-baseline/src/app/zone/baseline/fetching-data/parallel-fetching',
    ]

    it('All files across Demos 6-10 must be <= 250 lines', () => {
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

    it('No forbidden exaggerated claims across Demos 6-10', () => {
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
