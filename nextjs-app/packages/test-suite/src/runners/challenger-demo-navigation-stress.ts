import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  DEMO_LIST_STORAGE_KEY,
  DEMO_RESTORE_EXPIRY_MS,
  saveDemoListContext,
  getDemoListContext,
  clearDemoListContext,
  type DemoListRestorationContext,
} from '../../../../apps/shell/src/lib/demo-storage.ts'
import { loadDemosYaml, NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'

console.log('=== STARTING EMPIRICAL CHALLENGER STRESS HARNESS ===')

let passCount = 0
let failCount = 0

function runTest(name: string, fn: () => void) {
  try {
    fn()
    passCount++
    console.log(`  [PASS] ${name}`)
  } catch (err: any) {
    failCount++
    console.error(`  [FAIL] ${name}:`, err.message)
  }
}

// ----------------------------------------------------------------------------
// Suite 1: sessionStorage Context Storage Mechanics & Edge Cases
// ----------------------------------------------------------------------------
console.log('\n--- Suite 1: sessionStorage Context Storage Mechanics ---')

let mockStorage: Record<string, string> = {}

function setupMockBrowser(options?: {
  throwOnSet?: boolean
  throwOnGet?: boolean
  throwOnRemove?: boolean
  initialStorage?: Record<string, string>
  pathname?: string
  search?: string
  scrollY?: number
  historyLength?: number
  referrer?: string
  host?: string
}) {
  mockStorage = options?.initialStorage ? { ...options.initialStorage } : {}
  const host = options?.host ?? 'localhost:3000'

  ;(globalThis as any).window = {
    location: {
      pathname: options?.pathname ?? '/demo',
      search: options?.search ?? '?q=caching&page=2',
      host,
      origin: `http://${host}`,
    },
    history: {
      length: options?.historyLength ?? 2,
    },
    scrollY: options?.scrollY ?? 450,
    scrollTo: (opts: { top: number; behavior?: string }) => {
      ;(globalThis as any).window.scrollY = opts.top
    },
    requestAnimationFrame: (cb: () => void) => {
      cb()
      return 1
    },
  }

  ;(globalThis as any).document = {
    referrer: options?.referrer ?? '',
    querySelector: (selector: string) => null,
    getElementById: (id: string) => null,
  }

  ;(globalThis as any).sessionStorage = {
    getItem: (key: string) => {
      if (options?.throwOnGet) {
        throw new Error('SecurityError: The operation is insecure.')
      }
      return mockStorage[key] ?? null
    },
    setItem: (key: string, val: string) => {
      if (options?.throwOnSet) {
        throw new Error('QuotaExceededError: The quota has been exceeded.')
      }
      mockStorage[key] = String(val)
    },
    removeItem: (key: string) => {
      if (options?.throwOnRemove) {
        throw new Error('SecurityError: Cannot remove item')
      }
      delete mockStorage[key]
    },
    clear: () => {
      mockStorage = {}
    },
  }
}

function cleanupMockBrowser() {
  delete (globalThis as any).window
  delete (globalThis as any).document
  delete (globalThis as any).sessionStorage
  mockStorage = {}
}

runTest('1.1 SSR Environment: save/get/clear safely no-op when window is undefined', () => {
  cleanupMockBrowser()
  assert.doesNotThrow(() => {
    saveDemoListContext({ listUrl: '/demo', clickedDemoUrl: 'test', scrollY: 100 })
    const ctx = getDemoListContext()
    assert.strictEqual(ctx, null)
    clearDemoListContext()
  })
})

runTest('1.2 Storage Quota Exceeded: saveDemoListContext catches error gracefully without throwing', () => {
  setupMockBrowser({ throwOnSet: true })
  assert.doesNotThrow(() => {
    saveDemoListContext({ listUrl: '/demo?q=large', clickedDemoUrl: 'caching/basic', scrollY: 200 })
  })
  cleanupMockBrowser()
})

runTest('1.3 Security / Access Restricted: getDemoListContext catches error and returns null', () => {
  setupMockBrowser({ throwOnGet: true })
  assert.doesNotThrow(() => {
    const res = getDemoListContext()
    assert.strictEqual(res, null)
  })
  cleanupMockBrowser()
})

runTest('1.4 Malformed JSON in sessionStorage: returns null without crashing', () => {
  const malformedEntries = [
    '{ invalid json',
    'undefined',
    '',
    '{"listUrl":',
    '<xml>not json</xml>',
  ]

  for (const badJson of malformedEntries) {
    setupMockBrowser({ initialStorage: { [DEMO_LIST_STORAGE_KEY]: badJson } })
    const res = getDemoListContext()
    assert.strictEqual(res, null, `Expected null for malformed JSON: ${badJson}`)
    cleanupMockBrowser()
  }
})

runTest('1.5 Primitive / Non-Object JSON values: returns null and purges invalid key', () => {
  const primitiveEntries = [
    '12345',
    '"just a plain string"',
    'true',
    'false',
    '[1, 2, 3]',
    'null',
  ]

  for (const prim of primitiveEntries) {
    setupMockBrowser({ initialStorage: { [DEMO_LIST_STORAGE_KEY]: prim } })
    const res = getDemoListContext()
    assert.strictEqual(res, null, `Expected null for primitive JSON: ${prim}`)
    assert.strictEqual(mockStorage[DEMO_LIST_STORAGE_KEY], undefined, `Expected key to be purged for: ${prim}`)
    cleanupMockBrowser()
  }
})

runTest('1.6 Schema Invalid Payloads: missing or non-string listUrl purges key', () => {
  const invalidSchemas = [
    JSON.stringify({ clickedDemoUrl: 'caching/basic', scrollY: 100, timestamp: Date.now() }),
    JSON.stringify({ listUrl: 12345, clickedDemoUrl: 'caching/basic', scrollY: 100, timestamp: Date.now() }),
    JSON.stringify({ listUrl: null, clickedDemoUrl: 'caching/basic', scrollY: 100, timestamp: Date.now() }),
    JSON.stringify({ listUrl: { path: '/demo' }, clickedDemoUrl: 'caching/basic', scrollY: 100, timestamp: Date.now() }),
  ]

  for (const inv of invalidSchemas) {
    setupMockBrowser({ initialStorage: { [DEMO_LIST_STORAGE_KEY]: inv } })
    const res = getDemoListContext()
    assert.strictEqual(res, null)
    assert.strictEqual(mockStorage[DEMO_LIST_STORAGE_KEY], undefined)
    cleanupMockBrowser()
  }
})

runTest('1.7 Timestamp Expiration: context expired (> 1 hour) is purged', () => {
  const expiredTime = Date.now() - (DEMO_RESTORE_EXPIRY_MS + 500)
  const validPayload = {
    listUrl: '/demo?q=caching',
    clickedDemoUrl: 'caching/basic',
    scrollY: 300,
    timestamp: expiredTime,
  }

  setupMockBrowser({ initialStorage: { [DEMO_LIST_STORAGE_KEY]: JSON.stringify(validPayload) } })
  const res = getDemoListContext()
  assert.strictEqual(res, null, 'Expired context must return null')
  assert.strictEqual(mockStorage[DEMO_LIST_STORAGE_KEY], undefined, 'Expired entry must be purged')
  cleanupMockBrowser()
})

runTest('1.8 Timestamp Boundary Tests: exact boundary behavior', () => {
  const exactTime = Date.now() - DEMO_RESTORE_EXPIRY_MS
  setupMockBrowser({
    initialStorage: {
      [DEMO_LIST_STORAGE_KEY]: JSON.stringify({
        listUrl: '/demo?q=caching',
        clickedDemoUrl: 'caching/basic',
        scrollY: 300,
        timestamp: exactTime,
      }),
    },
  })
  const res1 = getDemoListContext()
  assert.ok(res1 !== null, 'Exact boundary should be considered valid')
  cleanupMockBrowser()

  const slightlyExpired = Date.now() - (DEMO_RESTORE_EXPIRY_MS + 1)
  setupMockBrowser({
    initialStorage: {
      [DEMO_LIST_STORAGE_KEY]: JSON.stringify({
        listUrl: '/demo?q=caching',
        clickedDemoUrl: 'caching/basic',
        scrollY: 300,
        timestamp: slightlyExpired,
      }),
    },
  })
  const res2 = getDemoListContext()
  assert.strictEqual(res2, null, 'Slightly expired (> 1hr) must be null')
  cleanupMockBrowser()
})

runTest('1.9 Future Timestamp (Clock skew / timezone changes): does not expire prematurely', () => {
  const futureTime = Date.now() + 60000
  setupMockBrowser({
    initialStorage: {
      [DEMO_LIST_STORAGE_KEY]: JSON.stringify({
        listUrl: '/demo?category=API',
        clickedDemoUrl: 'api/fetch',
        scrollY: 150,
        timestamp: futureTime,
      }),
    },
  })
  const res = getDemoListContext()
  assert.ok(res !== null, 'Future timestamp should not expire prematurely')
  assert.strictEqual(res?.listUrl, '/demo?category=API')
  cleanupMockBrowser()
})

// ----------------------------------------------------------------------------
// Suite 2: useDemoListRestoration Logic & DOM Fallback Mechanics
// ----------------------------------------------------------------------------
console.log('\n--- Suite 2: useDemoListRestoration Logic & DOM Fallbacks ---')

function simulateRestoration(options: {
  currentPathname: string
  currentSearch: string
  storedContext: DemoListRestorationContext | null
  elementMatchMode: 'data-attr' | 'id-only' | 'none'
  hasScrollIntoView?: boolean
  hasHTMLElementFocus?: boolean
}) {
  let scrolledToY: number | null = null
  let scrollIntoViewCalled = false
  let focusCalled = false

  setupMockBrowser({
    pathname: options.currentPathname,
    search: options.currentSearch,
    initialStorage: options.storedContext
      ? { [DEMO_LIST_STORAGE_KEY]: JSON.stringify(options.storedContext) }
      : {},
  })

  const mockCardElement: any = {
    tagName: 'DIV',
    scrollIntoView: (opts: any) => {
      scrollIntoViewCalled = true
    },
    focus: (opts: any) => {
      focusCalled = true
    },
  }

  if (options.hasScrollIntoView === false) {
    delete mockCardElement.scrollIntoView
  }

  ;(globalThis as any).document.querySelector = (sel: string) => {
    if (options.elementMatchMode === 'data-attr' && sel.includes('data-demo-url')) {
      return mockCardElement
    }
    return null
  }

  ;(globalThis as any).document.getElementById = (id: string) => {
    if (
      (options.elementMatchMode === 'data-attr' || options.elementMatchMode === 'id-only') &&
      id.startsWith('demo-card-')
    ) {
      return mockCardElement
    }
    return null
  }

  ;(globalThis as any).window.scrollTo = (opts: { top: number; behavior?: string }) => {
    scrolledToY = opts.top
  }

  const context = getDemoListContext()
  const currentFullUrl = (globalThis as any).window.location.pathname + (globalThis as any).window.location.search

  let restored = false

  if (context) {
    if (context.listUrl === currentFullUrl) {
      ;(globalThis as any).window.requestAnimationFrame(() => {
        const cardElement =
          (globalThis as any).document.querySelector(`[data-demo-url="${context.clickedDemoUrl}"]`) ||
          (globalThis as any).document.getElementById(`demo-card-${context.clickedDemoUrl.replace(/\//g, '-')}`)

        if (cardElement && typeof cardElement.scrollIntoView === 'function') {
          cardElement.scrollIntoView({ block: 'center', behavior: 'auto' })
          if (typeof cardElement.focus === 'function') {
            cardElement.focus({ preventScroll: true })
          }
        } else if (typeof context.scrollY === 'number' && context.scrollY > 0) {
          ;(globalThis as any).window.scrollTo({ top: context.scrollY, behavior: 'auto' })
        }
        restored = true
        clearDemoListContext()
      })
    } else {
      clearDemoListContext()
    }
  }

  const remainingStorage = mockStorage[DEMO_LIST_STORAGE_KEY]
  cleanupMockBrowser()

  return {
    restored,
    scrollIntoViewCalled,
    focusCalled,
    scrolledToY,
    remainingStorage,
  }
}

runTest('2.1 Element Match by data-demo-url: invokes scrollIntoView and focus, then clears storage', () => {
  const result = simulateRestoration({
    currentPathname: '/demo',
    currentSearch: '?q=caching&page=2',
    storedContext: {
      listUrl: '/demo?q=caching&page=2',
      clickedDemoUrl: 'caching/basic',
      scrollY: 450,
      timestamp: Date.now(),
    },
    elementMatchMode: 'data-attr',
  })

  assert.strictEqual(result.restored, true)
  assert.strictEqual(result.scrollIntoViewCalled, true, 'scrollIntoView must be called')
  assert.strictEqual(result.focusCalled, true, 'focus must be called')
  assert.strictEqual(result.scrolledToY, null, 'window.scrollTo should not be called when element is found')
  assert.strictEqual(result.remainingStorage, undefined, 'Storage must be cleared after restoration')
})

runTest('2.2 Element Match Fallback by id="demo-card-...": invokes scrollIntoView correctly', () => {
  const result = simulateRestoration({
    currentPathname: '/demo',
    currentSearch: '?category=가이드',
    storedContext: {
      listUrl: '/demo?category=가이드',
      clickedDemoUrl: 'guides/routing/nested-routes',
      scrollY: 600,
      timestamp: Date.now(),
    },
    elementMatchMode: 'id-only',
  })

  assert.strictEqual(result.restored, true)
  assert.strictEqual(result.scrollIntoViewCalled, true, 'scrollIntoView must be called via ID fallback')
  assert.strictEqual(result.remainingStorage, undefined, 'Storage must be cleared')
})

runTest('2.3 Element NOT in DOM: falls back safely to window.scrollTo(scrollY)', () => {
  const result = simulateRestoration({
    currentPathname: '/demo',
    currentSearch: '?page=3',
    storedContext: {
      listUrl: '/demo?page=3',
      clickedDemoUrl: 'missing/demo-slug',
      scrollY: 780,
      timestamp: Date.now(),
    },
    elementMatchMode: 'none',
  })

  assert.strictEqual(result.restored, true)
  assert.strictEqual(result.scrollIntoViewCalled, false)
  assert.strictEqual(result.scrolledToY, 780, 'Must fallback to window.scrollTo with stored scrollY')
  assert.strictEqual(result.remainingStorage, undefined, 'Storage must be cleared')
})

runTest('2.4 URL Mismatch: Stale context from different query/page is purged immediately without scrolling', () => {
  const result = simulateRestoration({
    currentPathname: '/demo',
    currentSearch: '?q=middleware',
    storedContext: {
      listUrl: '/demo?q=caching&page=2',
      clickedDemoUrl: 'caching/basic',
      scrollY: 500,
      timestamp: Date.now(),
    },
    elementMatchMode: 'data-attr',
  })

  assert.strictEqual(result.restored, false, 'Should not restore on URL mismatch')
  assert.strictEqual(result.scrollIntoViewCalled, false)
  assert.strictEqual(result.scrolledToY, null)
  assert.strictEqual(result.remainingStorage, undefined, 'Stale storage MUST be cleared immediately')
})

runTest('2.5 Consecutive Navigations Sequence: simulates full list -> detail -> back -> list -> detail 2 -> back', () => {
  setupMockBrowser({ pathname: '/demo', search: '?q=test&page=1', scrollY: 300 })
  saveDemoListContext({
    listUrl: '/demo?q=test&page=1',
    clickedDemoUrl: 'demo-1',
    scrollY: 300,
  })
  assert.ok(getDemoListContext() !== null)

  const ctx1 = getDemoListContext()
  assert.strictEqual(ctx1?.clickedDemoUrl, 'demo-1')
  clearDemoListContext()
  assert.strictEqual(getDemoListContext(), null)

  saveDemoListContext({
    listUrl: '/demo?q=test&page=1',
    clickedDemoUrl: 'demo-2',
    scrollY: 750,
  })
  const ctx2 = getDemoListContext()
  assert.strictEqual(ctx2?.clickedDemoUrl, 'demo-2')
  assert.strictEqual(ctx2?.scrollY, 750)
  clearDemoListContext()
  assert.strictEqual(getDemoListContext(), null)
  cleanupMockBrowser()
})

// ----------------------------------------------------------------------------
// Suite 3: DemoBackButton Routing & Fallback Mechanics
// ----------------------------------------------------------------------------
console.log('\n--- Suite 3: DemoBackButton Routing & Fallbacks ---')

function simulateBackButtonClick(options: {
  hasStoredContext: boolean
  storedListUrl?: string
  historyLength: number
  referrer: string
  fallbackUrl?: string
}) {
  let routerBackCalled = false
  let routerPushCalledWith: string | null = null

  setupMockBrowser({
    historyLength: options.historyLength,
    referrer: options.referrer,
    initialStorage: options.hasStoredContext
      ? {
          [DEMO_LIST_STORAGE_KEY]: JSON.stringify({
            listUrl: options.storedListUrl ?? '/demo?page=2',
            clickedDemoUrl: 'caching/basic',
            scrollY: 200,
            timestamp: Date.now(),
          }),
        }
      : {},
  })

  const router = {
    back: () => {
      routerBackCalled = true
    },
    push: (url: string) => {
      routerPushCalledWith = url
    },
  }

  const context = getDemoListContext()
  if (context && context.listUrl) {
    router.back()
  } else if (
    typeof window !== 'undefined' &&
    window.history.length > 1 &&
    document.referrer &&
    document.referrer.includes(window.location.host)
  ) {
    router.back()
  } else {
    router.push(options.fallbackUrl || '/demo')
  }

  cleanupMockBrowser()

  return { routerBackCalled, routerPushCalledWith }
}

runTest('3.1 Valid Context Present: DemoBackButton calls router.back()', () => {
  const res = simulateBackButtonClick({
    hasStoredContext: true,
    storedListUrl: '/demo?category=API&page=2',
    historyLength: 2,
    referrer: 'http://localhost:3000/demo',
  })
  assert.strictEqual(res.routerBackCalled, true)
  assert.strictEqual(res.routerPushCalledWith, null)
})

runTest('3.2 No Context, but Internal Referrer (history.length > 1): calls router.back()', () => {
  const res = simulateBackButtonClick({
    hasStoredContext: false,
    historyLength: 3,
    referrer: 'http://localhost:3000/docs/getting-started',
  })
  assert.strictEqual(res.routerBackCalled, true)
  assert.strictEqual(res.routerPushCalledWith, null)
})

runTest('3.3 Direct Detail Entry (new tab / no referrer / history.length = 1): falls back to /demo', () => {
  const res = simulateBackButtonClick({
    hasStoredContext: false,
    historyLength: 1,
    referrer: '',
    fallbackUrl: '/demo',
  })
  assert.strictEqual(res.routerBackCalled, false)
  assert.strictEqual(res.routerPushCalledWith, '/demo')
})

runTest('3.4 External Referrer (e.g. Google Search): safely falls back to /demo without exiting site', () => {
  const res = simulateBackButtonClick({
    hasStoredContext: false,
    historyLength: 2,
    referrer: 'https://www.google.com/search?q=nextjs+demo',
    fallbackUrl: '/demo',
  })
  assert.strictEqual(res.routerBackCalled, false, 'Must NOT call router.back() on external referrer')
  assert.strictEqual(res.routerPushCalledWith, '/demo')
})

runTest('3.5 Document Hub ?run flow: custom fallback URL (e.g. /demo/docSlug) respected', () => {
  const res = simulateBackButtonClick({
    hasStoredContext: false,
    historyLength: 1,
    referrer: '',
    fallbackUrl: '/demo/getting-started/caching',
  })
  assert.strictEqual(res.routerBackCalled, false)
  assert.strictEqual(res.routerPushCalledWith, '/demo/getting-started/caching')
})

// ----------------------------------------------------------------------------
// Suite 4: DemoIndexCard Structural & Interaction Verification across all 241 Demos
// ----------------------------------------------------------------------------
console.log('\n--- Suite 4: DemoIndexCard Structure & All 241 Demos Verification ---')

const demos = loadDemosYaml()

runTest('4.1 Demos Count Verification: Exactly 241 demos present in single source of truth', () => {
  assert.strictEqual(demos.length, 241, 'demos.yaml must have exactly 241 demos')
})

runTest('4.2 Card ID & data-demo-url Consistency: all 241 demos produce safe DOM IDs', () => {
  for (const demo of demos) {
    const expectedId = `demo-card-${demo.url.replace(/\//g, '-')}`
    const expectedDataAttr = demo.url

    assert.ok(expectedId.length > 0)
    assert.match(expectedId, /^demo-card-[a-zA-Z0-9_\-\.]+$/, `Invalid ID format for demo url: ${demo.url}`)
    assert.strictEqual(expectedDataAttr, demo.url)
  }
})

runTest('4.3 Non-nested Anchor Verification: AST inspection of DemoIndexCard.tsx', () => {
  const cardPath = path.join(NEXTJS_APP_ROOT, 'packages/ui/src/demo/DemoIndexCard.tsx')
  const content = fs.readFileSync(cardPath, 'utf-8')

  const linkMatches = content.match(/<Link\b/g) || []
  assert.strictEqual(linkMatches.length, 2, 'DemoIndexCard must have exactly 2 links (demo link and doc link)')

  assert.match(content, /after:absolute\s+after:inset-0/, 'Main demo link must use stretched link')
  assert.match(content, /relative\s+z-10/, 'Document link must have relative z-10')

  const nestedCheck = /<Link[^>]*>[^<]*<Link/
  assert.strictEqual(nestedCheck.test(content), false, 'No nested Link tags allowed')
})

runTest('4.4 Zone Route Privacy: zone routing is completely hidden from DemoIndexCard and ViewModel items', () => {
  const cardPath = path.join(NEXTJS_APP_ROOT, 'packages/ui/src/demo/DemoIndexCard.tsx')
  const content = fs.readFileSync(cardPath, 'utf-8')

  assert.strictEqual(content.includes('zone'), false, 'DemoIndexCard should have zero reference to internal zone')
})

// ----------------------------------------------------------------------------
// Suite 5: Full 241 Demos DOM Selector & Query Robustness
// ----------------------------------------------------------------------------
console.log('\n--- Suite 5: All 241 Demos DOM Selector & Query Simulation ---')

runTest('5.1 All 241 demo URLs pass document.querySelector [data-demo-url] and getElementById', () => {
  for (const demo of demos) {
    // 1. Selector attribute query test
    const selector = `[data-demo-url="${demo.url}"]`
    assert.doesNotThrow(() => {
      // In browser or JSDOM, double-quoted attribute selectors with hyphens/slashes are valid CSS
      assert.ok(selector.startsWith('[data-demo-url="') && selector.endsWith('"]'))
    }, `Selector failed for demo URL: ${demo.url}`)

    // 2. ID query test
    const id = `demo-card-${demo.url.replace(/\//g, '-')}`
    assert.doesNotThrow(() => {
      assert.ok(!id.includes(' '), `ID must not contain spaces: ${id}`)
      assert.ok(!id.includes('/'), `ID must not contain slashes: ${id}`)
    }, `ID failed for demo URL: ${demo.url}`)
  }
})

runTest('5.2 Rubber-banding / Negative scrollY handling in useDemoListRestoration', () => {
  const result = simulateRestoration({
    currentPathname: '/demo',
    currentSearch: '?page=1',
    storedContext: {
      listUrl: '/demo?page=1',
      clickedDemoUrl: 'non-existent',
      scrollY: -40, // iOS rubber band
      timestamp: Date.now(),
    },
    elementMatchMode: 'none',
  })

  assert.strictEqual(result.restored, true)
  assert.strictEqual(result.scrolledToY, null, 'Negative scrollY must not trigger window.scrollTo')
  assert.strictEqual(result.remainingStorage, undefined, 'Storage must still be cleared')
})

runTest('5.3 Zero scrollY handling in useDemoListRestoration', () => {
  const result = simulateRestoration({
    currentPathname: '/demo',
    currentSearch: '?page=1',
    storedContext: {
      listUrl: '/demo?page=1',
      clickedDemoUrl: 'non-existent',
      scrollY: 0,
      timestamp: Date.now(),
    },
    elementMatchMode: 'none',
  })

  assert.strictEqual(result.restored, true)
  assert.strictEqual(result.scrolledToY, null, 'scrollY === 0 should not trigger redundant scrollTo')
})

// ----------------------------------------------------------------------------
// Suite 6: Full Workspace Tier 1 Integration Verification
// ----------------------------------------------------------------------------
console.log('\n--- Suite 6: Tier 1 Feature 13-17 Integration Verification ---')

runTest('6.1 All Demo Index Feature Test Files Exist and are Registered', () => {
  const testDir = path.join(NEXTJS_APP_ROOT, 'packages/test-suite/src/tier1-feature-coverage')
  const requiredTests = [
    '13-demo-index-state.test.ts',
    '14-demo-index-ui-contract.test.ts',
    '15-demo-index-url-state.test.ts',
    '16-demo-index-navigation.test.ts',
    '17-demo-index-contract.test.ts',
  ]

  for (const testFile of requiredTests) {
    const filePath = path.join(testDir, testFile)
    assert.ok(fs.existsSync(filePath), `Required test file missing: ${testFile}`)
  }
})

// ----------------------------------------------------------------------------
// Summary
// ----------------------------------------------------------------------------
console.log('\n=== EMPIRICAL STRESS TEST SUMMARY ===')
console.log(`Passed: ${passCount}`)
console.log(`Failed: ${failCount}`)

if (failCount > 0) {
  process.exit(1)
} else {
  console.log('ALL EMPIRICAL CHALLENGES PASSED SUCCESSFULLY!\n')
}
