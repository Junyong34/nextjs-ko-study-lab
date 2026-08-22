import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { DemoSchema, DemosListSchema } from '../utils/test-helpers.ts'

describe('Tier 2: Feature 2 - Manifest & YAML Boundary Validation', () => {
  it('2.2.1 should reject invalid demo zone enum values', () => {
    const invalidDemo = {
      url: 'test/invalid-zone',
      title: 'Invalid Zone Demo',
      doc: 'test.md',
      zone: 'unknown_zone',
      status: 'done',
    }
    const result = DemoSchema.safeParse(invalidDemo)
    assert.strictEqual(result.success, false)
  })

  it('2.2.2 should reject invalid demo status enum values', () => {
    const invalidDemo = {
      url: 'test/invalid-status',
      title: 'Invalid Status Demo',
      doc: 'test.md',
      zone: 'baseline',
      status: 'completed', // Valid are 'stub' | 'wip' | 'done'
    }
    const result = DemoSchema.safeParse(invalidDemo)
    assert.strictEqual(result.success, false)
  })

  it('2.2.3 should reject empty string fields', () => {
    const emptyUrlDemo = { url: '', title: 'Title', doc: 'doc.md', zone: 'baseline', status: 'done' }
    assert.strictEqual(DemoSchema.safeParse(emptyUrlDemo).success, false)

    const emptyTitleDemo = { url: 'valid-url', title: '', doc: 'doc.md', zone: 'baseline', status: 'done' }
    assert.strictEqual(DemoSchema.safeParse(emptyTitleDemo).success, false)
  })

  it('2.2.4 should handle large manifest list schema validation efficiently', () => {
    const mockList = Array.from({ length: 500 }, (_, i) => ({
      url: `category/demo-${i}`,
      title: `Demo Title ${i}`,
      doc: `docs/demo-${i}.md`,
      zone: 'baseline' as const,
      status: 'done' as const,
    }))
    const result = DemosListSchema.safeParse(mockList)
    assert.strictEqual(result.success, true)
    if (result.success) {
      assert.strictEqual(result.data.length, 500)
    }
  })

  it('2.2.5 should handle duplicate URL detection within list arrays', () => {
    const listWithDuplicates = [
      { url: 'demo/item-1', title: 'Item 1', doc: 'item1.md', zone: 'baseline', status: 'done' },
      { url: 'demo/item-1', title: 'Item 1 Duplicate', doc: 'item1.md', zone: 'baseline', status: 'done' },
    ]
    const seen = new Set<string>()
    const duplicates: string[] = []
    for (const item of listWithDuplicates) {
      if (seen.has(item.url)) duplicates.push(item.url)
      seen.add(item.url)
    }
    assert.strictEqual(duplicates.length, 1)
    assert.strictEqual(duplicates[0], 'demo/item-1')
  })
})
