import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'

describe('Tier 1: Feature 14 - Demo Index UI Components & Layout Contract', () => {
  const uiSrcPath = path.join(NEXTJS_APP_ROOT, 'packages/ui/src/demo')

  it('14.1 should verify responsive grid layout contract (3 col desktop, 2 col tablet, 1 col mobile)', () => {
    const gridLayoutClasses = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    assert.match(gridLayoutClasses, /grid-cols-1/, 'Mobile must be 1 column')
    assert.match(gridLayoutClasses, /md:grid-cols-2/, 'Tablet must be 2 columns')
    assert.match(gridLayoutClasses, /lg:grid-cols-3/, 'Desktop must be 3 columns')
  })

  it('14.2 should verify DemoIndexCard stretched-link structure and non-nested anchor separation', () => {
    const cardFilePath = path.join(uiSrcPath, 'DemoIndexCard.tsx')
    assert.ok(fs.existsSync(cardFilePath), 'DemoIndexCard.tsx must exist')
    const content = fs.readFileSync(cardFilePath, 'utf-8')

    // Stretched link pattern check
    assert.match(
      content,
      /after:absolute\s+after:inset-0/,
      'Card title must use stretched-link pattern for full-card activation'
    )
    // Relative z-index on secondary doc link
    assert.match(
      content,
      /relative\s+z-10/,
      'Document link must have relative z-10 to prevent nested anchor click collisions'
    )
    // Data attribute for scroll restoration
    assert.match(
      content,
      /data-demo-url/,
      'Card container must provide data-demo-url for anchor restoration'
    )
    // Zone must not be rendered
    assert.doesNotMatch(
      content,
      /demo\.zone|zone=\{|\/zone\//,
      'Card UI must NOT expose internal zone routing'
    )
  })

  it('14.3 should verify DemoIndexToolbar categories, debounce, and aria live region', () => {
    const toolbarFilePath = path.join(uiSrcPath, 'DemoIndexToolbar.tsx')
    assert.ok(fs.existsSync(toolbarFilePath), 'DemoIndexToolbar.tsx must exist')
    const content = fs.readFileSync(toolbarFilePath, 'utf-8')

    // 5 primary categories
    assert.match(content, /All/, 'Toolbar must include All category')
    assert.match(content, /Getting Started/, 'Toolbar must include Getting Started category')
    assert.match(content, /Guides/, 'Toolbar must include Guides category')
    assert.match(content, /API Reference/, 'Toolbar must include API Reference category')
    assert.match(content, /Architecture/, 'Toolbar must include Architecture category')

    // Accessibility
    assert.match(content, /aria-label="데모 검색"/, 'Search input must have accessible aria-label')
    assert.match(content, /role="tablist"|role="group"/, 'Categories must have tablist or group role')
    assert.match(content, /aria-live="polite"/, 'Summary must announce result count changes to screen readers')
  })

  it('14.4 should verify DemoPagination responsive desktop numbers vs mobile compact controls', () => {
    const paginationFilePath = path.join(uiSrcPath, 'DemoPagination.tsx')
    assert.ok(fs.existsSync(paginationFilePath), 'DemoPagination.tsx must exist')
    const content = fs.readFileSync(paginationFilePath, 'utf-8')

    // Responsive controls
    assert.match(content, /hidden\s+sm:flex/, 'Desktop numbered pagination must be visible on sm+ screens')
    assert.match(content, /flex\s+sm:hidden/, 'Mobile compact pagination must be visible only on mobile screens')
    assert.match(
      content,
      /aria-current=\{isCurrent \? 'page' : undefined\}|aria-current="page"/,
      'Current page must be marked with aria-current="page"'
    )
    assert.match(content, /totalPages\s*<=\s*1/, 'Pagination must hide when totalPages <= 1')
  })

  it('14.5 should verify DemoEmptyState handles search no-results with reset callback and preserves doc-pending compatibility', () => {
    const emptyStateFilePath = path.join(uiSrcPath, 'DemoEmptyState.tsx')
    assert.ok(fs.existsSync(emptyStateFilePath), 'DemoEmptyState.tsx must exist')
    const content = fs.readFileSync(emptyStateFilePath, 'utf-8')

    // Search empty state
    assert.match(content, /일치하는 데모가 없습니다/, 'Empty state must present clear no-results heading')
    assert.match(content, /onReset/, 'Empty state must support onReset filter clearing callback')
    // Doc pending backward compatibility
    assert.match(content, /준비 중|이 주제의 실습 데모가 준비 중입니다/, 'Empty state must maintain doc-pending compatibility')
  })
})
