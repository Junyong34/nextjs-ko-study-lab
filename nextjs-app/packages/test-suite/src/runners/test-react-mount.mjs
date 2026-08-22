import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import ts from 'typescript'
import assert from 'node:assert/strict'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const WORKSPACE_ROOT = path.resolve(__dirname, '../../../../..')
const NEXTJS_APP_ROOT = path.join(WORKSPACE_ROOT, 'nextjs-app')

const baseRequire = createRequire(path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/package.json'))
const React = baseRequire('react')
const ReactDOMServer = baseRequire('react-dom/server')

console.log('============================================================')
console.log('   REACT COMPONENT SSR MOUNT & RENDERING HARNESS (M1)       ')
console.log('============================================================\n')

// Mock @study/demo-kit
const mockDemoKit = {
  DemoContainer: ({ children, className }) => React.createElement('div', { className, 'data-testid': 'demo-container' }, children),
  DemoGuideCard: ({ title, concept }) => React.createElement('div', { 'data-testid': 'guide-card' }, title, concept),
  DemoPlaygroundCard: ({ title, children }) => React.createElement('div', { 'data-testid': 'playground-card' }, title, children),
  DemoDeepDiveCard: ({ title, children }) => React.createElement('div', { 'data-testid': 'deepdive-card' }, title, children),
  ExpectedActualPanel: ({ title, expected, actual, isMatched }) => React.createElement('div', { 'data-testid': 'expected-actual' }, title, expected, actual, String(isMatched)),
  ProductCard: ({ product }) => React.createElement('div', { 'data-testid': 'product-card' }, product.name, product.price),
  MOCK_PRODUCTS: [
    { id: 'prod-001', name: '프로 무선 기계식 키보드', category: 'electronics', categoryName: '전자기기', price: 189000, isBest: true, rating: 4.8 },
    { id: 'prod-002', name: '무선 버티컬 마우스', category: 'electronics', categoryName: '전자기기', price: 99000, isBest: true, rating: 4.9 },
    { id: 'prod-003', name: '블루투스 헤드폰', category: 'electronics', categoryName: '전자기기', price: 349000, isBest: false, rating: 4.7 }
  ],
  MOCK_COUPONS: [
    { id: 'cp-welcome', code: 'WELCOME2026', name: '신규 가입 10%', discountType: 'PERCENT', discountValue: 10, minOrderAmount: 30000 },
    { id: 'cp-vip', code: 'VIPSPECIAL', name: 'VIP 20%', discountType: 'PERCENT', discountValue: 20, minOrderAmount: 100000 }
  ],
  MOCK_USER_SESSIONS: {
    customer: { userId: 'usr_1', email: 'c@c.com', name: '김고객', role: 'CUSTOMER', tier: 'SILVER', points: 1000 },
    vip: { userId: 'usr_2', email: 'v@v.com', name: '이우수', role: 'VIP', tier: 'PLATINUM', points: 50000 },
    admin: { userId: 'usr_3', email: 'a@a.com', name: '박관리', role: 'ADMIN', tier: 'PLATINUM', points: 999999 }
  },
  MOCK_ORDERS: [
    { id: 'ord-1', orderNumber: 'ORD-20260822-001', totalAmount: 259200 }
  ]
}

function loadAndEvaluate(filePath, extraMocks = {}) {
  const code = fs.readFileSync(filePath, 'utf-8')
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText

  const customRequire = (moduleName) => {
    if (moduleName === 'react') return React
    if (moduleName === 'react/jsx-runtime') {
      return {
        jsx: React.createElement,
        jsxs: React.createElement,
        Fragment: React.Fragment
      }
    }
    if (moduleName === '@study/demo-kit') return mockDemoKit
    if (extraMocks[moduleName]) return extraMocks[moduleName]
    if (moduleName.startsWith('.')) {
      const resolved = path.resolve(path.dirname(filePath), moduleName)
      const candidateExts = ['.tsx', '.ts', '.jsx', '.js', '/index.tsx', '/index.ts']
      for (const ext of candidateExts) {
        if (fs.existsSync(resolved + ext)) {
          return loadAndEvaluate(resolved + ext, extraMocks)
        }
      }
    }
    return {}
  }

  const moduleObj = { exports: {} }
  const wrapper = new Function('require', 'module', 'exports', 'React', transpiled)
  wrapper(customRequire, moduleObj, moduleObj.exports, React)
  return moduleObj.exports
}

const componentTestList = [
  {
    name: 'StorageClientDemo',
    path: 'apps/demo-baseline/src/app/zone/baseline/directives/use-client/window-storage-access/components/StorageClientDemo.tsx',
    exportName: 'StorageClientDemo',
    expectedText: '최근 본 상품'
  },
  {
    name: 'DirectiveUseServerDemo',
    path: 'apps/demo-baseline/src/app/zone/baseline/directives/use-server/file-level-action/components/DirectiveUseServerDemo.tsx',
    exportName: 'DirectiveUseServerDemo',
    expectedText: '장바구니 할인 쿠폰 적용'
  },
  {
    name: 'InlineActionClosureDemo',
    path: 'apps/demo-baseline/src/app/zone/baseline/directives/use-server/inline-action-closure/components/InlineActionClosureDemo.tsx',
    exportName: 'InlineActionClosureDemo',
    expectedText: '상품 즉시 결제'
  },
  {
    name: 'AfterLoggingDemo',
    path: 'apps/demo-baseline/src/app/zone/baseline/functions/after/background-logging/components/AfterLoggingDemo.tsx',
    exportName: 'AfterLoggingDemo',
    expectedText: 'after() 백그라운드 주문 후속 처리'
  },
  {
    name: 'CookiesSessionDemo',
    path: 'apps/demo-baseline/src/app/zone/baseline/functions/cookies/get-set-session/components/CookiesSessionDemo.tsx',
    exportName: 'CookiesSessionDemo',
    expectedText: 'cookies().get() &amp; set()'
  },
  {
    name: 'NavigationClientDemo',
    path: 'apps/demo-baseline/src/app/zone/baseline/functions/use-router/push-replace/components/NavigationClientDemo.tsx',
    exportName: 'NavigationClientDemo',
    expectedText: 'useRouter 프로그래밍 네비게이션 시뮬레이터'
  },
  {
    name: 'FilterParsingDemo',
    path: 'apps/demo-baseline/src/app/zone/baseline/functions/use-search-params/filter-parsing/components/FilterParsingDemo.tsx',
    exportName: 'FilterParsingDemo',
    expectedText: 'useSearchParams() 상품 필터 &amp; 정렬 쿼리 파싱'
  }
]

let passed = 0
let failed = 0

console.log('[COMPONENT LEVEL SSR MOUNT TESTS]')
for (const comp of componentTestList) {
  try {
    const fullPath = path.join(NEXTJS_APP_ROOT, comp.path)
    const exports = loadAndEvaluate(fullPath)
    const Component = exports[comp.exportName] || exports.default
    assert.ok(Component, `Component ${comp.exportName} must be exported`)
    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(Component))
    assert.ok(html.includes(comp.expectedText), `Rendered HTML missing expected text: ${comp.expectedText}`)
    console.log(`  ✅ RENDER SUCCESS: <${comp.name} /> -> HTML length: ${html.length} bytes`)
    passed++
  } catch (err) {
    console.error(`  ❌ RENDER FAIL: <${comp.name} />`)
    console.error(`     Error: ${err.message}`)
    failed++
  }
}

