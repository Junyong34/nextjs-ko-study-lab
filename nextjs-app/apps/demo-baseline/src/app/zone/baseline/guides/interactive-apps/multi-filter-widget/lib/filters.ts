import type { Filters, SortKey } from '../types'

/** 서버(page)와 클라이언트(FilterBar)가 공유하는 순수 함수만 둔다. */

export const PARAM = { category: 'category', sort: 'sort', stock: 'stock' } as const

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'price_asc', label: '낮은 가격순' },
  { value: 'price_desc', label: '높은 가격순' },
  { value: 'rating', label: '평점순' },
]

const SORT_KEYS = new Set<string>(SORT_OPTIONS.map((o) => o.value))

export function parseFilters(sp: URLSearchParams): Filters {
  const sort = sp.get(PARAM.sort)
  return {
    categories: sp.getAll(PARAM.category).filter(Boolean),
    sort: sort && SORT_KEYS.has(sort) ? (sort as SortKey) : null,
    inStock: sp.get(PARAM.stock) === 'in',
  }
}

/** page props의 searchParams 객체(중복 키는 배열)를 URLSearchParams로 되돌린다. */
export function toURLSearchParams(record: Record<string, string | string[] | undefined>): URLSearchParams {
  const sp = new URLSearchParams()
  for (const [key, value] of Object.entries(record)) {
    if (Array.isArray(value)) value.forEach((v) => sp.append(key, v))
    else if (value !== undefined) sp.append(key, value)
  }
  return sp
}

/** 키·값 순서와 무관하게 비교할 수 있도록 정렬한 쿼리 문자열. 비어 있으면 ''. */
export function normalizeSearch(sp: URLSearchParams): string {
  const pairs = [...sp.entries()].sort(([ak, av], [bk, bv]) => (ak === bk ? av.localeCompare(bv) : ak.localeCompare(bk)))
  return new URLSearchParams(pairs).toString()
}

export function showSearch(search: string) {
  return search ? `?${decodeURIComponent(search)}` : '(쿼리 없음)'
}
