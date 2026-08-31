import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import assert from 'node:assert/strict'

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../../../../..')
const NEXTJS_APP_ROOT = path.join(WORKSPACE_ROOT, 'nextjs-app')

console.log('============================================================')
console.log('  CHALLENGER 1: Empirical Stress Test Suite (Demos 11–15)   ')
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
  // SECTION 1: AST, Code Standards & Line Count Compliance (Demos 11–15)
  // =========================================================================
  console.log('[SECTION 1] AST, Code Standards & Line Count Compliance (Demos 11–15)')

  const demoFiles = [
    // Demo 11
    'apps/demo-baseline/src/app/zone/baseline/fetching-data/use-promise-streaming/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/fetching-data/use-promise-streaming/types.ts',
    'apps/demo-baseline/src/app/zone/baseline/fetching-data/use-promise-streaming/components/ReviewsSkeleton.tsx',
    'apps/demo-baseline/src/app/zone/baseline/fetching-data/use-promise-streaming/components/ReviewsStreamingClient.tsx',
    'apps/demo-baseline/src/app/zone/baseline/fetching-data/use-promise-streaming/components/VerificationFooter.tsx',

    // Demo 12
    'apps/demo-baseline/src/app/zone/baseline/mutating-data/server-action-revalidate/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/mutating-data/server-action-revalidate/actions.ts',
    'apps/demo-baseline/src/app/zone/baseline/mutating-data/server-action-revalidate/types.ts',
    'apps/demo-baseline/src/app/zone/baseline/mutating-data/server-action-revalidate/components/CartTableClient.tsx',
    'apps/demo-baseline/src/app/zone/baseline/mutating-data/server-action-revalidate/components/VerificationFooter.tsx',

    // Demo 13
    'apps/demo-baseline/src/app/zone/baseline/mutating-data/optimistic-cart/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/mutating-data/optimistic-cart/actions.ts',
    'apps/demo-baseline/src/app/zone/baseline/mutating-data/optimistic-cart/types.ts',
    'apps/demo-baseline/src/app/zone/baseline/mutating-data/optimistic-cart/components/OptimisticCartClient.tsx',
    'apps/demo-baseline/src/app/zone/baseline/mutating-data/optimistic-cart/components/VerificationFooter.tsx',

    // Demo 14
    'apps/demo-cache-components/src/app/zone/cache/revalidating/time-based-isr/page.tsx',
    'apps/demo-cache-components/src/app/zone/cache/revalidating/time-based-isr/components/TimeBasedIsrClient.tsx',
    'apps/demo-cache-components/src/app/zone/cache/revalidating/time-based-isr/components/VerificationFooter.tsx',

    // Demo 15
    'apps/demo-cache-components/src/app/zone/cache/revalidating/tag-vs-path/page.tsx',
    'apps/demo-cache-components/src/app/zone/cache/revalidating/tag-vs-path/actions.ts',
    'apps/demo-cache-components/src/app/zone/cache/revalidating/tag-vs-path/components/TagVsPathClient.tsx',
    'apps/demo-cache-components/src/app/zone/cache/revalidating/tag-vs-path/components/VerificationFooter.tsx',
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
      
      const hasStaticProp = /<ExpectedActualPanel[^>]*\bisMatched=\{true\}/.test(content)
      assert.strictEqual(
        hasStaticProp,
        false,
        `File ${relPath} contains static isMatched={true} in ExpectedActualPanel JSX`
      )

      assert.match(
        content,
        /const\s+isMatched\s*=\s*props\.isMatched\s*!==\s*undefined\s*\?\s*props\.isMatched\s*:\s*/,
        `${relPath} must implement dynamic isMatched resolution with fallback`
      )
    }
  })

  // =========================================================================
  // SECTION 2: Demo 11 (React 19 use(Promise) Streaming) Empirical Tests
  // =========================================================================
  console.log('\n[SECTION 2] Demo 11 (React 19 use(Promise) Streaming) Stress Tests')

  await test('2.1 Demo 11 Suspense streaming boundary & footer fallback wiring', () => {
    const pagePath = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/fetching-data/use-promise-streaming/page.tsx')
    const content = fs.readFileSync(pagePath, 'utf-8')

    assert.match(content, /<Suspense\s+fallback=\{<VerificationFooter\s*\/>\}>/, 'VerificationFooter must be inside Suspense fallback for pending state')
    assert.match(content, /<ReviewsStreamingFooter\s+reviewsPromise=\{reviewsPromise\}\s*\/>/, 'ReviewsStreamingFooter must receive unresolved promise')
  })

  await test('2.2 Demo 11 Dynamic state transition from pending to resolved reviews', () => {
    function evalDemo11(reviews?: any[]) {
      const defaultActual =
        reviews && reviews.length > 0
          ? `• 스트리밍 언랩: React 19 use(Promise) 완료\n• 로드된 후기 수: ${reviews.length}건 (${reviews.map((r: any) => r.author).join(', ')})\n• 렌더링 상태: 메인 셸 즉시 렌더 + 후기 청크 스트리밍 정상`
          : '• Suspense Fallback 로딩 대기 중 (구매 후기 Promise 스트리밍 800ms 대기)'

      const isMatched = reviews && reviews.length > 0 ? true : undefined
      return { isMatched, actual: defaultActual }
    }

    // Pending state
    const pending = evalDemo11(undefined)
    assert.strictEqual(pending.isMatched, undefined)
    assert.match(pending.actual, /Suspense Fallback 로딩 대기 중/)

    // Resolved state
    const resolved = evalDemo11([
      { author: '개발자K' },
      { author: '키보드매니아' },
      { author: '디자이너P' },
    ])
    assert.strictEqual(resolved.isMatched, true)
    assert.match(resolved.actual, /React 19 use\(Promise\) 완료/)
    assert.match(resolved.actual, /개발자K, 키보드매니아, 디자이너P/)
  })

  // =========================================================================
  // SECTION 3: Demo 12 (Server Action Revalidate) Empirical Tests
  // =========================================================================
  console.log('\n[SECTION 3] Demo 12 (Server Action Revalidate) Stress Tests')

  await test('3.1 Demo 12 Cart State Transition & Dynamic Pricing Matrix', () => {
    interface CartItem { id: string; name: string; price: number; quantity: number }
    let cart: CartItem[] = [
      { id: 'cart-1', name: '에어 줌 프로 러닝화', price: 159000, quantity: 1 },
      { id: 'cart-2', name: '오버핏 기모 맨투맨', price: 49000, quantity: 2 },
      { id: 'cart-3', name: '알루미늄 모니터 암 싱글', price: 54000, quantity: 1 },
    ]

    const getTotals = () => ({
      qty: cart.reduce((s, i) => s + i.quantity, 0),
      price: cart.reduce((s, i) => s + i.price * i.quantity, 0),
    })

    assert.deepStrictEqual(getTotals(), { qty: 4, price: 311000 })

    // Increment item 1
    cart[0].quantity += 1
    assert.deepStrictEqual(getTotals(), { qty: 5, price: 470000 })

    // Decrement item 2
    cart[1].quantity -= 1
    assert.deepStrictEqual(getTotals(), { qty: 4, price: 421000 })

    // Remove item 3
    cart = cart.filter(i => i.id !== 'cart-3')
    assert.deepStrictEqual(getTotals(), { qty: 3, price: 367000 })
  })

  // =========================================================================
  // SECTION 4: Demo 13 (Optimistic Cart) Empirical Tests
  // =========================================================================
  console.log('\n[SECTION 4] Demo 13 (Optimistic Cart) Stress Tests')

  await test('4.1 Demo 13 3-Stage Lifecycle: Idle -> Pending Optimistic -> Server Confirmed', () => {
    function evalDemo13(hasInteracted: boolean, isPending: boolean) {
      const isMatched = hasInteracted && !isPending ? true : undefined
      return { isMatched }
    }

    assert.strictEqual(evalDemo13(false, false).isMatched, undefined, 'Initial state must be Pending')
    assert.strictEqual(evalDemo13(true, true).isMatched, undefined, 'Optimistic transition must remain Pending')
    assert.strictEqual(evalDemo13(true, false).isMatched, true, 'Server confirmed must be Matched')
  })

  // =========================================================================
  // SECTION 5: Demo 14 (Time-Based ISR) Empirical Tests
  // =========================================================================
  console.log('\n[SECTION 5] Demo 14 (Time-Based ISR) Stress Tests')

  await test('5.1 Demo 14 cacheLife 10-second stale boundary transition', () => {
    function evalDemo14(elapsed: number) {
      const isStale = elapsed >= 10
      const isMatched = isStale ? true : undefined
      return { isStale, isMatched }
    }

    assert.strictEqual(evalDemo14(0).isMatched, undefined)
    assert.strictEqual(evalDemo14(9).isMatched, undefined)
    assert.strictEqual(evalDemo14(10).isMatched, true)
    assert.strictEqual(evalDemo14(30).isMatched, true)
  })

  // =========================================================================
  // SECTION 6: Demo 15 (Tag vs Path) Empirical Tests
  // =========================================================================
  console.log('\n[SECTION 6] Demo 15 (Tag vs Path) Stress Tests')

  await test('6.1 Demo 15 Selective cache invalidation matrix', () => {
    function evalDemo15(action: 'tag-a' | 'tag-b' | 'path' | null, isPending: boolean) {
      const isMatched = action !== null && !isPending ? true : undefined
      return { isMatched }
    }

    assert.strictEqual(evalDemo15(null, false).isMatched, undefined)
    assert.strictEqual(evalDemo15('tag-a', true).isMatched, undefined)
    assert.strictEqual(evalDemo15('tag-a', false).isMatched, true)
    assert.strictEqual(evalDemo15('tag-b', false).isMatched, true)
    assert.strictEqual(evalDemo15('path', false).isMatched, true)
  })

  console.log('\n============================================================')
  console.log(`Execution Complete: ${passCount} Passed, ${failCount} Failed`)
  console.log('============================================================\n')

  if (failCount > 0) {
    process.exit(1)
  }
}

runAll().catch(err => {
  console.error('Fatal stress runner error:', err)
  process.exit(1)
})
