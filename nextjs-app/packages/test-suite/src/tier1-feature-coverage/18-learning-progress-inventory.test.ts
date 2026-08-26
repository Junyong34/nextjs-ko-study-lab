import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  createLearningInventory,
  type LearningInventoryManifest,
} from '../../../../apps/shell/src/lib/learning-progress/inventory.ts'

const manifest: LearningInventoryManifest = {
  docs: [
    { path: 'README.md', url: '/', title: '홈', slug: [] },
    { path: '1-start/README.md', url: '/start', title: '시작', slug: ['start'] },
    { path: '1-start/install.md', url: '/start/install', title: '설치', slug: ['start', 'install'] },
    { path: '2-guides/cache.md', url: '/guides/cache', title: '캐시', slug: ['guides', 'cache'] },
  ],
  tree: [
    { title: '홈', path: 'README.md', url: '/' },
    {
      title: '시작하기',
      path: '1-start/README.md',
      url: '/start',
      children: [{ title: '설치', path: '1-start/install.md', url: '/start/install' }],
    },
    {
      title: '가이드',
      path: '2-guides/README.md',
      url: '/guides',
      children: [{ title: '캐시', path: '2-guides/cache.md', url: '/guides/cache' }],
    },
  ],
}

const demos = [
  { url: 'install/basic', title: '설치 데모', doc: '1-start/install.md', status: 'done' },
  { url: 'cache/draft', title: '캐시 초안', doc: '2-guides/cache.md', status: 'wip' },
] as const

describe('학습 기록 inventory', () => {
  it('사이드바 학습 문서만 포함하고 랜딩과 README는 제외한다', () => {
    const inventory = createLearningInventory(manifest, demos)

    assert.deepEqual(
      inventory.documents.map(({ key, category }) => ({ key, category })),
      [
        { key: '1-start/install.md', category: '시작하기' },
        { key: '2-guides/cache.md', category: '가이드' },
      ],
    )
  })

  it('done 데모만 연결 문서의 카테고리와 학습자 URL로 만든다', () => {
    const inventory = createLearningInventory(manifest, demos)

    assert.deepEqual(inventory.demos, [
      {
        kind: 'demo',
        key: 'install/basic',
        title: '설치 데모',
        url: '/demo/install/basic',
        category: '시작하기',
        docPath: '1-start/install.md',
      },
    ])
  })

  it('제목 변경은 key를 유지하고 경로 변경은 새 항목으로 취급한다', () => {
    const original = createLearningInventory(manifest, demos)
    const renamed = structuredClone(manifest)
    renamed.docs[2] = { ...renamed.docs[2], title: '설치하기' }
    renamed.tree[1].children![0] = { ...renamed.tree[1].children![0], title: '설치하기' }
    const moved = structuredClone(renamed)
    moved.docs[2] = { ...moved.docs[2], path: '1-start/setup.md' }
    moved.tree[1].children![0] = { ...moved.tree[1].children![0], path: '1-start/setup.md' }

    assert.equal(original.documents[0].key, createLearningInventory(renamed, demos).documents[0].key)
    assert.notEqual(original.documents[0].key, createLearningInventory(moved, demos).documents[0].key)
  })

  it('트리에 같은 문서가 반복돼도 canonical path당 한 항목만 만든다', () => {
    const duplicated = structuredClone(manifest)
    duplicated.tree[1].children!.push(structuredClone(duplicated.tree[1].children![0]))

    const inventory = createLearningInventory(duplicated, demos)
    assert.equal(inventory.documents.filter((item) => item.key === '1-start/install.md').length, 1)
  })
})
