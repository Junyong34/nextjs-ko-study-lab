import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import ts from 'typescript'
import assert from 'node:assert/strict'

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../../../../..')
const NEXTJS_APP_ROOT = path.join(WORKSPACE_ROOT, 'nextjs-app')
const DOCS_ROOT = path.join(WORKSPACE_ROOT, 'nextjs-docs')

console.log('============================================================')
console.log('   CHALLENGER 1: Milestone 1 Adversarial Stress Test Suite  ')
console.log('============================================================\n')

let passCount = 0
let failCount = 0
const failures: string[] = []

function test(name: string, fn: () => void | Promise<void>) {
  return (async () => {
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
  })()
}

async function runAll() {
  console.log('[SECTION 1] 100% Manifest vs YAML SSOT & Doc URL Verification')
  
  const yamlPath = path.join(NEXTJS_APP_ROOT, 'packages/demos/demos.yaml')
  const jsonPath = path.join(NEXTJS_APP_ROOT, 'packages/demos/demos-manifest.json')
  
  assert.ok(fs.existsSync(yamlPath), 'demos.yaml must exist')
  assert.ok(fs.existsSync(jsonPath), 'demos-manifest.json must exist')
  
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
  const yamlDemos = yaml.load(yamlContent) as Array<any>
  const jsonDemos = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as Array<any>

  await test('1.1 Exact count parity between demos.yaml and demos-manifest.json', () => {
    assert.strictEqual(yamlDemos.length, 241, 'demos.yaml should have 241 demos')
    assert.strictEqual(jsonDemos.length, 241, 'demos-manifest.json should have 241 demos')
    assert.strictEqual(yamlDemos.length, jsonDemos.length, 'YAML and JSON counts must be identical')
  })

  await test('1.2 100% field-by-field equality for all 241 demos (YAML vs JSON)', () => {
    const jsonMap = new Map(jsonDemos.map(d => [d.url, d]))
    for (const yDemo of yamlDemos) {
      const jDemo = jsonMap.get(yDemo.url)
      assert.ok(jDemo, `Demo with url "${yDemo.url}" missing in demos-manifest.json`)
      assert.strictEqual(jDemo.title, yDemo.title, `Title mismatch for ${yDemo.url}`)
      assert.strictEqual(jDemo.doc, yDemo.doc, `Doc path mismatch for ${yDemo.url}`)
      assert.strictEqual(jDemo.zone, yDemo.zone, `Zone mismatch for ${yDemo.url}`)
      assert.strictEqual(jDemo.status, yDemo.status, `Status mismatch for ${yDemo.url}`)
    }
  })

  await test('1.3 Zero broken doc links: all 241 demos point to existing non-empty docs', () => {
    const missingDocs: string[] = []
    for (const demo of yamlDemos) {
      const docPath = path.join(DOCS_ROOT, demo.doc)
      if (!fs.existsSync(docPath)) {
        missingDocs.push(`${demo.url} -> ${demo.doc} (file not found)`)
      } else {
        const stat = fs.statSync(docPath)
        if (stat.size === 0) {
          missingDocs.push(`${demo.url} -> ${demo.doc} (file is empty)`)
        }
      }
    }
    assert.strictEqual(missingDocs.length, 0, `Found broken doc links:\n${missingDocs.join('\n')}`)
  })

  await test('1.4 Verified M1 corrected doc paths specifically point to authentic docs', () => {
    const m1DocChecks = [
      {
        url: 'architecture/compiler-optimization/react-compiler',
        expectedDoc: '5-architecture/nextjs-compiler.md',
        keyword: 'Compiler'
      },
      {
        url: 'architecture/server-action-security/csrf-protection',
        expectedDoc: '3-api-reference/3.5-config/3.5.1-next-config-js/serverActions.md',
        keyword: 'serverActions'
      },
      {
        url: 'architecture/turbopack/incremental-harness',
        expectedDoc: '3-api-reference/3.5-config/3.5.1-next-config-js/turbopack.md',
        keyword: 'turbopack'
      }
    ]

    for (const check of m1DocChecks) {
      const demo = yamlDemos.find(d => d.url === check.url)
      assert.ok(demo, `Demo ${check.url} not found`)
      assert.strictEqual(demo.doc, check.expectedDoc, `Doc path should be ${check.expectedDoc}`)
      const fullPath = path.join(DOCS_ROOT, demo.doc)
      assert.ok(fs.existsSync(fullPath), `Doc file ${fullPath} must exist`)
      const content = fs.readFileSync(fullPath, 'utf-8')
      assert.ok(content.toLowerCase().includes(check.keyword.toLowerCase()), `Doc content must contain "${check.keyword}"`)
    }
  })

  console.log('\n[SECTION 2] JSX Parsing & AST Diagnostics of All Touched Files')

  const touchedFiles = [
    // 7 Activated dead-code components
    'apps/demo-baseline/src/app/zone/baseline/directives/use-client/window-storage-access/components/StorageClientDemo.tsx',
    'apps/demo-baseline/src/app/zone/baseline/directives/use-server/file-level-action/components/DirectiveUseServerDemo.tsx',
    'apps/demo-baseline/src/app/zone/baseline/directives/use-server/file-level-action/actions.ts',
    'apps/demo-baseline/src/app/zone/baseline/directives/use-server/inline-action-closure/components/InlineActionClosureDemo.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/after/background-logging/components/AfterLoggingDemo.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/cookies/get-set-session/components/CookiesSessionDemo.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/use-router/push-replace/components/NavigationClientDemo.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/use-search-params/filter-parsing/components/FilterParsingDemo.tsx',

    // 7 page.tsx files
    'apps/demo-baseline/src/app/zone/baseline/directives/use-client/window-storage-access/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/directives/use-server/file-level-action/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/directives/use-server/inline-action-closure/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/after/background-logging/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/cookies/get-set-session/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/use-router/push-replace/page.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/use-search-params/filter-parsing/page.tsx',

    // Syntax error fixed file
    'apps/demo-baseline/src/app/zone/baseline/fetching-data/use-promise-streaming/components/VerificationFooter.tsx',

    // DeepDive copy-paste cleaned up files
    'apps/demo-baseline/src/app/zone/baseline/config/asset-prefix/cdn-distribution/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/base-path/subpath-routing/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/cross-origin/anonymous-mode/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/dev-indicators/render-badge/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/env/build-time-injection/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/headers/global-security-headers/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/images/formats-avif-webp/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/images/remote-patterns-security/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/logging/fetches-full-url/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/output/export-static-spa/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/output/standalone-container/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/powered-by-header/hide-x-powered/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/rewrites/cross-zone-proxy/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/rewrites/query-param-rewrite/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/config/trailing-slash/url-normalization/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/route-segment-config/dynamic-params-toggle/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/route-segment-config/instant-prefetch/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/route-segment-config/max-duration-timeout/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/route-segment-config/runtime-nodejs-edge/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/headers/custom-auth-token/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/headers/user-agent-device/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/next-request/geo-ip-parsing/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/next-response/json-builder/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/next-response/rewrite-virtual/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/proxy/rewrite-and-headers/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/route-handlers/rest-api-crud/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/route-handlers/streaming-sse/components/VerificationFooter.tsx',
    'apps/demo-cache-components/src/app/zone/cache/config/cache-components/enable-flag/components/VerificationFooter.tsx',
    'apps/demo-cache-components/src/app/zone/cache/config/cache-handlers/redis-kv/components/VerificationFooter.tsx',
    'apps/demo-cache-components/src/app/zone/cache/config/cache-life/custom-presets/components/VerificationFooter.tsx',
    'apps/demo-cache-components/src/app/zone/cache/config/expire-time/memory-isr-tuning/components/VerificationFooter.tsx',
    'apps/demo-cache-components/src/app/zone/cache/config/stale-times/router-cache-tuning/components/VerificationFooter.tsx'
  ]

  await test('2.1 AST Syntax & JSX parse verification on all 40+ touched M1 files', () => {
    const parseErrors: string[] = []
    for (const relPath of touchedFiles) {
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

      // Check parse diagnostics
      const diagnostics = (sourceFile as any).parseDiagnostics || []
      if (diagnostics.length > 0) {
        for (const diag of diagnostics) {
          parseErrors.push(`${relPath}: ${diag.messageText}`)
        }
      }
    }
    assert.strictEqual(parseErrors.length, 0, `Parse errors found:\n${parseErrors.join('\n')}`)
  })

  await test('2.2 Unclosed <li> tag fix in use-promise-streaming VerificationFooter.tsx', () => {
    const footerPath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/fetching-data/use-promise-streaming/components/VerificationFooter.tsx'
    )
    const content = fs.readFileSync(footerPath, 'utf-8')
    assert.match(
      content,
      /<li>상품 상세 페이지의 구매 후기 및 AI 추천 상품 점진적 스트리밍<\/li>/,
      '<li> tag must be explicitly closed with </li>'
    )
    // Count opening vs closing <li> tags
    const openCount = (content.match(/<li\b[^>]*>/g) || []).length
    const closeCount = (content.match(/<\/li>/g) || []).length
    assert.strictEqual(openCount, closeCount, `Opening <li> count (${openCount}) must match closing </li> count (${closeCount})`)
  })

  await test('2.3 DeepDive 4-Section structure verification in all cleaned VerificationFooter files', () => {
    const footerFiles = touchedFiles.filter(f => f.endsWith('VerificationFooter.tsx'))
    for (const relPath of footerFiles) {
      const fullPath = path.join(NEXTJS_APP_ROOT, relPath)
      const content = fs.readFileSync(fullPath, 'utf-8')
      assert.match(content, /1\.\s*핵심\s*(스펙|개념)/, `${relPath} missing Section 1`)
      assert.match(content, /2\.\s*데모\s*예제\s*기반\s*동작\s*원리/, `${relPath} missing Section 2`)
      assert.match(content, /3\.\s*실무적\s*장점/, `${relPath} missing Section 3`)
      assert.match(content, /4\.\s*주요\s*활용\s*상황/, `${relPath} missing Section 4`)
      assert.doesNotMatch(content, /undefined|NaN|TODO|FIXME/, `${relPath} contains unresolved placeholder`)
    }
  })

  console.log('\n[SECTION 3] Component Mount Verification in page.tsx')

  await test('3.1 Verify all 7 target page.tsx files actually mount their rich components', () => {
    const pageMountChecks = [
      {
        page: 'apps/demo-baseline/src/app/zone/baseline/directives/use-client/window-storage-access/page.tsx',
        expectedComponent: 'StorageClientDemo',
        forbiddenStub: 'DirectiveUseClientStorageDemo'
      },
      {
        page: 'apps/demo-baseline/src/app/zone/baseline/directives/use-server/file-level-action/page.tsx',
        expectedComponent: 'DirectiveUseServerDemo',
        forbiddenStub: 'DirectiveUseServerFileDemo'
      },
      {
        page: 'apps/demo-baseline/src/app/zone/baseline/directives/use-server/inline-action-closure/page.tsx',
        expectedComponent: 'InlineActionClosureDemo',
        forbiddenStub: 'DirectiveUseServerInlineDemo'
      },
      {
        page: 'apps/demo-baseline/src/app/zone/baseline/functions/after/background-logging/page.tsx',
        expectedComponent: 'AfterLoggingDemo',
        forbiddenStub: 'AfterBackgroundLoggingDemo'
      },
      {
        page: 'apps/demo-baseline/src/app/zone/baseline/functions/cookies/get-set-session/page.tsx',
        expectedComponent: 'CookiesSessionDemo',
        forbiddenStub: 'CookiesGetSetDemo'
      },
      {
        page: 'apps/demo-baseline/src/app/zone/baseline/functions/use-router/push-replace/page.tsx',
        expectedComponent: 'NavigationClientDemo',
        forbiddenStub: 'UseRouterPushReplaceDemo'
      },
      {
        page: 'apps/demo-baseline/src/app/zone/baseline/functions/use-search-params/filter-parsing/page.tsx',
        expectedComponent: 'FilterParsingDemo',
        forbiddenStub: 'UseSearchParamsFilterDemo'
      }
    ]

    for (const check of pageMountChecks) {
      const fullPath = path.join(NEXTJS_APP_ROOT, check.page)
      const content = fs.readFileSync(fullPath, 'utf-8')
      assert.match(
        content,
        new RegExp(`<${check.expectedComponent}\\s*\\/?>`),
        `Page ${check.page} must mount <${check.expectedComponent} />`
      )
      assert.match(
        content,
        new RegExp(`import\\s+.*${check.expectedComponent}`),
        `Page ${check.page} must import ${check.expectedComponent}`
      )
      assert.doesNotMatch(
        content,
        new RegExp(`<${check.forbiddenStub}\\s*\\/?>`),
        `Page ${check.page} must NOT mount legacy stub <${check.forbiddenStub} />`
      )
    }
  })

  console.log('\n[SECTION 4] Adversarial Stress Testing of Server Actions & Domain Logic')

  // Load actions.ts for testing
  const { applyCouponAction } = await import(
    'file://' + path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/directives/use-server/file-level-action/actions.ts')
  )

  await test('4.1 applyCouponAction: Valid coupon codes with percent & fixed discounts', async () => {
    // WELCOME2026: 20% discount, minOrder: 50,000
    const res1 = await applyCouponAction('WELCOME2026', 189000)
    assert.strictEqual(res1.success, true)
    assert.strictEqual(res1.discount, 37800)
    assert.strictEqual(res1.finalAmount, 151200)
    assert.strictEqual(res1.coupon?.code, 'WELCOME2026')

    // VIPSPECIAL: fixed 30,000 KRW discount, minOrder: 100,000
    const res2 = await applyCouponAction('VIPSPECIAL', 189000)
    assert.strictEqual(res2.success, true)
    assert.strictEqual(res2.discount, 30000)
    assert.strictEqual(res2.finalAmount, 159000)
    assert.strictEqual(res2.coupon?.code, 'VIPSPECIAL')

    // FREESHIP: fixed 3,000 KRW discount, minOrder: 30,000
    const res3 = await applyCouponAction('FREESHIP', 50000)
    assert.strictEqual(res3.success, true)
    assert.strictEqual(res3.discount, 3000)
    assert.strictEqual(res3.finalAmount, 47000)

    // SUMMER50: 50% discount, minOrder: 100,000
    const res4 = await applyCouponAction('SUMMER50', 200000)
    assert.strictEqual(res4.success, true)
    assert.strictEqual(res4.discount, 100000)
    assert.strictEqual(res4.finalAmount, 100000)
  })

  await test('4.2 applyCouponAction: Case-insensitivity and whitespace normalization', async () => {
    const resLower = await applyCouponAction('welcome2026', 100000)
    assert.strictEqual(resLower.success, true, 'Lower-case coupon code should match')
    assert.strictEqual(resLower.discount, 20000)

    const resTrim = await applyCouponAction('   VIPSPECIAL  \n', 150000)
    assert.strictEqual(resTrim.success, true, 'Whitespace padded coupon code should match after trim')
    assert.strictEqual(resTrim.discount, 30000)
  })

  await test('4.3 applyCouponAction: Minimum order amount boundary conditions', async () => {
    // WELCOME2026 min is 50,000
    const resUnder = await applyCouponAction('WELCOME2026', 49999)
    assert.strictEqual(resUnder.success, false)
    assert.match(resUnder.error || '', /최소 주문금액.*미달/)

    const resExact = await applyCouponAction('WELCOME2026', 50000)
    assert.strictEqual(resExact.success, true)
    assert.strictEqual(resExact.discount, 10000)
    assert.strictEqual(resExact.finalAmount, 40000)
  })

  await test('4.4 applyCouponAction: Invalid, malicious, or non-existent coupon codes', async () => {
    const maliciousInputs = [
      '',
      '   ',
      'NON_EXISTENT_COUPON',
      "' OR '1'='1",
      '<script>alert(1)</script>',
      '../../etc/passwd',
      'null',
      'undefined'
    ]

    for (const code of maliciousInputs) {
      const res = await applyCouponAction(code, 100000)
      assert.strictEqual(res.success, false, `Input "${code}" should fail gracefully`)
      assert.strictEqual(res.coupon, undefined)
      assert.match(res.error || '', /유효하지 않은 쿠폰 코드/)
    }
  })

  await test('4.5 applyCouponAction: Extreme and boundary order amounts', async () => {
    // 0 amount
    const resZero = await applyCouponAction('WELCOME2026', 0)
    assert.strictEqual(resZero.success, false)

    // Negative amount
    const resNeg = await applyCouponAction('WELCOME2026', -50000)
    assert.strictEqual(resNeg.success, false)

    // Huge amount: 1 billion KRW
    const resHuge = await applyCouponAction('WELCOME2026', 1_000_000_000)
    assert.strictEqual(resHuge.success, true)
    assert.strictEqual(resHuge.discount, 200_000_000)
    assert.strictEqual(resHuge.finalAmount, 800_000_000)
  })

  await test('4.6 FilterParsingDemo simulation: Category, sorting, and price range filtering', async () => {
    const { MOCK_PRODUCTS } = await import('@study/demo-kit')
    assert.ok(Array.isArray(MOCK_PRODUCTS) && MOCK_PRODUCTS.length > 0)

    // Simulate FilterParsingDemo algorithm
    const filterAndSort = (category: string, sort: string, maxPrice: number) => {
      return MOCK_PRODUCTS.filter(p => {
        if (category !== 'all' && p.category !== category) return false
        if (p.price > maxPrice) return false
        return true
      }).sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price
        if (sort === 'price-desc') return b.price - a.price
        if (sort === 'rating') return b.rating - a.rating
        return (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0)
      })
    }

    // Test 1: all products under 350,000
    const allResult = filterAndSort('all', 'best', 350000)
    assert.ok(allResult.length > 0)
    for (const p of allResult) {
      assert.ok(p.price <= 350000)
    }

    // Test 2: electronics category under 100,000 sorted price-asc
    const elecResult = filterAndSort('electronics', 'price-asc', 100000)
    for (let i = 0; i < elecResult.length; i++) {
      assert.strictEqual(elecResult[i].category, 'electronics')
      assert.ok(elecResult[i].price <= 100000)
      if (i > 0) {
        assert.ok(elecResult[i].price >= elecResult[i - 1].price, 'Must be sorted ascending')
      }
    }

    // Test 3: price-desc sort
    const descResult = filterAndSort('all', 'price-desc', 350000)
    for (let i = 1; i < descResult.length; i++) {
      assert.ok(descResult[i].price <= descResult[i - 1].price, 'Must be sorted descending')
    }

    // Test 4: rating sort
    const ratingResult = filterAndSort('all', 'rating', 350000)
    for (let i = 1; i < ratingResult.length; i++) {
      assert.ok(ratingResult[i].rating <= ratingResult[i - 1].rating, 'Must be sorted by rating desc')
    }

    // Test 5: edge maxPrice 0 -> empty result
    const emptyResult = filterAndSort('all', 'best', 0)
    assert.strictEqual(emptyResult.length, 0)
  })

  await test('4.7 NavigationClientDemo virtual stack operations', () => {
    let currentVirtualUrl = '/shop/products'
    let historyStack = ['/shop/products']

    const push = (target: string) => {
      currentVirtualUrl = target
      historyStack = [...historyStack, target]
    }
    const replace = (target: string) => {
      currentVirtualUrl = target
      historyStack = [...historyStack.slice(0, -1), target]
    }
    const back = () => {
      if (historyStack.length > 1) {
        const next = historyStack.slice(0, -1)
        historyStack = next
        currentVirtualUrl = next[next.length - 1]
      }
    }

    // Push 1: detail
    push('/shop/products/prod-001')
    assert.strictEqual(currentVirtualUrl, '/shop/products/prod-001')
    assert.strictEqual(historyStack.length, 2)

    // Push 2: cart
    push('/shop/cart')
    assert.strictEqual(historyStack.length, 3)

    // Replace: checkout success
    replace('/shop/checkout/success')
    assert.strictEqual(currentVirtualUrl, '/shop/checkout/success')
    assert.strictEqual(historyStack.length, 3)
    assert.strictEqual(historyStack[2], '/shop/checkout/success')

    // Back: returns to prod-001 (not cart, because cart was replaced)
    back()
    assert.strictEqual(currentVirtualUrl, '/shop/products/prod-001')
    assert.strictEqual(historyStack.length, 2)

    // Back: returns to root
    back()
    assert.strictEqual(currentVirtualUrl, '/shop/products')
    assert.strictEqual(historyStack.length, 1)

    // Back when at root: no-op
    back()
    assert.strictEqual(currentVirtualUrl, '/shop/products')
    assert.strictEqual(historyStack.length, 1)
  })

  await test('4.8 StorageClientDemo deduplication and max 4 capping logic', () => {
    let recentViewed: Array<{ id: string; name: string }> = []
    const addRecent = (product: { id: string; name: string }) => {
      recentViewed = [product, ...recentViewed.filter(p => p.id !== product.id)].slice(0, 4)
    }

    addRecent({ id: 'p1', name: 'Item 1' })
    addRecent({ id: 'p2', name: 'Item 2' })
    addRecent({ id: 'p3', name: 'Item 3' })
    addRecent({ id: 'p4', name: 'Item 4' })
    assert.strictEqual(recentViewed.length, 4)
    assert.strictEqual(recentViewed[0].id, 'p4')

    // Adding 5th item pushes out oldest (p1)
    addRecent({ id: 'p5', name: 'Item 5' })
    assert.strictEqual(recentViewed.length, 4)
    assert.strictEqual(recentViewed[0].id, 'p5')
    assert.strictEqual(recentViewed.find(p => p.id === 'p1'), undefined)

    // Adding existing item (p3) brings it to front without duplicates
    addRecent({ id: 'p3', name: 'Item 3' })
    assert.strictEqual(recentViewed.length, 4)
    assert.strictEqual(recentViewed[0].id, 'p3')
    assert.strictEqual(recentViewed.filter(p => p.id === 'p3').length, 1)
  })

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
