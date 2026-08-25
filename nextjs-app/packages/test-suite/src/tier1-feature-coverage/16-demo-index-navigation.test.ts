import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  DEMO_LIST_STORAGE_KEY,
  DEMO_RESTORE_EXPIRY_MS,
  saveDemoListContext,
  getDemoListContext,
  clearDemoListContext,
} from '../../../../apps/shell/src/lib/demo-storage.ts'

describe('Tier 1: Feature 16 - Demo Index Navigation History & Scroll Restoration', () => {
  let mockStorage: Record<string, string> = {}

  beforeEach(() => {
    mockStorage = {}
    // Mock global window & sessionStorage for Node.js test environment
    ;(globalThis as any).window = {
      location: { pathname: '/demo', search: '?q=caching&page=2', host: 'localhost:3000' },
      history: { length: 2 },
      scrollY: 450,
    }
    ;(globalThis as any).sessionStorage = {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, val: string) => {
        mockStorage[key] = String(val)
      },
      removeItem: (key: string) => {
        delete mockStorage[key]
      },
      clear: () => {
        mockStorage = {}
      },
    }
  })

  afterEach(() => {
    delete (globalThis as any).window
    delete (globalThis as any).sessionStorage
  })

  it('16.1.1 should verify sessionStorage key adheres to study_ namespace prefix', () => {
    assert.strictEqual(DEMO_LIST_STORAGE_KEY, 'study_demo_list_context')
    assert.ok(DEMO_LIST_STORAGE_KEY.startsWith('study_'), 'Storage key must use study_ namespace')
  })

  it('16.1.2 should verify stored context payload schema contains listUrl, clickedDemoUrl, scrollY, timestamp', () => {
    saveDemoListContext({
      listUrl: '/demo?q=routing&page=1',
      clickedDemoUrl: 'routing/basic',
      scrollY: 320,
    })

    const raw = mockStorage[DEMO_LIST_STORAGE_KEY]
    assert.ok(raw, 'Raw storage value must exist')
    const parsed = JSON.parse(raw)

    assert.strictEqual(parsed.listUrl, '/demo?q=routing&page=1')
    assert.strictEqual(parsed.clickedDemoUrl, 'routing/basic')
    assert.strictEqual(parsed.scrollY, 320)
    assert.ok(typeof parsed.timestamp === 'number' && parsed.timestamp > 0)
  })

  it('16.1.3 should safely no-op during SSR without window/sessionStorage', () => {
    delete (globalThis as any).window
    delete (globalThis as any).sessionStorage

    assert.doesNotThrow(() => {
      saveDemoListContext({
        listUrl: '/demo',
        clickedDemoUrl: 'test',
        scrollY: 0,
      })
      const ctx = getDemoListContext()
      assert.strictEqual(ctx, null)
      clearDemoListContext()
    })
  })

  it('16.2.1 should retrieve valid non-expired context correctly', () => {
    saveDemoListContext({
      listUrl: '/demo?category=가이드',
      clickedDemoUrl: 'caching/on-demand',
      scrollY: 550,
    })

    const ctx = getDemoListContext()
    assert.ok(ctx !== null)
    assert.strictEqual(ctx?.listUrl, '/demo?category=가이드')
    assert.strictEqual(ctx?.clickedDemoUrl, 'caching/on-demand')
    assert.strictEqual(ctx?.scrollY, 550)
  })

  it('16.3.1 should verify history-aware back navigation priority over fallback', () => {
    saveDemoListContext({
      listUrl: '/demo?q=caching',
      clickedDemoUrl: 'caching/basic',
      scrollY: 100,
    })

    let backCalled = false
    let pushCalledWith = ''
    const router = {
      back: () => {
        backCalled = true
      },
      push: (url: string) => {
        pushCalledWith = url
      },
    }

    const context = getDemoListContext()
    if (context && context.listUrl) {
      router.back()
    } else {
      router.push('/demo')
    }

    assert.strictEqual(backCalled, true, 'router.back() must be called when context exists')
    assert.strictEqual(pushCalledWith, '', 'router.push should not be called')
  })

  it('16.3.2 should safely fallback to /demo when no navigation context exists', () => {
    clearDemoListContext()

    let backCalled = false
    let pushCalledWith = ''
    const router = {
      back: () => {
        backCalled = true
      },
      push: (url: string) => {
        pushCalledWith = url
      },
    }

    const context = getDemoListContext()
    if (context && context.listUrl) {
      router.back()
    } else {
      router.push('/demo')
    }

    assert.strictEqual(backCalled, false, 'router.back() should not be called')
    assert.strictEqual(pushCalledWith, '/demo', 'router.push should fallback to /demo')
  })

  it('16.4.1 should match listUrl with current URL for restoration', () => {
    const currentFullUrl = '/demo?q=caching&page=2'
    saveDemoListContext({
      listUrl: currentFullUrl,
      clickedDemoUrl: 'caching/basic',
      scrollY: 450,
    })

    const ctx = getDemoListContext()
    assert.strictEqual(ctx?.listUrl, currentFullUrl)
  })

  it('16.4.2 should clear context after consumption', () => {
    saveDemoListContext({
      listUrl: '/demo',
      clickedDemoUrl: 'routing/basic',
      scrollY: 150,
    })

    assert.ok(getDemoListContext() !== null)
    clearDemoListContext()
    assert.strictEqual(getDemoListContext(), null)
  })

  it('16.4.3 should discard stale context when navigating to a different query URL', () => {
    saveDemoListContext({
      listUrl: '/demo?q=caching',
      clickedDemoUrl: 'caching/basic',
      scrollY: 200,
    })

    const newUrl = '/demo?q=middleware'
    const ctx = getDemoListContext()
    if (ctx && ctx.listUrl !== newUrl) {
      clearDemoListContext()
    }

    assert.strictEqual(getDemoListContext(), null, 'Stale context must be cleared on URL mismatch')
  })

  it('16.4.4 should invalidate and purge context older than 1 hour (DEMO_RESTORE_EXPIRY_MS)', () => {
    const expiredTimestamp = Date.now() - (DEMO_RESTORE_EXPIRY_MS + 1000)
    mockStorage[DEMO_LIST_STORAGE_KEY] = JSON.stringify({
      listUrl: '/demo',
      clickedDemoUrl: 'caching/basic',
      scrollY: 100,
      timestamp: expiredTimestamp,
    })

    const ctx = getDemoListContext()
    assert.strictEqual(ctx, null, 'Expired context must return null')
    assert.strictEqual(mockStorage[DEMO_LIST_STORAGE_KEY], undefined, 'Expired entry must be purged from storage')
  })
})
