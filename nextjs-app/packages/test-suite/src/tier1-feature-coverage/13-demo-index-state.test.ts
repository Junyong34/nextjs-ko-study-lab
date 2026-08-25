import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  parseDemoIndexQuery,
  createDemoIndexViewModel,
  getDemoCategory,
  computeSearchScore,
  buildDemoIndexUrl,
  DEMO_INDEX_PAGE_SIZE,
  DEMO_INDEX_CATEGORIES,
} from '../../../../apps/shell/src/lib/demo-index.ts'
import { loadDemosYaml, DOCS_ROOT } from '../utils/test-helpers.ts'

describe('Tier 1: Feature 13 - Demo Index Pure State & Discovery UX', () => {
  const demos = loadDemosYaml()
  const manifestRaw = fs.readFileSync(path.join(DOCS_ROOT, 'docs-manifest.json'), 'utf-8')
  const docsManifest = JSON.parse(manifestRaw)

  it('13.1 should return all 241 source-ordered demos on page 1 with 24 items for empty query', () => {
    const query = parseDemoIndexQuery({})
    const vm = createDemoIndexViewModel(demos, docsManifest, query)

    assert.strictEqual(vm.totalCount, 241, 'Total demo count must be exactly 241')
    assert.strictEqual(vm.totalPages, 11, '241 items at 24/page should yield 11 pages (ceil(241/24))')
    assert.strictEqual(vm.currentPage, 1, 'Default page must be 1')
    assert.strictEqual(vm.items.length, 24, 'First page must have exactly 24 items')
    assert.strictEqual(vm.pageSize, DEMO_INDEX_PAGE_SIZE)

    // Verify first item matches first entry in demos.yaml
    assert.strictEqual(vm.items[0].id, demos[0].url)
    assert.strictEqual(vm.items[0].title, demos[0].title)
  })

  it('13.2 should correctly categorize 100% of 241 demos into 4 major categories without orphaned entries', () => {
    const counts: Record<string, number> = {
      'Getting Started': 0,
      'Guides': 0,
      'API Reference': 0,
      'Architecture': 0,
    }
    for (const demo of demos) {
      const cat = getDemoCategory(demo)
      assert.ok(cat in counts, `Demo ${demo.url} must map to a known category, got ${cat}`)
      counts[cat]++
    }

    assert.strictEqual(counts['Getting Started'], 25, 'Getting Started must have 25 demos')
    assert.strictEqual(counts['Guides'], 77, 'Guides must have 77 demos')
    assert.strictEqual(counts['API Reference'], 135, 'API Reference must have 135 demos')
    assert.strictEqual(counts['Architecture'], 4, 'Architecture must have 4 demos')
    assert.strictEqual(
      counts['Getting Started'] + counts['Guides'] + counts['API Reference'] + counts['Architecture'],
      241,
      'Total categorized demos must equal 241'
    )
  })

  it('13.3 should filter strictly by category and calculate corresponding totalPages', () => {
    const categories = [
      { name: 'Getting Started', count: 25, pages: 2 },
      { name: 'Guides', count: 77, pages: 4 },
      { name: 'API Reference', count: 135, pages: 6 },
      { name: 'Architecture', count: 4, pages: 1 },
    ] as const

    for (const { name, count, pages } of categories) {
      const query = parseDemoIndexQuery({ category: name, page: '1' })
      const vm = createDemoIndexViewModel(demos, docsManifest, query)

      assert.strictEqual(vm.totalCount, count, `Category ${name} must have ${count} items`)
      assert.strictEqual(vm.totalPages, pages, `Category ${name} must have ${pages} totalPages`)
      for (const item of vm.items) {
        assert.strictEqual(item.category, name, `Item ${item.id} must have category ${name}`)
      }
    }
  })

  it('13.4 should search across title, learner URL, and related doc name', () => {
    // 1. Search by title fragment
    const vmTitle = createDemoIndexViewModel(demos, docsManifest, { q: '무효화', category: 'All', page: 1 })
    assert.ok(vmTitle.totalCount > 0, 'Searching by Korean title fragment should return results')
    assert.ok(vmTitle.items.some((i) => i.title.includes('무효화')))

    // 2. Search by URL fragment
    const vmUrl = createDemoIndexViewModel(demos, docsManifest, { q: 'server-actions', category: 'All', page: 1 })
    assert.ok(vmUrl.totalCount >= 3, 'Searching server-actions should match at least 3 demos')
    assert.ok(vmUrl.items.every((i) => i.learnerUrl.includes('server-actions') || i.title.toLowerCase().includes('server actions') || i.docTitle.toLowerCase().includes('server actions')))

    // 3. Search by doc path fragment
    const vmDoc = createDemoIndexViewModel(demos, docsManifest, { q: 'caching.md', category: 'All', page: 1 })
    assert.ok(vmDoc.totalCount > 0, 'Searching by doc name should find associated demos')
  })

  it('13.5 should prioritize exact match > prefix match > contains match with deterministic tie-break', () => {
    // Testing ranking tiers
    const exactScore = computeSearchScore('caching/basic', 'caching/basic', 'Caching', '/getting-started/caching', 'caching/basic')
    const prefixScore = computeSearchScore('caching/advanced', 'caching/advanced', 'Caching', '/getting-started/caching', 'caching')
    const containsScore = computeSearchScore('advanced-caching', 'advanced-caching', 'Caching', '/getting-started/caching', 'caching')

    assert.strictEqual(exactScore, 1, 'Exact match must score Tier 1 (1)')
    assert.strictEqual(prefixScore, 2, 'Prefix match must score Tier 2 (2)')
    assert.ok(containsScore !== null && containsScore >= 3, 'Contains match must score Tier 3 or 4')

    const vm = createDemoIndexViewModel(demos, docsManifest, { q: 'caching/basic', category: 'All', page: 1 })
    assert.strictEqual(vm.items[0].id, 'caching/basic', 'Exact match on URL must be ranked top (#1)')
  })

  it('13.6 should combine search query and category filter with AND semantics', () => {
    const vmCombined = createDemoIndexViewModel(demos, docsManifest, { q: 'caching', category: 'Guides', page: 1 })
    assert.ok(vmCombined.totalCount > 0, 'Cross filtering should produce valid results')
    for (const item of vmCombined.items) {
      assert.strictEqual(item.category, 'Guides', 'All returned items must belong to Guides category')
    }
  })

  it('13.7 should safely clamp page numbers (negative, zero, non-numeric, out-of-bounds)', () => {
    // Negative page
    const qNeg = parseDemoIndexQuery({ page: '-5' })
    assert.strictEqual(qNeg.page, 1, 'Negative page must parse as 1')

    // Zero page
    const qZero = parseDemoIndexQuery({ page: '0' })
    assert.strictEqual(qZero.page, 1, 'Zero page must parse as 1')

    // Non-numeric page
    const qNaN = parseDemoIndexQuery({ page: 'invalid' })
    assert.strictEqual(qNaN.page, 1, 'Non-numeric page must parse as 1')

    // Out-of-bounds page clamping in view model (also testing Korean fallback input)
    const vmClamped = createDemoIndexViewModel(demos, docsManifest, { q: '', category: 'Getting Started', page: 999 })
    assert.strictEqual(vmClamped.currentPage, 2, 'Out of bounds page 999 must clamp to max totalPages (2 for Getting Started)')
    assert.strictEqual(vmClamped.items.length, 1, 'Page 2 of Getting Started (25 items) must have 1 item')
  })

  it('13.8 should handle empty search results gracefully', () => {
    const vm = createDemoIndexViewModel(demos, docsManifest, { q: 'non-existent-xyz-search-query-12345', category: 'All', page: 1 })
    assert.strictEqual(vm.totalCount, 0, 'Total count must be 0')
    assert.strictEqual(vm.totalPages, 1, 'Total pages must be 1 on empty results')
    assert.strictEqual(vm.currentPage, 1, 'Current page must be 1')
    assert.strictEqual(vm.items.length, 0, 'Items array must be empty')
  })

  it('13.9 should strictly guarantee that internal zone field is never exposed in client view model items', () => {
    const vm = createDemoIndexViewModel(demos, docsManifest, { q: '', category: 'All', page: 1 })
    const serialized = JSON.stringify(vm)

    assert.strictEqual(serialized.includes('"zone":'), false, 'Serialized view model must not contain "zone":')
    for (const item of vm.items) {
      assert.strictEqual('zone' in item, false, `Item ${item.id} must not have 'zone' property`)
    }
  })

  it('13.10 should parse various query input shapes correctly and build clean URLs', () => {
    // Array query params (common in Next.js searchParams)
    const qArray = parseDemoIndexQuery({ q: ['routing', 'extra'], category: ['API Reference', 'other'], page: ['3'] })
    assert.strictEqual(qArray.q, 'routing')
    assert.strictEqual(qArray.category, 'API Reference')
    assert.strictEqual(qArray.page, 3)

    // URLSearchParams instance with Korean compatibility
    const searchParams = new URLSearchParams('q=middleware&category=가이드&page=2')
    const qParams = parseDemoIndexQuery(searchParams)
    assert.strictEqual(qParams.q, 'middleware')
    assert.strictEqual(qParams.category, 'Guides')
    assert.strictEqual(qParams.page, 2)

    // Unrecognized category
    const qBadCat = parseDemoIndexQuery({ category: 'unknown-category' })
    assert.strictEqual(qBadCat.category, 'All', 'Unknown category must fallback to All')

    // Clean URL builder
    assert.strictEqual(buildDemoIndexUrl({ q: '', category: 'All', page: 1 }), '/demo')
    assert.strictEqual(buildDemoIndexUrl({ q: 'cache' }), '/demo?q=cache')
    assert.strictEqual(buildDemoIndexUrl({ q: 'cache', category: 'Guides' }), '/demo?q=cache&category=Guides')
    assert.strictEqual(buildDemoIndexUrl({ q: 'cache', category: 'Guides', page: 2 }), '/demo?q=cache&category=Guides&page=2')
  })
})
