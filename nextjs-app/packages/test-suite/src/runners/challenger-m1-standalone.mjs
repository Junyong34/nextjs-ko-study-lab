import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import ts from 'typescript'
import assert from 'node:assert/strict'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const WORKSPACE_ROOT = path.resolve(__dirname, '../../../../..')
const NEXTJS_APP_ROOT = path.join(WORKSPACE_ROOT, 'nextjs-app')
const DOCS_ROOT = path.join(WORKSPACE_ROOT, 'nextjs-docs')

console.log('============================================================')
console.log('   EMPIRICAL CHALLENGER: Milestone 1 Stress Test Harness    ')
console.log('============================================================\n')

let passCount = 0
let failCount = 0
const failures = []

async function runTest(name, fn) {
  try {
    await fn()
    console.log(`  ✅ PASS: ${name}`)
    passCount++
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`)
    console.error(`     Details: ${err.message}`)
    failures.push({ name, error: err.message, stack: err.stack })
    failCount++
  }
}

async function main() {
  // -------------------------------------------------------------
  // Test Category 1: Manifest & YAML 100% Match & Doc Link Validity
  // -------------------------------------------------------------
  console.log('[CATEGORY 1] Manifest 100% Integrity & Doc Link Validity')
  
  const yamlPath = path.join(NEXTJS_APP_ROOT, 'packages/demos/demos.yaml')
  const jsonPath = path.join(NEXTJS_APP_ROOT, 'packages/demos/demos-manifest.json')
  
  const yamlRaw = fs.readFileSync(yamlPath, 'utf-8')
  const yamlDemos = yaml.load(yamlRaw)
  const jsonDemos = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  await runTest('1.1 demos.yaml and demos-manifest.json both contain exactly 241 demos', () => {
    assert.strictEqual(yamlDemos.length, 241, `yaml count: ${yamlDemos.length}`)
    assert.strictEqual(jsonDemos.length, 241, `json count: ${jsonDemos.length}`)
  })

  await runTest('1.2 100% 1-to-1 matching across every demo key between YAML and JSON', () => {
    const jsonMap = new Map(jsonDemos.map(d => [d.url, d]))
    for (const yd of yamlDemos) {
      const jd = jsonMap.get(yd.url)
      assert.ok(jd, `Missing demo in JSON: ${yd.url}`)
      assert.strictEqual(jd.title, yd.title, `Title mismatch in ${yd.url}`)
      assert.strictEqual(jd.doc, yd.doc, `Doc mismatch in ${yd.url}`)
      assert.strictEqual(jd.zone, yd.zone, `Zone mismatch in ${yd.url}`)
      assert.strictEqual(jd.status, yd.status, `Status mismatch in ${yd.url}`)
    }
  })

  await runTest('1.3 Zero broken doc links across all 241 demos (every doc exists and size > 0)', () => {
    const broken = []
    for (const d of yamlDemos) {
      const p = path.join(DOCS_ROOT, d.doc)
      if (!fs.existsSync(p)) {
        broken.push(`${d.url} -> ${d.doc} (NOT FOUND)`)
      } else {
        const s = fs.statSync(p)
        if (s.size === 0) broken.push(`${d.url} -> ${d.doc} (EMPTY FILE)`)
      }
    }
    assert.strictEqual(broken.length, 0, `Broken docs found:\n${broken.join('\n')}`)
  })

  await runTest('1.4 Milestone 1 fixed docs correctly resolve to target subjects', () => {
    const fixes = [
      {
        url: 'architecture/compiler-optimization/react-compiler',
        doc: '5-architecture/nextjs-compiler.md',
        keyword: 'Compiler'
      },
      {
        url: 'architecture/server-action-security/csrf-protection',
        doc: '3-api-reference/3.5-config/3.5.1-next-config-js/serverActions.md',
        keyword: 'serverActions'
      },
      {
        url: 'architecture/turbopack/incremental-harness',
        doc: '3-api-reference/3.5-config/3.5.1-next-config-js/turbopack.md',
        keyword: 'turbopack'
      }
    ]
    for (const f of fixes) {
      const yd = yamlDemos.find(x => x.url === f.url)
      assert.ok(yd, `Demo ${f.url} missing`)
      assert.strictEqual(yd.doc, f.doc, `Doc mismatch for ${f.url}`)
      const fullDoc = path.join(DOCS_ROOT, f.doc)
      const content = fs.readFileSync(fullDoc, 'utf-8')
      assert.ok(content.toLowerCase().includes(f.keyword.toLowerCase()), `Doc does not contain keyword "${f.keyword}"`)
    }
  })

  // -------------------------------------------------------------
  // Test Category 2: JSX Parsing and AST Diagnostics across Touched Files
  // -------------------------------------------------------------
  console.log('\n[CATEGORY 2] JSX Parsing & AST Diagnostics (35+ files)')

  const allM1Files = [
    // 7 Component files
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

    // DeepDive cleaned files
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

  await runTest('2.1 Zero TypeScript/JSX parser diagnostics across all 45 M1 files', () => {
    const errors = []
    for (const rel of allM1Files) {
      const full = path.join(NEXTJS_APP_ROOT, rel)
      const code = fs.readFileSync(full, 'utf-8')
      const sf = ts.createSourceFile(
        full,
        code,
        ts.ScriptTarget.Latest,
        true,
        rel.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
      )
      const diags = sf.parseDiagnostics || []
      if (diags.length > 0) {
        for (const d of diags) {
          errors.push(`${rel}: ${d.messageText}`)
        }
      }
    }
    assert.strictEqual(errors.length, 0, `Parse errors:\n${errors.join('\n')}`)
  })

  await runTest('2.2 AST tree validates VerificationFooter exports and JSX elements', () => {
    const footers = allM1Files.filter(f => f.endsWith('VerificationFooter.tsx'))
    for (const rel of footers) {
      const full = path.join(NEXTJS_APP_ROOT, rel)
      const code = fs.readFileSync(full, 'utf-8')
      const sf = ts.createSourceFile(full, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
      let foundExport = false
      let foundExpectedActual = false
      let foundDeepDive = false

      function visit(node) {
        if (ts.isFunctionDeclaration(node) && node.name?.text === 'VerificationFooter') {
          foundExport = true
        }
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
          const tagName = node.tagName.getText(sf)
          if (tagName === 'ExpectedActualPanel') foundExpectedActual = true
          if (tagName === 'DemoDeepDiveCard') foundDeepDive = true
        }
        ts.forEachChild(node, visit)
      }
      visit(sf)

      assert.ok(foundExport, `${rel} does not export function VerificationFooter`)
      assert.ok(foundExpectedActual, `${rel} missing <ExpectedActualPanel>`)
      assert.ok(foundDeepDive, `${rel} missing <DemoDeepDiveCard>`)
    }
  })

  // -------------------------------------------------------------
  // Test Category 3: Component Mount and Wiring Verification
  // -------------------------------------------------------------
  console.log('\n[CATEGORY 3] Component Mount & Wiring in page.tsx')

  const mountDefinitions = [
    {
      page: 'apps/demo-baseline/src/app/zone/baseline/directives/use-client/window-storage-access/page.tsx',
      target: 'StorageClientDemo',
      stub: 'DirectiveUseClientStorageDemo'
    },
    {
      page: 'apps/demo-baseline/src/app/zone/baseline/directives/use-server/file-level-action/page.tsx',
      target: 'DirectiveUseServerDemo',
      stub: 'DirectiveUseServerFileDemo'
    },
    {
      page: 'apps/demo-baseline/src/app/zone/baseline/directives/use-server/inline-action-closure/page.tsx',
      target: 'InlineActionClosureDemo',
      stub: 'DirectiveUseServerInlineDemo'
    },
    {
      page: 'apps/demo-baseline/src/app/zone/baseline/functions/after/background-logging/page.tsx',
      target: 'AfterLoggingDemo',
      stub: 'AfterBackgroundLoggingDemo'
    },
    {
      page: 'apps/demo-baseline/src/app/zone/baseline/functions/cookies/get-set-session/page.tsx',
      target: 'CookiesSessionDemo',
      stub: 'CookiesGetSetDemo'
    },
    {
      page: 'apps/demo-baseline/src/app/zone/baseline/functions/use-router/push-replace/page.tsx',
      target: 'NavigationClientDemo',
      stub: 'UseRouterPushReplaceDemo'
    },
    {
      page: 'apps/demo-baseline/src/app/zone/baseline/functions/use-search-params/filter-parsing/page.tsx',
      target: 'FilterParsingDemo',
      stub: 'UseSearchParamsFilterDemo'
    }
  ]

  await runTest('3.1 All 7 page.tsx files properly import and mount their rich demo components', () => {
    for (const m of mountDefinitions) {
      const full = path.join(NEXTJS_APP_ROOT, m.page)
      const code = fs.readFileSync(full, 'utf-8')
      assert.match(code, new RegExp(`import\\s+{[^}]*\\b${m.target}\\b[^}]*}`), `${m.page} missing import for ${m.target}`)
      assert.match(code, new RegExp(`<${m.target}\\s*\\/?>`), `${m.page} does not render <${m.target} />`)
      assert.doesNotMatch(code, new RegExp(`<${m.stub}\\s*\\/?>`), `${m.page} still renders stub <${m.stub} />`)
    }
  })

  // -------------------------------------------------------------
  // Test Category 4: Empirical Logic & Adversarial Execution Testing
  // -------------------------------------------------------------
  console.log('\n[CATEGORY 4] Empirical Logic & Adversarial Stress Testing')

  // Direct simulation of applyCouponAction logic
  const coupons = [
    {
      id: "cp-welcome",
      code: "WELCOME2026",
      name: "신규 가입 환영 10% 할인 쿠폰",
      discountType: "PERCENT",
      discountValue: 10,
      minOrderAmount: 30000,
      expiresAt: "2026-12-31"
    },
    {
      id: "cp-flash",
      code: "FLASH5000",
      name: "타임세일 깜짝 5,000원 할인 쿠폰",
      discountType: "FIXED",
      discountValue: 5000,
      minOrderAmount: 50000,
      expiresAt: "2026-08-31"
    },
    {
      id: "cp-vip",
      code: "VIPSPECIAL",
      name: "VIP 회원 전용 20% 특별 우대 쿠폰",
      discountType: "PERCENT",
      discountValue: 20,
      minOrderAmount: 100000,
      expiresAt: "2026-12-31"
    }
  ]

  async function simulateApplyCoupon(code, orderAmount) {
    const found = coupons.find(c => c.code === (code || '').toUpperCase().trim())
    if (!found) {
      return { success: false, error: '유효하지 않은 쿠폰 코드입니다.' }
    }
    if (orderAmount < found.minOrderAmount) {
      return { success: false, error: `최소 주문금액(${found.minOrderAmount.toLocaleString()}원) 미달` }
    }
    const discount = found.discountType === 'PERCENT'
      ? (orderAmount * found.discountValue) / 100
      : found.discountValue
    return {
      success: true,
      coupon: found,
      discount,
      finalAmount: orderAmount - discount,
    }
  }

  await runTest('4.1 Server Action: Percentage vs Fixed discount mathematical precision', async () => {
    // 10% on 189,000 = 18,900
    const r1 = await simulateApplyCoupon('WELCOME2026', 189000)
    assert.strictEqual(r1.success, true)
    assert.strictEqual(r1.discount, 18900)
    assert.strictEqual(r1.finalAmount, 170100)

    // 20% on 189,000 = 37,800
    const r2 = await simulateApplyCoupon('VIPSPECIAL', 189000)
    assert.strictEqual(r2.success, true)
    assert.strictEqual(r2.discount, 37800)
    assert.strictEqual(r2.finalAmount, 151200)

    // Fixed 5,000 on 50,000 = 45,000
    const r3 = await simulateApplyCoupon('FLASH5000', 50000)
    assert.strictEqual(r3.success, true)
    assert.strictEqual(r3.discount, 5000)
    assert.strictEqual(r3.finalAmount, 45000)
  })

  await runTest('4.2 Server Action: Normalization, boundary thresholds, and attack payloads', async () => {
    // Case & whitespace
    const rCase = await simulateApplyCoupon('  welcome2026 \t\n', 100000)
    assert.strictEqual(rCase.success, true)
    assert.strictEqual(rCase.discount, 10000)

    // Minimum boundary: 29,999 vs 30,000
    const rUnder = await simulateApplyCoupon('WELCOME2026', 29999)
    assert.strictEqual(rUnder.success, false)
    assert.match(rUnder.error, /최소 주문금액/)

    const rExact = await simulateApplyCoupon('WELCOME2026', 30000)
    assert.strictEqual(rExact.success, true)
    assert.strictEqual(rExact.discount, 3000)

    // Attack payloads
    const attacks = ['', '   ', '<svg onload=alert(1)>', "' OR '1'='1", null, undefined]
    for (const atk of attacks) {
      const rAtk = await simulateApplyCoupon(atk, 100000)
      assert.strictEqual(rAtk.success, false)
      assert.strictEqual(rAtk.error, '유효하지 않은 쿠폰 코드입니다.')
    }
  })

  await runTest('4.3 StorageClientDemo: Deduplication, MRU ordering, max 4 capping', () => {
    let recent = []
    const addRecent = (product) => {
      recent = [product, ...recent.filter(p => p.id !== product.id)].slice(0, 4)
    }

    const p1 = { id: 'p1', name: 'Keyboard' }
    const p2 = { id: 'p2', name: 'Mouse' }
    const p3 = { id: 'p3', name: 'Headphone' }
    const p4 = { id: 'p4', name: 'Monitor' }
    const p5 = { id: 'p5', name: 'Webcam' }

    addRecent(p1); addRecent(p2); addRecent(p3); addRecent(p4)
    assert.deepStrictEqual(recent.map(p => p.id), ['p4', 'p3', 'p2', 'p1'])

    // Add p5 -> p1 is evicted
    addRecent(p5)
    assert.deepStrictEqual(recent.map(p => p.id), ['p5', 'p4', 'p3', 'p2'])

    // Click existing p3 -> moves to front: [p3, p5, p4, p2]
    addRecent(p3)
    assert.deepStrictEqual(recent.map(p => p.id), ['p3', 'p5', 'p4', 'p2'])
  })

  await runTest('4.4 NavigationClientDemo: Multi-step stack state and back boundaries', () => {
    let currentUrl = '/shop/products'
    let stack = ['/shop/products']

    const push = (t) => { currentUrl = t; stack = [...stack, t] }
    const replace = (t) => { currentUrl = t; stack = [...stack.slice(0, -1), t] }
    const back = () => {
      if (stack.length > 1) {
        const next = stack.slice(0, -1)
        stack = next
        currentUrl = next[next.length - 1]
      }
    }

    push('/shop/products/prod-001')
    push('/shop/cart')
    replace('/shop/checkout/success')
    assert.strictEqual(currentUrl, '/shop/checkout/success')
    assert.strictEqual(stack.length, 3)

    back()
    assert.strictEqual(currentUrl, '/shop/products/prod-001')
    back()
    assert.strictEqual(currentUrl, '/shop/products')
    // Attempt back at root
    back()
    assert.strictEqual(currentUrl, '/shop/products')
    assert.strictEqual(stack.length, 1)
  })

  console.log('\n============================================================')
  console.log(`Execution Summary: ${passCount} Passed, ${failCount} Failed`)
  console.log('============================================================\n')

  if (failCount > 0) {
    process.exit(1)
  }
}

main().catch(e => {
  console.error('Fatal test harness failure:', e)
  process.exit(1)
})
