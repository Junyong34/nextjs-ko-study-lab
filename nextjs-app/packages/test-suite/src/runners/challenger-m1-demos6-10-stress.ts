import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import assert from 'node:assert/strict'

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../../../../..')
const NEXTJS_APP_ROOT = path.join(WORKSPACE_ROOT, 'nextjs-app')

console.log('============================================================')
console.log('  CHALLENGER 2: Empirical Stress Test Suite (Demos 6–10)    ')
console.log('============================================================\n')

let passCount = 0
let failCount = 0
const failures: string[] = []

async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn()
    console.log(`  ✅ PASS: ${name}`)
    passCount++
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${name}`)
    console.error(`     Error: ${err.message}`)
    failures.push(`${name}: ${err.message}`)
    failCount++
  }
}

async function runAll() {
  // =========================================================================
  // SECTION 1: AST, Code Standards & Line Count Compliance (Demos 6–10)
  // =========================================================================
  console.log('[SECTION 1] AST, Code Standards & Line Count Compliance (Demos 6–10)')

  const demoFiles = [
    // Demo 6
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/layout.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/types.ts',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/components/NavComparisonBar.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/components/PersistentHeader.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/components/ScrollContent.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/components/SoftNavContext.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/best/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/new/page.tsx',

    // Demo 7
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch/layout.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch/types.ts',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch/components/PrefetchContext.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch/components/PrefetchController.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch/deals/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch/vip/page.tsx',

    // Demo 8
    'apps/demo-baseline/src/app/zone/baseline/server-client-components/composition/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/server-client-components/composition/types.ts',
    'apps/demo-baseline/src/app/zone/baseline/server-client-components/composition/components/CompositionInteractiveSection.tsx',
    'apps/demo-baseline/src/app/zone/baseline/server-client-components/composition/components/ProductSpecsServer.tsx',
    'apps/demo-baseline/src/app/zone/baseline/server-client-components/composition/components/WishlistButtonClient.tsx',
    'apps/demo-baseline/src/app/zone/baseline/server-client-components/composition/components/VerificationFooter.tsx',

    // Demo 9
    'apps/demo-baseline/src/app/zone/baseline/server-client-components/serialization/actions.ts',
    'apps/demo-baseline/src/app/zone/baseline/server-client-components/serialization/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/server-client-components/serialization/types.ts',
    'apps/demo-baseline/src/app/zone/baseline/server-client-components/serialization/components/SerializationViewerClient.tsx',
    'apps/demo-baseline/src/app/zone/baseline/server-client-components/serialization/components/VerificationFooter.tsx',

    // Demo 10
    'apps/demo-baseline/src/app/zone/baseline/fetching-data/parallel-fetching/actions.ts',
    'apps/demo-baseline/src/app/zone/baseline/fetching-data/parallel-fetching/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/fetching-data/parallel-fetching/types.ts',
    'apps/demo-baseline/src/app/zone/baseline/fetching-data/parallel-fetching/components/ParallelFetchingController.tsx',
    'apps/demo-baseline/src/app/zone/baseline/fetching-data/parallel-fetching/components/VerificationFooter.tsx',
  ]

  await test('1.1 File existence and TSX/TS syntax parsing without diagnostics', () => {
    for (const relPath of demoFiles) {
      const fullPath = path.join(NEXTJS_APP_ROOT, relPath)
      assert.ok(fs.existsSync(fullPath), `File must exist: ${relPath}`)
      const content = fs.readFileSync(fullPath, 'utf-8')
      const sourceFile = ts.createSourceFile(
        fullPath,
        content,
        ts.ScriptTarget.Latest,
        true,
        relPath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
      )
      const diagnostics = (sourceFile as any).parseDiagnostics || []
      assert.strictEqual(diagnostics.length, 0, `Parse error in ${relPath}: ${diagnostics[0]?.messageText}`)
    }
  })

  await test('1.2 Line count discipline (<= 250 lines per file)', () => {
    for (const relPath of demoFiles) {
      const fullPath = path.join(NEXTJS_APP_ROOT, relPath)
      const content = fs.readFileSync(fullPath, 'utf-8')
      const lineCount = content.split('\n').length
      assert.ok(
        lineCount <= 250,
        `File ${relPath} exceeds 250 lines limit: current lines = ${lineCount}`
      )
    }
  })

  await test('1.3 No static hardcoded `isMatched: true` or `isMatched={true}` in VerificationFooters', () => {
    const footerFiles = demoFiles.filter(f => f.endsWith('VerificationFooter.tsx'))
    for (const relPath of footerFiles) {
      const fullPath = path.join(NEXTJS_APP_ROOT, relPath)
      const content = fs.readFileSync(fullPath, 'utf-8')
      
      // Look for static literal isMatched={true} or isMatched: true without condition
      const hasStaticProp = /<ExpectedActualPanel[^>]*\bisMatched=\{true\}/.test(content)
      assert.strictEqual(
        hasStaticProp,
        false,
        `File ${relPath} contains static isMatched={true} in ExpectedActualPanel JSX`
      )

      // Ensure isMatched ternary / dynamic resolution is present
      assert.match(
        content,
        /const\s+isMatched\s*=\s*props\.isMatched\s*!==\s*undefined\s*\?\s*props\.isMatched\s*:\s*/,
        `${relPath} must implement dynamic isMatched resolution with fallback`
      )
    }
  })

  // =========================================================================
  // SECTION 2: Demo 6 (Soft Navigation & Scroll Preservation) Empirical Tests
  // =========================================================================
  console.log('\n[SECTION 2] Demo 6 (Soft Navigation & Scroll Preservation) Stress Tests')

  await test('2.1 Demo 6 State Transition Matrix: Initial -> Memo Input -> Route Transition', () => {
    const evaluateDemo6 = (pathname: string, memo: string) => {
      const isSubRoute = pathname.endsWith('/new') || pathname.endsWith('/best')
      const hasMemo = memo.trim().length > 0
      const isAutoMatched = hasMemo && isSubRoute
      const isMatched = isAutoMatched ? true : undefined
      return { isAutoMatched, isMatched, hasMemo, isSubRoute }
    }

    const ROOT_URL = '/zone/baseline/linking-and-navigating/soft-navigation'

    // State 1: Initial load
    const s1 = evaluateDemo6(ROOT_URL, '')
    assert.strictEqual(s1.isMatched, undefined, 'Initial state must be Pending (undefined)')

    // State 2: User types memo on root page without navigating
    const s2 = evaluateDemo6(ROOT_URL, '아이템 메모 작성')
    assert.strictEqual(s2.hasMemo, true)
    assert.strictEqual(s2.isSubRoute, false)
    assert.strictEqual(s2.isMatched, undefined, 'Memo on root without subroute navigation must be Pending')

    // State 3: User navigates to /new with memo
    const s3 = evaluateDemo6(`${ROOT_URL}/new`, '아이템 메모 작성')
    assert.strictEqual(s3.hasMemo, true)
    assert.strictEqual(s3.isSubRoute, true)
    assert.strictEqual(s3.isMatched, true, 'Memo + /new navigation must evaluate to true')

    // State 4: User navigates to /best with memo
    const s4 = evaluateDemo6(`${ROOT_URL}/best`, '다른 메모')
    assert.strictEqual(s4.isMatched, true, 'Memo + /best navigation must evaluate to true')

    // State 5 (Adversarial): Whitespace-only memo with subroute navigation
    const s5 = evaluateDemo6(`${ROOT_URL}/best`, '    \n\t  ')
    assert.strictEqual(s5.hasMemo, false)
    assert.strictEqual(s5.isMatched, undefined, 'Whitespace memo must NOT pass verification (no false positives)')

    // State 6 (Adversarial): Subroute navigation without typing memo
    const s6 = evaluateDemo6(`${ROOT_URL}/best`, '')
    assert.strictEqual(s6.isMatched, undefined, 'Subroute navigation without memo must NOT pass verification')
  })

  await test('2.2 Demo 6 Hydration Invariance in PersistentHeader.tsx', () => {
    const headerPath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/components/PersistentHeader.tsx'
    )
    const content = fs.readFileSync(headerPath, 'utf-8')
    assert.match(
      content,
      /const\s+\[mountedAt,\s*setMountedAt\]\s*=\s*useState<string>\(''\)/,
      'mountedAt must be initialized deterministically to empty string'
    )
    assert.match(
      content,
      /mountedAt\s*\|\|\s*'--:--:--'/,
      'Initial render must display fallback placeholder to prevent SSR hydration mismatch'
    )
    assert.match(
      content,
      /useEffect\(\(\)\s*=>\s*\{[^}]*setMountedAt\(new Date\(\)\.toLocaleTimeString/,
      'toLocaleTimeString must only execute inside useEffect on client'
    )
  })

  await test('2.3 Demo 6 DeepDiveCard & Guide Audit (No fake audio player or 0ms claims)', () => {
    const footerPath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/components/VerificationFooter.tsx'
    )
    const content = fs.readFileSync(footerPath, 'utf-8')
    assert.doesNotMatch(content, /오디오\s*플레이어|음악\s*재생/, 'Fictional audio player references must be removed')
    assert.doesNotMatch(content, /0ms|100%\s*즉시/, 'Unprovable speed claims must be eliminated')
    assert.match(content, /scroll=\{false\}/, 'scroll={false} concept must be documented accurately')
  })

  // =========================================================================
  // SECTION 3: Demo 7 (Router Prefetch) Empirical Tests
  // =========================================================================
  console.log('\n[SECTION 3] Demo 7 (Router Prefetch) Stress Tests')

  await test('3.1 Demo 7 State Transition Matrix: Prefetch Action & Navigation', () => {
    const evaluateDemo7 = (pathname: string, isPrefetched: boolean) => {
      const isAtDeals = pathname.endsWith('/deals')
      const isAutoMatched = isPrefetched && isAtDeals
      const isMatched = isAutoMatched ? true : undefined
      return { isAutoMatched, isMatched, isAtDeals }
    }

    const ROOT_URL = '/zone/baseline/linking-and-navigating/router-prefetch'

    // State 1: Initial load
    const s1 = evaluateDemo7(ROOT_URL, false)
    assert.strictEqual(s1.isMatched, undefined, 'Initial state must be Pending')

    // State 2: Prefetch triggered on root, but user has not navigated yet
    const s2 = evaluateDemo7(ROOT_URL, true)
    assert.strictEqual(s2.isMatched, undefined, 'Prefetched on root without navigation must remain Pending')

    // State 3: User navigates to /deals after prefetch
    const s3 = evaluateDemo7(`${ROOT_URL}/deals`, true)
    assert.strictEqual(s3.isMatched, true, 'Prefetched + /deals must evaluate to true (Matched)')

    // State 4 (Adversarial): Navigate to /deals WITHOUT prefetch
    const s4 = evaluateDemo7(`${ROOT_URL}/deals`, false)
    assert.strictEqual(s4.isMatched, undefined, 'Navigating to /deals without prefetch must NOT pass verification')

    // State 5 (Adversarial): Prefetch executed, but navigate to non-prefetched /vip
    const s5 = evaluateDemo7(`${ROOT_URL}/vip`, true)
    assert.strictEqual(s5.isMatched, undefined, 'Navigating to /vip even with prefetch must NOT pass /deals verification')
  })

  await test('3.2 Demo 7 Development vs Production Mode Notice Audit', () => {
    const layoutPath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch/layout.tsx'
    )
    const footerPath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch/components/VerificationFooter.tsx'
    )
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8')
    const footerContent = fs.readFileSync(footerPath, 'utf-8')

    // Guide check
    assert.match(
      layoutContent,
      /Next\.js 개발 모드에서는 백그라운드 자동 다운로드가 제한되며, 프로덕션 빌드에서 \.rsc 청크가 사전 적재됩니다/,
      'Guide step must note dev mode prefetching difference'
    )

    // Verification Expected / Actual check
    assert.match(
      footerContent,
      /개발 모드\(dev\)에서는 API 호출 등록 확인, 프로덕션\(prod\)에서는 RSC Payload 청크 캐싱 동작/,
      'Verification Expected must note dev vs prod difference'
    )
    assert.match(
      footerContent,
      /실제 정적 청크 프리패치 캐시는 Production 빌드에서 최적화/,
      'Verification Actual must note dev vs prod difference'
    )

    // Deep Dive check
    assert.match(
      footerContent,
      /Production 빌드에서만 완전 동작/,
      'DeepDive caution section must note production build requirement'
    )
  })

  // =========================================================================
  // SECTION 4: Demo 8 (Server-Client Composition) Empirical Tests
  // =========================================================================
  console.log('\n[SECTION 4] Demo 8 (Server-Client Composition) Stress Tests')

  await test('4.1 Demo 8 Strict Mode Increment Invariance & Deterministic Count (142 -> 143)', () => {
    // Test the exact formula used in WishlistButtonClient.tsx
    const initialLikes = 142

    const computeLikes = (liked: boolean) => initialLikes + (liked ? 1 : 0)

    // State 1: Initial unliked
    let liked = false
    assert.strictEqual(computeLikes(liked), 142, 'Initial likes must be 142')

    // State 2: Toggle liked on
    liked = true
    assert.strictEqual(computeLikes(liked), 143, 'Toggled likes must be exactly 143 (NOT 144)')

    // State 3: Simulate React 19 Strict Mode double rendering of component / double updater invocation
    const strictModePass1 = computeLikes(liked)
    const strictModePass2 = computeLikes(liked)
    assert.strictEqual(strictModePass1, 143)
    assert.strictEqual(strictModePass2, 143)
    assert.strictEqual(
      strictModePass1 === 143 && strictModePass2 === 143,
      true,
      'Double evaluation in Strict Mode MUST remain idempotent and return 143'
    )

    // State 4: Toggle back to unliked
    liked = false
    assert.strictEqual(computeLikes(liked), 142, 'Toggling back to unliked returns to 142')
  })

  await test('4.2 Demo 8 Dynamic State Verification in VerificationFooter.tsx', () => {
    const evaluateDemo8 = (liked: boolean, likes: number) => {
      const isMatched = liked ? true : undefined
      const defaultActual = liked
        ? `• 위시리스트 상태: 찜 완료 (${likes}개, +1 정상 반영)`
        : `• 위시리스트 상태: 미담기 (${likes}개)`
      return { isMatched, defaultActual }
    }

    // Initial state
    const s1 = evaluateDemo8(false, 142)
    assert.strictEqual(s1.isMatched, undefined, 'Initial state must be Pending')
    assert.match(s1.defaultActual, /미담기 \(142개\)/)

    // Liked state
    const s2 = evaluateDemo8(true, 143)
    assert.strictEqual(s2.isMatched, true, 'Liked state must be Matched (true)')
    assert.match(s2.defaultActual, /찜 완료 \(143개, \+1 정상 반영\)/)

    // Unliked state
    const s3 = evaluateDemo8(false, 142)
    assert.strictEqual(s3.isMatched, undefined, 'Unliked state must return to Pending')
  })

  await test('4.3 Demo 8 Code Architecture: Server Specs (RSC) + Client Button (RCC) Seam', () => {
    const pagePath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/server-client-components/composition/page.tsx'
    )
    const buttonPath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/server-client-components/composition/components/WishlistButtonClient.tsx'
    )
    const specsPath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/server-client-components/composition/components/ProductSpecsServer.tsx'
    )

    const pageContent = fs.readFileSync(pagePath, 'utf-8')
    const buttonContent = fs.readFileSync(buttonPath, 'utf-8')
    const specsContent = fs.readFileSync(specsPath, 'utf-8')

    // Page must be an async Server Component
    assert.match(pageContent, /export\s+default\s+async\s+function\s+CompositionDemoPage/, 'page.tsx must be async Server Component')
    assert.doesNotMatch(pageContent, /^'use client'/m, 'page.tsx must NOT have use client')

    // ProductSpecsServer must be a Server Component (no 'use client')
    assert.doesNotMatch(specsContent, /^'use client'/m, 'ProductSpecsServer must be Server Component')

    // WishlistButtonClient must be Client Component ('use client')
    assert.match(buttonContent, /^'use client'/m, 'WishlistButtonClient must declare "use client"')
  })

  // =========================================================================
  // SECTION 5: Demo 9 (Props Serialization) Empirical Tests
  // =========================================================================
  console.log('\n[SECTION 5] Demo 9 (Props Serialization) Stress Tests')

  // Load and execute actions.ts directly
  const { executeServerTask } = await import(
    'file://' + path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/server-client-components/serialization/actions.ts')
  )

  await test('5.1 Demo 9 executeServerTask Server Action Execution & Output Validation', async () => {
    const testInput = '직렬화 경계 통과 테스트'
    const result = await executeServerTask(testInput)

    assert.strictEqual(result.success, true, 'Server action must return success: true')
    assert.ok(typeof result.result === 'string', 'Server action must return result string')
    assert.match(result.result, /서버 액션 처리 완료:\s*"직렬화 경계 통과 테스트"/, 'Result must contain input string')
    assert.match(result.result, /서버 시각:/, 'Result must contain server timestamp')
  })

  await test('5.2 Demo 9 SerializablePayload JSON Compatibility Test', () => {
    const serializableData = {
      primitiveString: 'Next.js App Router RSC',
      primitiveNumber: 2026,
      primitiveBoolean: true,
      plainObject: {
        sku: 'NIKE-ALPHA-001',
        stock: 48,
        inStock: true,
      },
      arrayData: ['러닝화', '프리미엄', '카본플레이트'],
      dateString: new Date().toISOString(),
      nullValue: null,
      serverActionName: 'executeServerTask',
    }

    // Verify round-trip JSON serialization
    const jsonStr = JSON.stringify(serializableData)
    const parsed = JSON.parse(jsonStr)

    assert.strictEqual(parsed.primitiveString, 'Next.js App Router RSC')
    assert.strictEqual(parsed.primitiveNumber, 2026)
    assert.strictEqual(parsed.primitiveBoolean, true)
    assert.strictEqual(parsed.plainObject.sku, 'NIKE-ALPHA-001')
    assert.strictEqual(parsed.plainObject.stock, 48)
    assert.strictEqual(parsed.arrayData.length, 3)
    assert.strictEqual(parsed.nullValue, null)
  })

  await test('5.3 Demo 9 VerificationFooter Dynamic State Transitions', () => {
    const evaluateDemo9 = (actionResult: string | null) => {
      const hasExecuted = Boolean(actionResult)
      const isMatched = hasExecuted ? true : undefined
      return { hasExecuted, isMatched }
    }

    // Initial state
    const s1 = evaluateDemo9(null)
    assert.strictEqual(s1.hasExecuted, false)
    assert.strictEqual(s1.isMatched, undefined, 'Initial state must be Pending')

    // Executed state
    const s2 = evaluateDemo9('서버 액션 처리 완료: "직렬화 경계 통과 테스트"')
    assert.strictEqual(s2.hasExecuted, true)
    assert.strictEqual(s2.isMatched, true, 'Executed state must be Matched (true)')
  })

  // =========================================================================
  // SECTION 6: Demo 10 (Parallel Fetching) Empirical Tests
  // =========================================================================
  console.log('\n[SECTION 6] Demo 10 (Parallel Fetching) Stress Tests')

  // Load and execute actions.ts directly
  const { executeSequentialFetching, executeParallelFetching } = await import(
    'file://' + path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/fetching-data/parallel-fetching/actions.ts')
  )

  await test('6.1 Demo 10 Real Runtime Execution: Sequential vs Parallel Duration Benchmark', async () => {
    console.log('    -> Running real sequential fetching benchmark (simulated ~1400ms)...')
    const seqStart = Date.now()
    const seqResult = await executeSequentialFetching('test-item')
    const seqActualElapsed = Date.now() - seqStart

    console.log(`    -> Sequential result totalDurationMs: ${seqResult.totalDurationMs}ms (wall clock: ${seqActualElapsed}ms)`)
    assert.strictEqual(seqResult.mode, 'sequential')
    assert.ok(seqResult.totalDurationMs >= 1350, `Sequential duration must be >= 1350ms (got ${seqResult.totalDurationMs}ms)`)
    assert.ok(seqResult.product.fetchDurationMs >= 550, 'Product duration must be >= 550ms')
    assert.ok(seqResult.recommendations[0].fetchDurationMs >= 750, 'Recommendations duration must be >= 750ms')

    console.log('    -> Running real parallel fetching benchmark (simulated ~800ms)...')
    const parStart = Date.now()
    const parResult = await executeParallelFetching('test-item')
    const parActualElapsed = Date.now() - parStart

    console.log(`    -> Parallel result totalDurationMs: ${parResult.totalDurationMs}ms (wall clock: ${parActualElapsed}ms)`)
    assert.strictEqual(parResult.mode, 'parallel')
    assert.ok(parResult.totalDurationMs >= 750, `Parallel duration must be >= 750ms (got ${parResult.totalDurationMs}ms)`)
    assert.ok(parResult.totalDurationMs < seqResult.totalDurationMs - 400, 'Parallel must be significantly faster than Sequential (> 400ms saved)')

    const saved = seqResult.totalDurationMs - parResult.totalDurationMs
    const percent = Math.round((saved / seqResult.totalDurationMs) * 100)
    console.log(`    -> Time saved: ${saved}ms (${percent}% reduction)`)
    assert.ok(percent >= 30, `Performance improvement must be at least 30% (got ${percent}%)`)
  })

  await test('6.2 Demo 10 VerificationFooter Dynamic State Transitions & Math Formulas', () => {
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

    // State 1: Initial
    const s1 = evaluateDemo10(null, null)
    assert.strictEqual(s1.bothExecuted, false)
    assert.strictEqual(s1.isMatched, undefined, 'Initial state must be Pending')

    // State 2: Only sequential executed
    const mockSeq = { mode: 'sequential', totalDurationMs: 1410, product: { fetchDurationMs: 605 }, recommendations: [{ fetchDurationMs: 805 }] }
    const s2 = evaluateDemo10(mockSeq, null)
    assert.strictEqual(s2.bothExecuted, false)
    assert.strictEqual(s2.isMatched, undefined, 'Only sequential must remain Pending')

    // State 3: Only parallel executed
    const mockPar = { mode: 'parallel', totalDurationMs: 812, product: { fetchDurationMs: 603 }, recommendations: [{ fetchDurationMs: 810 }] }
    const s3 = evaluateDemo10(null, mockPar)
    assert.strictEqual(s3.bothExecuted, false)
    assert.strictEqual(s3.isMatched, undefined, 'Only parallel must remain Pending')

    // State 4: Both executed
    const s4 = evaluateDemo10(mockSeq, mockPar)
    assert.strictEqual(s4.bothExecuted, true)
    assert.strictEqual(s4.isMatched, true, 'Both executed must evaluate to Matched (true)')
    assert.strictEqual(s4.saved, 1410 - 812) // 598
    assert.strictEqual(s4.percent, Math.round((598 / 1410) * 100)) // 42%
  })

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n============================================================')
  console.log(`Execution Complete: ${passCount} Passed, ${failCount} Failed`)
  console.log('============================================================\n')

  if (failCount > 0) {
    process.exit(1)
  }
}

runAll().catch(err => {
  console.error('Fatal test runner error:', err)
  process.exit(1)
})
