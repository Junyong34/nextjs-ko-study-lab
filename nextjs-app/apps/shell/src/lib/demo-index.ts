import type { Demo, DemoStatus } from '@study/demos'
import type { DocsManifest } from './manifest'

export const DEMO_INDEX_PAGE_SIZE = 24

export const DEMO_INDEX_CATEGORIES = [
  'All',
  'Getting Started',
  'Guides',
  'API Reference',
  'Architecture',
] as const

export type DemoIndexCategory = (typeof DEMO_INDEX_CATEGORIES)[number]

export interface DemoIndexQuery {
  q: string
  category: DemoIndexCategory
  page: number
}

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

export interface DemoIndexViewModel {
  items: DemoIndexCardItem[]
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
  query: DemoIndexQuery
  categories: readonly DemoIndexCategory[]
  allCount: number
  allDoneCount: number
}

/**
 * 데모의 doc 경로를 기반으로 4대 카테고리('Getting Started' | 'Guides' | 'API Reference' | 'Architecture')를 판별합니다.
 */
export function getDemoCategory(demo: { doc: string }): DemoIndexCategory {
  const doc = demo.doc
  if (doc.startsWith('1-') || doc.startsWith('1-getting-started')) return 'Getting Started'
  if (doc.startsWith('2-') || doc.startsWith('2-guides')) return 'Guides'
  if (doc.startsWith('3-') || doc.startsWith('3-api-reference')) return 'API Reference'
  if (doc.startsWith('5-') || doc.startsWith('5-architecture')) return 'Architecture'
  return 'All'
}

/**
 * Next.js searchParams 객체 또는 URLSearchParams를 파싱하여 표준 DemoIndexQuery로 정규화합니다.
 */
export function parseDemoIndexQuery(
  searchParams?: Record<string, string | string[] | undefined> | URLSearchParams | undefined
): DemoIndexQuery {
  const getParam = (key: string): string | undefined => {
    if (!searchParams) return undefined
    if (typeof (searchParams as URLSearchParams).get === 'function') {
      return (searchParams as URLSearchParams).get(key) ?? undefined
    }
    const val = (searchParams as Record<string, string | string[] | undefined>)[key]
    if (Array.isArray(val)) return val[0]
    return val
  }

  const rawQ = getParam('q')
  const q = typeof rawQ === 'string' ? rawQ.trim() : ''

  const rawCat = getParam('category')
  let category: DemoIndexCategory = 'All'
  if (typeof rawCat === 'string') {
    const trimmed = rawCat.trim()
    if ((DEMO_INDEX_CATEGORIES as readonly string[]).includes(trimmed)) {
      category = trimmed as DemoIndexCategory
    } else if (trimmed === '전체' || trimmed.toLowerCase() === 'all') {
      category = 'All'
    } else if (trimmed === '시작하기' || trimmed.toLowerCase() === 'getting-started' || trimmed.toLowerCase() === 'getting started') {
      category = 'Getting Started'
    } else if (trimmed === '가이드' || trimmed.toLowerCase() === 'guides' || trimmed.toLowerCase() === 'guide') {
      category = 'Guides'
    } else if (trimmed === 'API' || trimmed.toLowerCase() === 'api' || trimmed.toLowerCase() === 'api-reference' || trimmed.toLowerCase() === 'api reference') {
      category = 'API Reference'
    } else if (trimmed === '아키텍처' || trimmed.toLowerCase() === 'architecture') {
      category = 'Architecture'
    }
  }

  const rawPage = getParam('page')
  let page = 1
  if (rawPage !== undefined) {
    const parsed = parseInt(String(rawPage), 10)
    if (!isNaN(parsed) && parsed >= 1) {
      page = Math.floor(parsed)
    }
  }

  return { q, category, page }
}

/**
 * DemoIndexQuery 객체를 클린 URL 경로로 직렬화합니다.
 * 기본값(q: '', category: 'All', page: 1)은 URL에서 생략합니다.
 */
export function buildDemoIndexUrl(query: Partial<DemoIndexQuery>): string {
  const params = new URLSearchParams()
  if (query.q && query.q.trim().length > 0) {
    params.set('q', query.q.trim())
  }
  if (
    query.category &&
    query.category !== 'All' &&
    (DEMO_INDEX_CATEGORIES as readonly string[]).includes(query.category)
  ) {
    params.set('category', query.category)
  }
  if (query.page && query.page > 1) {
    params.set('page', String(query.page))
  }
  const qs = params.toString()
  return qs ? `/demo?${qs}` : '/demo'
}

/**
 * 검색어 매칭 점수를 계산합니다.
 * 점수가 낮을수록 상위 랭킹(1: 완전일치 > 2: 접두일치 > 3: 단어/세그먼트 접두일치 > 4: 포함일치, null: 불일치)
 */
