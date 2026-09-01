import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { loadDemosYaml, NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'
import {
  createDemoIndexViewModel,
  parseDemoIndexQuery,
  DEMO_INDEX_PAGE_SIZE,
} from '../../../../apps/shell/src/lib/demo-index.ts'
import { DEMO_LIST_STORAGE_KEY } from '../../../../apps/shell/src/lib/demo-storage.ts'

describe('Tier 1: Feature 17 - Demo Index Design Doc Alignment & Final Contract Verification', () => {
  const demos = loadDemosYaml()
  const designDocPath = path.join(NEXTJS_APP_ROOT, 'docs/01-ui-and-screen-design.md')

  it('17.1 should verify 01-ui-and-screen-design.md reflects the 241 demos discovery UX contract', () => {
    assert.ok(fs.existsSync(designDocPath), '01-ui-and-screen-design.md must exist')
    const docContent = fs.readFileSync(designDocPath, 'utf-8')

    assert.match(docContent, /241개/, 'Doc must mention 241 demos')
    assert.match(docContent, /3\/2\/1\s*반응형/, 'Doc must mention 3/2/1 responsive grid')
    assert.match(docContent, /24개\s*고정/, 'Doc must state 24 items per page fixed')
    assert.match(docContent, /study_demo_list_context/, 'Doc must reference study_demo_list_context storage key')
    assert.match(docContent, /DemoBackButton/, 'Doc must document DemoBackButton history restoration')
  })

  it('17.2 should verify learner-facing URLs adhere strictly to /demo/* without exposing zone routes', () => {
    const vm = createDemoIndexViewModel(demos, undefined, parseDemoIndexQuery({}))
    for (const item of vm.items) {
      assert.ok(item.learnerUrl.startsWith('/demo/'), `Learner URL ${item.learnerUrl} must start with /demo/`)
      assert.doesNotMatch(item.learnerUrl, /\/zone\//, `Learner URL ${item.learnerUrl} must NOT expose /zone/`)
    }
  })

  it('17.3 should verify browser storage key uses study_ namespace prefix', () => {
    assert.strictEqual(DEMO_LIST_STORAGE_KEY, 'study_demo_list_context')
    assert.ok(DEMO_LIST_STORAGE_KEY.startsWith('study_'))
  })

  it('17.4 should verify all 241 demos are validly indexable with fixed page size 24', () => {
    assert.strictEqual(demos.length, 241)
    assert.strictEqual(DEMO_INDEX_PAGE_SIZE, 24)

    const vm = createDemoIndexViewModel(demos, undefined, { q: '', category: 'All', page: 1 })
    assert.strictEqual(vm.totalCount, 241)
    assert.strictEqual(vm.totalPages, 11)
    assert.strictEqual(vm.items.length, 24)
  })

  it('17.5 should verify @study/ui exports all required demo index discovery UI components', () => {
    const uiIndexPath = path.join(NEXTJS_APP_ROOT, 'packages/ui/src/demo/index.ts')
    const indexContent = fs.readFileSync(uiIndexPath, 'utf-8')

    assert.match(indexContent, /DemoIndexCard/)
    assert.match(indexContent, /DemoIndexToolbar/)
    assert.match(indexContent, /DemoPagination/)
    assert.match(indexContent, /DemoEmptyState/)
    assert.match(indexContent, /DemoPageHeader/)
  })
})
