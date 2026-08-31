import type { Demo, DemoStatus } from '@study/demos'
import type { DocsManifest } from './manifest'

export const DEMO_INDEX_CATEGORIES = [
  'All',
  'Getting Started',
  'Guides',
  'API Reference',
  'Architecture',
] as const

export type DemoIndexCategory = (typeof DEMO_INDEX_CATEGORIES)[number]

export interface DemoIndexCardItem {
  id: string
  title: string
  learnerUrl: string
  docTitle: string
  docUrl: string
  doc?: string
  status: DemoStatus | string
  category: DemoIndexCategory
}

/** 데모의 doc 경로를 기반으로 4대 카테고리를 판별합니다. */
export function getDemoCategory(demo: { doc: string }): DemoIndexCategory {
  const doc = demo.doc
  if (doc.startsWith('1-') || doc.startsWith('1-getting-started')) return 'Getting Started'
  if (doc.startsWith('2-') || doc.startsWith('2-guides')) return 'Guides'
  if (doc.startsWith('3-') || doc.startsWith('3-api-reference')) return 'API Reference'
  if (doc.startsWith('5-') || doc.startsWith('5-architecture')) return 'Architecture'
  return 'All'
}

/** 원본 데모와 문서 manifest를 카드가 소비하는 정규화 데이터로 변환합니다. */
export function createDemoIndexCardItems(
  demos: Demo[],
  docsManifest: DocsManifest | undefined,
): DemoIndexCardItem[] {
  const docs = docsManifest?.docs || []
  const docMap = new Map(docs.map((doc) => [doc.path, doc]))

  return demos.map((demo) => {
    const docEntry = docMap.get(demo.doc) || docs.find((doc) => doc.path.endsWith(demo.doc))
    return {
      id: demo.url,
      title: demo.title,
      learnerUrl: `/demo/${demo.url}`,
      docTitle: docEntry?.title ?? demo.doc,
      docUrl: docEntry?.url ?? '/',
      doc: demo.doc,
      status: demo.status,
      category: getDemoCategory(demo),
    }
  })
}
