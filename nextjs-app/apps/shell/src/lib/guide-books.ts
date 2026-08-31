import type { DemoIndexCardItem, DemoIndexCategory } from './demo-index-items.ts'

export interface GuideBookItem {
  guideTitle: string
  guideUrl: string
  demoTitle: string
  demoUrl: string
  demoPath: string
  demoCount: number
  category: DemoIndexCategory
}

function isInternalGuideUrl(url: string): boolean {
  return url === '/guides' || url.startsWith('/guides/')
}

/** Guides 데모를 문서별 대표 책으로 축약합니다. */
export function createGuideBookItems(
  items: DemoIndexCardItem[],
  limit = 5,
): GuideBookItem[] {
  const books = new Map<string, GuideBookItem>()

  for (const item of items) {
    if (item.category !== 'Guides' || !isInternalGuideUrl(item.docUrl)) continue

    const existing = books.get(item.docUrl)
    if (existing) {
      existing.demoCount += 1
      continue
    }

    books.set(item.docUrl, {
      guideTitle: item.docTitle,
      guideUrl: item.docUrl,
      demoTitle: item.title,
      demoUrl: item.learnerUrl,
      demoPath: item.id,
      demoCount: 1,
      category: item.category,
    })
  }

  return [...books.values()]
    .sort((first, second) => second.demoCount - first.demoCount)
    .slice(0, limit)
}
