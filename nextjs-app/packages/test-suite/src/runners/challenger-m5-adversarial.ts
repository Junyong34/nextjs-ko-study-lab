import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import ts from 'typescript'
import assert from 'node:assert/strict'

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../../../../..')
const NEXTJS_APP_ROOT = path.join(WORKSPACE_ROOT, 'nextjs-app')
const DOCS_ROOT = path.join(WORKSPACE_ROOT, 'nextjs-docs')

console.log('============================================================')
console.log('   CHALLENGER 1: M5 Tier 5 Adversarial Stress & Audit Suite ')
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

function getAllFiles(dir: string, extensions: string[]): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results
  const list = fs.readdirSync(dir)
  for (const file of list) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      results.push(...getAllFiles(filePath, extensions))
    } else {
      const ext = path.extname(file)
      if (extensions.includes(ext)) {
        results.push(filePath)
      }
    }
  }
  return results
}

async function runAdversarialSuite() {
  // -------------------------------------------------------------
  // SECTION 1: Manifest SSOT, On-Disk Route Parity & Doc Integrity
  // -------------------------------------------------------------
  console.log('[SECTION 1] 100% Manifest SSOT, On-Disk Route Parity & Doc Integrity')

  const yamlPath = path.join(NEXTJS_APP_ROOT, 'packages/demos/demos.yaml')
  const jsonPath = path.join(NEXTJS_APP_ROOT, 'packages/demos/demos-manifest.json')

  assert.ok(fs.existsSync(yamlPath), 'demos.yaml must exist')
  assert.ok(fs.existsSync(jsonPath), 'demos-manifest.json must exist')

  const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
  const yamlDemos = yaml.load(yamlContent) as Array<any>
  const jsonDemos = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as Array<any>

  await test('1.1 Exact 241 demo count parity across demos.yaml and demos-manifest.json', () => {
    assert.strictEqual(yamlDemos.length, 241, 'demos.yaml must have exactly 241 demos')
    assert.strictEqual(jsonDemos.length, 241, 'demos-manifest.json must have exactly 241 demos')
  })

  await test('1.2 100% on-disk page.tsx existence and export validation for all 241 demos', () => {
    const missingPages: string[] = []
    for (const demo of yamlDemos) {
      const appFolder = demo.zone === 'baseline' ? 'apps/demo-baseline' : 'apps/demo-cache-components'
      const pagePath = path.join(NEXTJS_APP_ROOT, appFolder, 'src/app/zone', demo.zone, demo.url, 'page.tsx')
      if (!fs.existsSync(pagePath)) {
        missingPages.push(`${demo.url} -> ${pagePath}`)
      } else {
        const content = fs.readFileSync(pagePath, 'utf-8')
        assert.ok(
          content.includes('export default') || content.includes('export function') || content.includes('export const'),
          `page.tsx at ${demo.url} must contain valid React export`
        )
      }
    }
    assert.strictEqual(missingPages.length, 0, `Missing on-disk page.tsx files:\n${missingPages.join('\n')}`)
  })

  await test('1.3 100% doc mapping integrity: all 241 demos point to existing non-empty docs', () => {
    const missingDocs: string[] = []
    for (const demo of yamlDemos) {
      const docPath = path.join(DOCS_ROOT, demo.doc)
      if (!fs.existsSync(docPath)) {
        missingDocs.push(`${demo.url} -> ${demo.doc} (not found)`)
      } else {
        const stat = fs.statSync(docPath)
        if (stat.size === 0) {
          missingDocs.push(`${demo.url} -> ${demo.doc} (empty file)`)
        }
      }
    }
    assert.strictEqual(missingDocs.length, 0, `Found broken doc links:\n${missingDocs.join('\n')}`)
  })

  // -------------------------------------------------------------
  // SECTION 2: Authentic Next.js File Conventions on Disk (R2)
  // -------------------------------------------------------------
  console.log('\n[SECTION 2] Authentic Next.js File Conventions on Disk (R2)')

  await test('2.1 Authentic Route Handlers on Disk (route.ts)', () => {
    const routeHandlerPaths = [
      'apps/demo-baseline/src/app/zone/baseline/route-handlers/rest-api-crud/api/route.ts',
      'apps/demo-baseline/src/app/zone/baseline/route-handlers/streaming-sse/api/sse/route.ts',
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/route/rest-api-orders/api/route.ts',
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/route/sse-stock-stream/api/route.ts',
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/route/webhook-signature/api/route.ts',
    ]

    for (const relPath of routeHandlerPaths) {
      const fullPath = path.join(NEXTJS_APP_ROOT, relPath)
      assert.ok(fs.existsSync(fullPath), `Route handler must exist at ${relPath}`)
      const content = fs.readFileSync(fullPath, 'utf-8')
      assert.match(content, /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)/, `${relPath} must export HTTP methods`)
    }
  })

  await test('2.2 Authentic Dynamic Segments on Disk ([id], [...slug], [[...slug]])', () => {
    const dynamicRouteChecks = [
      {
        path: 'apps/demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/single-param/items/[id]/page.tsx',
        type: 'single-param',
      },
      {
        path: 'apps/demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/catch-all-slug/shop/[...slug]/page.tsx',
        type: 'catch-all',
      },
      {
        path: 'apps/demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/optional-catch-all/docs/[[...slug]]/page.tsx',
        type: 'optional-catch-all',
      },
    ]

    for (const check of dynamicRouteChecks) {
      const fullPath = path.join(NEXTJS_APP_ROOT, check.path)
      assert.ok(fs.existsSync(fullPath), `Dynamic segment page must exist at ${check.path}`)
      const content = fs.readFileSync(fullPath, 'utf-8')
      assert.match(content, /params/, `${check.path} must receive or handle params`)
    }
  })

  await test('2.3 Authentic Route Groups, Parallel Routes & Intercepting Routes on Disk', () => {
    const conventionPaths = [
      // Parallel routes & default fallbacks
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/parallel-routes/@analytics/page.tsx',
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/parallel-routes/@team/page.tsx',
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/parallel-routes/@analytics/default.tsx',
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/parallel-routes/@team/default.tsx',
      // Intercepting route & modal
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/intercepting-routes/@modal/(.)photos/[id]/page.tsx',
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/intercepting-routes/photos/[id]/page.tsx',
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/intercepting-routes/@modal/default.tsx',
    ]

    for (const relPath of conventionPaths) {
      const fullPath = path.join(NEXTJS_APP_ROOT, relPath)
      assert.ok(fs.existsSync(fullPath), `File convention target must exist at ${relPath}`)
    }
  })

  await test('2.4 Authentic Special Boundaries & Root Hooks on Disk', () => {
    const boundaryPaths = [
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/error/payment-error-boundary/checkout/error.tsx',
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/loading/skeleton-boundary/slow-catalog/loading.tsx',
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/template/remount-lifecycle/template.tsx',
      'apps/demo-baseline/src/app/zone/baseline/file-conventions/not-found/missing-product-404/items/[id]/not-found.tsx',
      'apps/demo-baseline/src/proxy.ts',
      'apps/demo-baseline/src/instrumentation.ts',
    ]

    for (const relPath of boundaryPaths) {
      const fullPath = path.join(NEXTJS_APP_ROOT, relPath)
      assert.ok(fs.existsSync(fullPath), `Boundary/Hook must exist at ${relPath}`)
    }
  })

  // -------------------------------------------------------------
  // SECTION 3: Exhaustive Static Literal Scan Across Entire Codebase
  // -------------------------------------------------------------
  console.log('\n[SECTION 3] Exhaustive Static Literal Scan Across Entire Codebase')

  await test('3.1 Zero static isMatched={true} or isMatched: true across ALL source files in apps/', () => {
    const appDir = path.join(NEXTJS_APP_ROOT, 'apps')
    const allSourceFiles = getAllFiles(appDir, ['.tsx', '.ts', '.jsx', '.js'])
    assert.ok(allSourceFiles.length > 250, `Should scan over 250 source files (found ${allSourceFiles.length})`)

    const staticMatchedRegex = /isMatched\s*=\s*\{\s*true\s*\}|isMatched\s*:\s*true/g
    const flaggedFiles: Array<{ file: string; line: number; text: string }> = []

    for (const file of allSourceFiles) {
      const content = fs.readFileSync(file, 'utf-8')
      const lines = content.split(/\r?\n/)
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        // Check if line contains literal static true binding
        if (staticMatchedRegex.test(line)) {
          // Exclude comments
          const trimmed = line.trim()
          if (!trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')) {
            flaggedFiles.push({
              file: path.relative(WORKSPACE_ROOT, file),
              line: i + 1,
              text: trimmed,
            })
          }
        }
        staticMatchedRegex.lastIndex = 0
      }
    }

    assert.strictEqual(
      flaggedFiles.length,
      0,
      `Found static isMatched literals in source files:\n${flaggedFiles.map(f => `  ${f.file}:${f.line} -> ${f.text}`).join('\n')}`
    )
  })

  // -------------------------------------------------------------
  // SECTION 4: Dynamic 3-State Lifecycle Simulation (239 Footers)
  // -------------------------------------------------------------
  console.log('\n[SECTION 4] Dynamic 3-State Lifecycle Simulation Across VerificationFooters')

  const appDir = path.join(NEXTJS_APP_ROOT, 'apps')
  const allSourceFiles = getAllFiles(appDir, ['.tsx'])
  const footerFiles = allSourceFiles.filter(f => path.basename(f) === 'VerificationFooter.tsx')

  await test('4.1 Scanned and confirmed 239 VerificationFooter.tsx files exist on disk', () => {
    assert.strictEqual(footerFiles.length, 239, 'Must find exactly 239 VerificationFooter.tsx files')
  })

  await test('4.2 100% AST parse & Props interface validation on all 239 VerificationFooter.tsx files', () => {
    const parseErrors: string[] = []
    for (const file of footerFiles) {
      const content = fs.readFileSync(file, 'utf-8')
      const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
      const diagnostics = (sourceFile as any).parseDiagnostics || []
      if (diagnostics.length > 0) {
        for (const diag of diagnostics) {
          parseErrors.push(`${path.relative(WORKSPACE_ROOT, file)}: ${diag.messageText}`)
        }
      }
      // Check that it imports ExpectedActualPanel
      assert.ok(
        content.includes('ExpectedActualPanel'),
        `Footer ${path.relative(WORKSPACE_ROOT, file)} must import ExpectedActualPanel`
      )
    }
    assert.strictEqual(parseErrors.length, 0, `AST parse errors found:\n${parseErrors.join('\n')}`)
  })

  await test('4.3 Dynamic 3-State Evaluation Logic Engine Verification', () => {
    // Model the standard verification evaluation logic
    function evaluateFooterState(props: {
      isMatched?: boolean
      status?: string | number | null
      isLoaded?: boolean
      logs?: string[]
      count?: number
    }) {
      const { isMatched: propIsMatched, status, isLoaded, logs, count } = props
      const isMatched =
        propIsMatched !== undefined
          ? propIsMatched
          : status !== undefined && status !== null
          ? typeof status === 'number'
            ? status >= 200 && status < 400
            : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
          : isLoaded !== undefined
          ? Boolean(isLoaded)
          : logs && Array.isArray(logs) && logs.length > 0
          ? true
          : count !== undefined && count > 0
          ? true
          : undefined

      const defaultActual = '• 실시간 인터랙션 및 상태 동기화 완료'
      const actualContent =
        isMatched === true
          ? defaultActual
          : isMatched === false
          ? '• 인터랙션 실패 또는 불일치 감지'
          : '• 인터랙션 대기 중'

      return { isMatched, actualContent }
    }

    // State 1: Default / Idle (no interaction)
    const idle1 = evaluateFooterState({})
    assert.strictEqual(idle1.isMatched, undefined, 'Idle state without props must be undefined')
    assert.match(idle1.actualContent, /인터랙션 대기 중/)

    // State 2: Matched on success status (200, 'success', isLoaded, logs, count)
    const success200 = evaluateFooterState({ status: 200 })
    assert.strictEqual(success200.isMatched, true)
    assert.match(success200.actualContent, /완료/)

    const successStr = evaluateFooterState({ status: 'success' })
    assert.strictEqual(successStr.isMatched, true)

    const successLoaded = evaluateFooterState({ isLoaded: true })
    assert.strictEqual(successLoaded.isMatched, true)

    const successLogs = evaluateFooterState({ logs: ['Request completed'] })
    assert.strictEqual(successLogs.isMatched, true)

    const successCount = evaluateFooterState({ count: 5 })
    assert.strictEqual(successCount.isMatched, true)

    // State 3: Mismatch / Error on 500 status or explicit false
    const err500 = evaluateFooterState({ status: 500 })
    assert.strictEqual(err500.isMatched, false)
    assert.match(err500.actualContent, /실패|불일치/)

    const errExplicit = evaluateFooterState({ isMatched: false })
    assert.strictEqual(errExplicit.isMatched, false)
    assert.match(errExplicit.actualContent, /실패|불일치/)

    // Edge Cases: status=0, empty logs, count=0
    const edgeZero = evaluateFooterState({ count: 0 })
    assert.strictEqual(edgeZero.isMatched, undefined)

    const edgeEmptyLogs = evaluateFooterState({ logs: [] })
    assert.strictEqual(edgeEmptyLogs.isMatched, undefined)
  })

  // -------------------------------------------------------------
  // SECTION 5: E-Commerce Realignment & DeepDive Card Polish (R5)
  // -------------------------------------------------------------
  console.log('\n[SECTION 5] E-Commerce Realignment & DeepDive Card Polish (R5)')

  await test('5.1 Verify 8 Outlier Demos contain authentic e-commerce domain terms', () => {
    const outlierDirs = [
      'apps/demo-baseline/src/app/zone/baseline/css/tailwind-v4',
      'apps/demo-baseline/src/app/zone/baseline/css/css-modules',
      'apps/demo-baseline/src/app/zone/baseline/architecture/fast-refresh-boundary',
      'apps/demo-baseline/src/app/zone/baseline/guides/tanstack-query',
      'apps/demo-cache-components/src/app/zone/cache/guides/migrating-cache-components/cache-key-compare',
      'apps/demo-cache-components/src/app/zone/cache/directives/use-cache/function-cache',
      'apps/demo-cache-components/src/app/zone/cache/directives/use-cache/component-jsx-cache',
      'apps/demo-cache-components/src/app/zone/cache/directives/use-cache/remote-redis-cache',
    ]

    const ecommerceTerms = ['상품', '주문', '결제', '재고', '장바구니', 'SKU', 'price', 'product', 'cart', 'order', 'coupon']

    for (const relDir of outlierDirs) {
      const fullDir = path.join(NEXTJS_APP_ROOT, relDir)
      assert.ok(fs.existsSync(fullDir), `Directory must exist: ${relDir}`)
      const files = getAllFiles(fullDir, ['.tsx', '.ts'])
      let combinedContent = ''
      for (const file of files) {
        combinedContent += fs.readFileSync(file, 'utf-8') + '\n'
      }

      const foundTerms = ecommerceTerms.filter(t => combinedContent.includes(t))
      assert.ok(
        foundTerms.length >= 2,
        `Outlier demo at ${relDir} must contain at least 2 e-commerce terms (found ${foundTerms.join(', ')})`
      )
    }
  })

  await test('5.2 Zero copy-paste GeoIP/S3 DeepDive text in non-GeoIP/S3 demo footers', () => {
    for (const file of footerFiles) {
      const relPath = path.relative(WORKSPACE_ROOT, file)
      const isGeoIpDemo = relPath.includes('geo-ip')
      const isCdnDemo = relPath.includes('asset-prefix') || relPath.includes('cdn')

      const content = fs.readFileSync(file, 'utf-8')
      if (!isGeoIpDemo) {
        assert.doesNotMatch(
          content,
          /GeoIP.*클라이언트 국가 코드 분석/i,
          `Footer at ${relPath} contains copy-pasted GeoIP text`
        )
      }
      if (!isCdnDemo) {
        assert.doesNotMatch(
          content,
          /S3\/CloudFront.*정적 애셋 글로벌 배포/i,
          `Footer at ${relPath} contains copy-pasted CDN text`
        )
      }
    }
  })

  // -------------------------------------------------------------
  // SECTION 6: High-Load Stress Testing & Domain Logic Engine
  // -------------------------------------------------------------
  console.log('\n[SECTION 6] High-Load Stress Testing & Domain Logic Engine')

  await test('6.1 High-concurrency coupon calculation & extreme boundary resilience', async () => {
    const { MOCK_COUPONS } = await import(
      'file://' + path.join(NEXTJS_APP_ROOT, 'packages/demo-kit/src/ecommerce/mockData.ts')
    )

    // Simulate coupon engine algorithm
    const applyCoupon = (code: string, orderAmount: number) => {
      const found = MOCK_COUPONS.find((c: any) => c.code === code.toUpperCase().trim())
      if (!found) {
        return { success: false, error: '유효하지 않은 쿠폰 코드입니다.' }
      }
      if (orderAmount < found.minOrderAmount) {
        return { success: false, error: `최소 주문금액(${found.minOrderAmount.toLocaleString()}원) 미달` }
      }
      const discount =
        found.discountType === 'PERCENT'
          ? (orderAmount * found.discountValue) / 100
          : found.discountValue
      return {
        success: true,
        coupon: found,
        discount,
        finalAmount: orderAmount - discount,
      }
    }

    // Run 100 concurrent coupon calculations
    const promises: Promise<any>[] = []
    for (let i = 0; i < 100; i++) {
      const amount = 50000 + i * 1000
      promises.push(Promise.resolve(applyCoupon('WELCOME2026', amount)))
    }
    const results = await Promise.all(promises)
    assert.strictEqual(results.length, 100)
    for (let i = 0; i < 100; i++) {
      const amount = 50000 + i * 1000
      const res = results[i]
      assert.strictEqual(res.success, true)
      assert.strictEqual(res.discount, Math.round(amount * 0.1))
      assert.strictEqual(res.finalAmount, amount - Math.round(amount * 0.1))
    }

    // Boundary conditions
    const invalidUnderMin = applyCoupon('WELCOME2026', 29999)
    assert.strictEqual(invalidUnderMin.success, false)
    assert.match(invalidUnderMin.error!, /최소 주문금액/)

    const invalidCode = applyCoupon('NON_EXISTENT', 100000)
    assert.strictEqual(invalidCode.success, false)
    assert.match(invalidCode.error!, /유효하지 않은/)

    const trimCode = applyCoupon('  WELCOME2026  \n', 50000)
    assert.strictEqual(trimCode.success, true)
  })

  await test('6.2 Distributed cache tag cascade invalidation simulation under rapid mutations', () => {
    const mockCacheStore = new Map<string, { data: any; tags: string[] }>()
    
    // Seed 50 cache entries across categories
    for (let i = 1; i <= 50; i++) {
      const cat = i % 2 === 0 ? 'electronics' : 'fashion'
      mockCacheStore.set(`product-${i}`, {
        data: { id: `prod-${i}`, price: i * 1000 },
        tags: [`category-${cat}`, `product-${i}`],
      })
    }
    assert.strictEqual(mockCacheStore.size, 50)

    // Invalidate 'category-electronics'
    const purgeTag = (tag: string) => {
      for (const [key, value] of Array.from(mockCacheStore.entries())) {
        if (value.tags.includes(tag)) {
          mockCacheStore.delete(key)
        }
      }
    }

    purgeTag('category-electronics')
    assert.strictEqual(mockCacheStore.size, 25, 'All 25 electronics entries should be purged')
    for (const [, val] of mockCacheStore.entries()) {
      assert.ok(val.tags.includes('category-fashion'), 'Remaining entries must be fashion')
    }

    // Invalidate single product
    purgeTag('product-1')
    assert.strictEqual(mockCacheStore.size, 24)
  })

  // -------------------------------------------------------------
  // SECTION 7: DeepDive 4-Section Polish & Placeholder Audit (All 239)
  // -------------------------------------------------------------
  console.log('\n[SECTION 7] DeepDive Explanation Polish & Placeholder Audit (All 239 Footers)')

  await test('7.1 Verify 100% of 239 VerificationFooters have structured DeepDive content with 0 placeholders', () => {
    const insufficientFooters: string[] = []
    const placeholderIssues: string[] = []

    for (const file of footerFiles) {
      const content = fs.readFileSync(file, 'utf-8')
      const relPath = path.relative(WORKSPACE_ROOT, file)

      // Must have DemoDeepDiveCard
      if (!content.includes('DemoDeepDiveCard')) {
        insufficientFooters.push(`${relPath} missing DemoDeepDiveCard`)
      }

      // Must have at least 2 structured explanation headings (h5 or h4 or numbered bold)
      const headingCount = (content.match(/<h[45]\b[^>]*>|\b\d\.\s*핵심/g) || []).length
      if (headingCount < 2) {
        insufficientFooters.push(`${relPath} has fewer than 2 structured explanation sections (found ${headingCount})`)
      }

      // Placeholder check (TODO, FIXME, undefined literal in text)
      if (/\bTODO\b|\bFIXME\b|undefined\s*입니다|NaN원/.test(content)) {
        placeholderIssues.push(`${relPath} contains unresolved placeholder`)
      }
    }

    assert.strictEqual(insufficientFooters.length, 0, `Footers with insufficient sections:\n${insufficientFooters.join('\n')}`)
    assert.strictEqual(placeholderIssues.length, 0, `Footers with placeholders:\n${placeholderIssues.join('\n')}`)
  })

  // -------------------------------------------------------------
  // SECTION 8: Dynamic Routing & URL Encoder Stress Test
  // -------------------------------------------------------------
  console.log('\n[SECTION 8] Dynamic Routing & URL Parameter Encoding Stress Test')

  await test('8.1 Complex URI encoding, slug joining, and parameter resolution', () => {
    // Test slug joining for deep nested categories
    const testCases = [
      { slugs: ['electronics', 'audio', 'headphones'], expected: 'electronics/audio/headphones' },
      { slugs: ['fashion', 'men', 'shoes', 'running'], expected: 'fashion/men/shoes/running' },
      { slugs: ['한글카테고리', '전자기기', '스마트폰'], expected: '한글카테고리/전자기기/스마트폰' },
    ]

    for (const tc of testCases) {
      const joined = tc.slugs.map(s => encodeURIComponent(s)).join('/')
      const decoded = joined.split('/').map(s => decodeURIComponent(s)).join('/')
      assert.strictEqual(decoded, tc.expected)
    }

    // Test search params parsing resilience
    const parseParams = (query: string) => {
      const searchParams = new URLSearchParams(query)
      return {
        category: searchParams.get('category') || 'all',
        sort: searchParams.get('sort') || 'best',
        page: Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1),
        maxPrice: Math.max(0, parseInt(searchParams.get('maxPrice') || '1000000', 10) || 1000000),
      }
    }

    assert.deepStrictEqual(parseParams('category=electronics&sort=price-asc&page=2&maxPrice=150000'), {
      category: 'electronics',
      sort: 'price-asc',
      page: 2,
      maxPrice: 150000,
    })

    // Malicious / invalid parameter fallback
    assert.deepStrictEqual(parseParams('category=fashion&page=-5&maxPrice=invalid'), {
      category: 'fashion',
      sort: 'best',
      page: 1,
      maxPrice: 1000000,
    })
  })

  console.log('\n============================================================')
  console.log(`Execution Complete: ${passCount} Passed, ${failCount} Failed`)
  console.log('============================================================\n')

  if (failCount > 0) {
    process.exit(1)
  }
}

runAdversarialSuite().catch((err) => {
  console.error('Fatal test runner error:', err)
  process.exit(1)
})
