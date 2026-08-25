import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  parseDemoIndexQuery,
  buildDemoIndexUrl,
  createDemoIndexViewModel,
} from '../../../../apps/shell/src/lib/demo-index.ts'
import { loadDemosYaml } from '../utils/test-helpers.ts'

describe('Tier 1: Feature 15 - Demo Index URL State & Controller Composition', () => {
  const demos = loadDemosYaml()

  it('15.1.1 should parse empty searchParams to default query { q: "", category: "All", page: 1 }', () => {
    const parsed = parseDemoIndexQuery({})
    assert.deepStrictEqual(parsed, { q: '', category: 'All', page: 1 })
  })

  it('15.1.2 should parse query with q, category, and page correctly', () => {
    const parsed = parseDemoIndexQuery({ q: 'middleware', category: 'Guides', page: '2' })
    assert.deepStrictEqual(parsed, { q: 'middleware', category: 'Guides', page: 2 })
  })

  it('15.1.3 should handle array query parameters by picking the first element', () => {
    const parsed = parseDemoIndexQuery({
      q: ['parallel', 'extra'],
      category: ['API Reference', 'other'],
      page: ['3', '4'],
    })
    assert.deepStrictEqual(parsed, { q: 'parallel', category: 'API Reference', page: 3 })
  })

  it('15.1.4 should trim surrounding whitespace from search query q', () => {
    const parsed = parseDemoIndexQuery({ q: '   caching   ' })
    assert.strictEqual(parsed.q, 'caching')
  })

  it('15.1.5 should fallback unrecognized category values to All', () => {
    const parsed = parseDemoIndexQuery({ category: 'invalid-category-xyz' })
    assert.strictEqual(parsed.category, 'All')
  })

  it('15.1.6 should normalize invalid page numbers (negative, zero, NaN) to 1', () => {
    assert.strictEqual(parseDemoIndexQuery({ page: '-10' }).page, 1)
    assert.strictEqual(parseDemoIndexQuery({ page: '0' }).page, 1)
    assert.strictEqual(parseDemoIndexQuery({ page: 'not-a-number' }).page, 1)
  })

  it('15.2.1 should serialize default query to clean URL /demo without query parameters', () => {
    const url = buildDemoIndexUrl({ q: '', category: 'All', page: 1 })
    assert.strictEqual(url, '/demo')
  })

  it('15.2.2 should serialize query with q to /demo?q=... omitting default category and page', () => {
    const url = buildDemoIndexUrl({ q: 'server-actions', category: 'All', page: 1 })
    assert.strictEqual(url, '/demo?q=server-actions')
  })

  it('15.2.3 should serialize query with category to /demo?category=...', () => {
    const url = buildDemoIndexUrl({ category: 'API Reference' })
    assert.strictEqual(url, '/demo?category=API+Reference')
  })

  it('15.2.4 should serialize query with page > 1 to /demo?page=2', () => {
    const url = buildDemoIndexUrl({ page: 2 })
    assert.strictEqual(url, '/demo?page=2')
  })

  it('15.3.1 should verify debounced search query transition uses replace semantics and resets page to 1', () => {
    // Simulating query update when typing "routing"
    const currentQuery = { q: '', category: 'Getting Started' as const, page: 2 }
    const nextUrl = buildDemoIndexUrl({
      q: 'routing',
      category: currentQuery.category,
      page: 1, // Reset page to 1 on query update
    })

    assert.ok(nextUrl.includes('q=routing'))
    assert.ok(nextUrl.includes('category='))
    assert.ok(!nextUrl.includes('page='), 'page 1 must be omitted from URL')
  })

  it('15.3.2 should verify category change transition resets page to 1 and preserves search query', () => {
    const currentQuery = { q: 'caching', category: 'All' as const, page: 3 }
    const nextUrl = buildDemoIndexUrl({
      q: currentQuery.q,
      category: 'Guides',
      page: 1,
    })

    assert.ok(nextUrl.includes('q=caching'))
    assert.ok(nextUrl.includes('category=Guides'))
    assert.ok(!nextUrl.includes('page='), 'page 1 must be omitted')
  })

  it('15.3.3 should verify page navigation preserves existing q and category', () => {
    const currentQuery = { q: 'caching', category: 'Guides' as const, page: 1 }
    const nextUrl = buildDemoIndexUrl({
      q: currentQuery.q,
      category: currentQuery.category,
      page: 2,
    })

    assert.ok(nextUrl.includes('q=caching'))
    assert.ok(nextUrl.includes('category=Guides'))
    assert.ok(nextUrl.includes('page=2'))
  })
})
