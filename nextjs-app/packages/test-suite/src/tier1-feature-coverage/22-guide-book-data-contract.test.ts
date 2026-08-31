import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import type { Demo } from '@study/demos'
import type { DocsManifest } from '../../../../apps/shell/src/lib/manifest.ts'
import { createDemoIndexCardItems } from '../../../../apps/shell/src/lib/demo-index-items.ts'
import { createGuideBookItems } from '../../../../apps/shell/src/lib/guide-books.ts'
import { DOCS_ROOT, loadDemosYaml } from '../utils/test-helpers.ts'

const demos = loadDemosYaml()
const manifest = JSON.parse(
  fs.readFileSync(path.join(DOCS_ROOT, 'docs-manifest.json'), 'utf-8'),
) as DocsManifest

describe('Tier 1: Guide book data contract', () => {
  it('keeps representative demo-card fields while resolving every current manifest record', () => {
    const items = createDemoIndexCardItems(demos, manifest)
    const serverActions = items.find((item) => item.id === 'server-actions/basic')

    assert.deepStrictEqual(serverActions, {
      id: 'server-actions/basic',
      title: 'Server Actions 기본 폼 처리 및 상태 변경',
      learnerUrl: '/demo/server-actions/basic',
      docTitle: 'Server Actions',
      docUrl: '/guides/server-actions',
      doc: '2-guides/server-actions.md',
      status: 'done',
      category: 'Guides',
    })
    assert.strictEqual(items.length, demos.length)
    assert.strictEqual(items.filter((item) => item.docUrl === '/').length, 0)
  })

  it('resolves direct and suffix manifest paths through the reusable mapping boundary', () => {
    const swr = demos.find((demo) => demo.url === 'guides/swr-polling')!
    const suffixDemo: Demo = { ...swr, url: 'guides/swr-suffix', doc: '2.15-client-side-data-fetching/swr.md' }
    const items = createDemoIndexCardItems([swr, suffixDemo], manifest)

    assert.deepStrictEqual(
      items.map((item) => item.docUrl),
      ['/guides/client-side-data-fetching/swr', '/guides/client-side-data-fetching/swr'],
    )
  })

  it('selects source-ordered Guide books with counts and omits unmapped documents', () => {
    const guideBooks = createGuideBookItems(createDemoIndexCardItems(demos, manifest))
    const serverActions = guideBooks.find((book) => book.guideUrl === '/guides/server-actions')
    const authentication = guideBooks.find((book) => book.guideUrl === '/guides/authentication')

    assert.strictEqual(serverActions?.demoCount, 3)
    assert.strictEqual(authentication?.demoCount, 3)
    assert.strictEqual(guideBooks.length, 5)
    assert.ok(guideBooks.every((book) => book.category === 'Guides'))
    assert.ok(guideBooks.every((book) => !('status' in book) && !('zone' in book)))
    assert.ok(guideBooks.every((book) => !JSON.stringify(book).includes('/zone/')))
    assert.ok(guideBooks.every((book, index) => index === 0 || guideBooks[index - 1].demoCount >= book.demoCount))

    const tied = createGuideBookItems([
      {
        id: 'first', title: 'First demo', learnerUrl: '/demo/first', docTitle: 'First guide',
        docUrl: '/guides/first', doc: '2-guides/first.md', status: 'stub', category: 'Guides',
      },
      {
        id: 'second', title: 'Second demo', learnerUrl: '/demo/second', docTitle: 'Second guide',
        docUrl: '/guides/second', doc: '2-guides/second.md', status: 'wip', category: 'Guides',
      },
      {
        id: 'invalid', title: 'Invalid demo', learnerUrl: '/demo/invalid', docTitle: 'Missing guide',
        docUrl: '/', doc: '2-guides/missing.md', status: 'done', category: 'Guides',
      },
    ], 2)

    assert.deepStrictEqual(tied.map((book) => book.guideUrl), ['/guides/first', '/guides/second'])
    assert.deepStrictEqual(tied[0], {
      guideTitle: 'First guide', guideUrl: '/guides/first', demoTitle: 'First demo',
      demoUrl: '/demo/first', demoPath: 'first', demoCount: 1, category: 'Guides',
    })
  })

  it('projects only internal guide document URLs', () => {
    const guideBooks = createGuideBookItems([
      {
        id: 'guide-index', title: 'Guide index demo', learnerUrl: '/demo/guide-index', docTitle: 'Guides',
        docUrl: '/guides', doc: '2-guides/index.md', status: 'done', category: 'Guides',
      },
      {
        id: 'guide-child', title: 'Guide child demo', learnerUrl: '/demo/guide-child', docTitle: 'Guide child',
        docUrl: '/guides/child', doc: '2-guides/child.md', status: 'done', category: 'Guides',
      },
      {
        id: 'zone', title: 'Zone demo', learnerUrl: '/demo/zone', docTitle: 'Zone',
        docUrl: '/zone/guides/child', doc: '2-guides/zone.md', status: 'done', category: 'Guides',
      },
      {
        id: 'other', title: 'Other demo', learnerUrl: '/demo/other', docTitle: 'Other',
        docUrl: '/api/reference', doc: '2-guides/other.md', status: 'done', category: 'Guides',
      },
      {
        id: 'protocol-relative', title: 'Protocol-relative demo', learnerUrl: '/demo/protocol-relative', docTitle: 'Protocol-relative',
        docUrl: '//guides/example.com', doc: '2-guides/protocol-relative.md', status: 'done', category: 'Guides',
      },
    ])

    assert.deepStrictEqual(guideBooks.map((book) => book.guideUrl), ['/guides', '/guides/child'])
  })
})