export function computeSearchScore(
  title: string,
  url: string,
  docTitle: string,
  docUrl: string,
  qLower: string,
  docPath?: string
): number | null {
  const t = title.toLowerCase()
  const u = url.toLowerCase()
  const dt = docTitle.toLowerCase()
  const du = docUrl.toLowerCase()
  const dp = (docPath ?? '').toLowerCase()

  // Tier 1: Exact match on title or url
  if (t === qLower || u === qLower) return 1

  // Tier 2: Prefix match on title or url
  if (t.startsWith(qLower) || u.startsWith(qLower)) return 2

  // Tier 3: Segment / word prefix match or doc title prefix
  if (
    u.split('/').some((seg) => seg.startsWith(qLower)) ||
    t.split(/\s+/).some((w) => w.startsWith(qLower)) ||
    dt.startsWith(qLower)
  ) {
    return 3
  }

  // Tier 4: Contains match anywhere
  if (
    t.includes(qLower) ||
    u.includes(qLower) ||
    dt.includes(qLower) ||
    du.includes(qLower) ||
    dp.includes(qLower)
  ) {
    return 4
  }

  return null
}

/**
 * 원본 데모 목록과 DocsManifest를 기반으로 검색, 카테고리 필터링, 관련도 정렬, 24개 단위 페이지네이션을 적용한 뷰 모델을 생성합니다.
 * 내부 'zone' 필드는 클라이언트에 노출되지 않도록 완전히 제거됩니다.
 */
export function createDemoIndexViewModel(
  demos: Demo[],
  docsManifest: DocsManifest | undefined,
  query: DemoIndexQuery
): DemoIndexViewModel {
  const docMap = new Map((docsManifest?.docs || []).map((d) => [d.path, d]))

  const allItems: (DemoIndexCardItem & { originalIndex: number })[] = demos.map((demo, idx) => {
    const docEntry =
      docMap.get(demo.doc) ||
      (docsManifest?.docs || []).find((d) => d.path.endsWith(demo.doc))
    const category = getDemoCategory(demo)
    return {
      id: demo.url,
      title: demo.title,
      learnerUrl: `/demo/${demo.url}`,
      docTitle: docEntry?.title ?? demo.doc,
      docUrl: docEntry?.url ?? '/',
      doc: demo.doc,
      status: demo.status,
      category,
      originalIndex: idx,
    }
  })

  const allCount = demos.length
  const allDoneCount = demos.filter((d) => d.status === 'done').length

  // 1. 카테고리 필터링
  let filtered = allItems
  if (query.category && query.category !== 'All' && (query.category as string) !== '전체') {
    let targetCat: string = query.category
    if (targetCat === '시작하기') targetCat = 'Getting Started'
    else if (targetCat === '가이드') targetCat = 'Guides'
    else if (targetCat === 'API') targetCat = 'API Reference'
    else if (targetCat === '아키텍처') targetCat = 'Architecture'

    filtered = filtered.filter((item) => item.category === targetCat)
  }

  // 2. 검색어 필터링 및 관련도 랭킹
  const qTrim = query.q.trim().toLowerCase()
  if (qTrim !== '') {
    const scored: { item: (typeof allItems)[number]; score: number }[] = []
    for (const item of filtered) {
      const score = computeSearchScore(item.title, item.id, item.docTitle, item.docUrl, qTrim, item.doc)
      if (score !== null) {
        scored.push({ item, score })
      }
    }
    // 관련도 점수 오름차순 정렬, 동점일 경우 원본 순서(originalIndex) 유지
    scored.sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score
      return a.item.originalIndex - b.item.originalIndex
    })
    filtered = scored.map((s) => s.item)
  }

  // 3. 페이지네이션 계산 및 safe clamping
  const totalCount = filtered.length
  const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / DEMO_INDEX_PAGE_SIZE)
  const currentPage = totalCount === 0 ? 1 : Math.min(Math.max(1, query.page), totalPages)

  const startIndex = (currentPage - 1) * DEMO_INDEX_PAGE_SIZE
  const endIndex = Math.min(startIndex + DEMO_INDEX_PAGE_SIZE, totalCount)
  const items: DemoIndexCardItem[] = filtered
    .slice(startIndex, endIndex)
    .map(({ originalIndex, ...cleanItem }) => cleanItem)

  return {
    items,
    totalCount,
    totalPages,
    currentPage,
    pageSize: DEMO_INDEX_PAGE_SIZE,
    query: {
      q: query.q,
      category: query.category,
      page: currentPage,
    },
    categories: DEMO_INDEX_CATEGORIES,
    allCount,
    allDoneCount,
  }
}
