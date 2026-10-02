import { describe, it, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { matchesVisualizeQuery } from '../../../../apps/shell/src/components/visualize/search.ts'
import { getVisualizeListContext, saveVisualizeListContext, VISUALIZE_LIST_STORAGE_KEY, VISUALIZE_RESTORE_EXPIRY_MS } from '../../../../apps/shell/src/components/visualize/list-storage.ts'

const entry = {
  title: 'ISR Cache Lifecycle', summary: '캐시와 갱신을 비교합니다.', description: '기존 응답을 먼저 반환합니다.',
  gridDescription: '요청과 재생성', badge: { label: 'Next.js · Caching' }, keywords: ['revalidateTag'],
}
const original = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage')
afterEach(() => {
  if (original) Object.defineProperty(globalThis, 'sessionStorage', original)
  else Reflect.deleteProperty(globalThis, 'sessionStorage')
})
function storage() {
  const values = new Map<string, string>()
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  } })
  return values
}

describe('Visualize search and optional restoration storage', () => {
  it('matches every term across fields, ignoring case and fullwidth characters', () => {
    assert.equal(matchesVisualizeQuery(entry, '  ＩＳＲ   캐시 revalidateTAG '), true)
    assert.equal(matchesVisualizeQuery(entry, 'ISR missing'), false)
    assert.equal(matchesVisualizeQuery(entry, 'Next.js 요청 기존'), true)
    assert.equal(matchesVisualizeQuery(entry, '   '), true)
  })
  it('round trips URL, selected item and scroll position', () => {
    storage()
    saveVisualizeListContext({ listUrl: '/visualize?q=cache&group=cache-components', selectedSlug: 'cache-tags', scrollY: 450 })
    assert.equal(getVisualizeListContext()?.selectedSlug, 'cache-tags')
    assert.equal(getVisualizeListContext()?.scrollY, 450)
  })
  it('rejects expired, malformed and external navigation contexts', () => {
    const values = storage()
    const valid = { listUrl: '/visualize?q=cache', selectedSlug: 'cache-tags', scrollY: 20, timestamp: Date.now() }
    for (const invalid of [
      { ...valid, timestamp: Date.now() - VISUALIZE_RESTORE_EXPIRY_MS - 1 },
      { ...valid, timestamp: Date.now() + 60000 },
      { ...valid, listUrl: 'https://example.com/visualize' },
      { ...valid, listUrl: '//example.com/visualize' },
      { ...valid, listUrl: '/demo' },
      { ...valid, scrollY: -1 },
      { ...valid, selectedSlug: 'invalid"selector' },
    ]) {
      values.set(VISUALIZE_LIST_STORAGE_KEY, JSON.stringify(invalid))
      assert.equal(getVisualizeListContext(), null)
      assert.equal(values.has(VISUALIZE_LIST_STORAGE_KEY), false)
    }
    values.set(VISUALIZE_LIST_STORAGE_KEY, '{broken')
    assert.equal(getVisualizeListContext(), null)
  })
  it('does not block navigation when sessionStorage is unavailable', () => {
    Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, get() { throw new Error('disabled') } })
    assert.doesNotThrow(() => saveVisualizeListContext({ listUrl: '/visualize', selectedSlug: 'cache-tags', scrollY: 0 }))
    assert.equal(getVisualizeListContext(), null)
  })
})