// Render the 7 page.tsx files
const pageTestList = [
  'apps/demo-baseline/src/app/zone/baseline/directives/use-client/window-storage-access/page.tsx',
  'apps/demo-baseline/src/app/zone/baseline/directives/use-server/file-level-action/page.tsx',
  'apps/demo-baseline/src/app/zone/baseline/directives/use-server/inline-action-closure/page.tsx',
  'apps/demo-baseline/src/app/zone/baseline/functions/after/background-logging/page.tsx',
  'apps/demo-baseline/src/app/zone/baseline/functions/cookies/get-set-session/page.tsx',
  'apps/demo-baseline/src/app/zone/baseline/functions/use-router/push-replace/page.tsx',
  'apps/demo-baseline/src/app/zone/baseline/functions/use-search-params/filter-parsing/page.tsx'
]

console.log('\n[PAGE LEVEL SSR MOUNT TESTS]')
for (const pagePath of pageTestList) {
  try {
    const fullPath = path.join(NEXTJS_APP_ROOT, pagePath)
    const exports = loadAndEvaluate(fullPath)
    const Page = exports.default
    assert.ok(Page, `Page at ${pagePath} must have default export`)
    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(Page))
    assert.ok(html.length > 500, `Page HTML must render full tree (got ${html.length} bytes)`)
    console.log(`  ✅ PAGE SSR PASS: ${pagePath} -> ${html.length} bytes`)
    passed++
  } catch (err) {
    console.error(`  ❌ PAGE SSR FAIL: ${pagePath}`)
    console.error(`     Error: ${err.message}`)
    failed++
  }
}

console.log(`\nSSR Mount Tests Complete: ${passed} Passed, ${failed} Failed`)
if (failed > 0) process.exit(1)
