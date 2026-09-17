import type { Product } from '@study/demo-kit'
import {
  CATEGORY_OPTIONS,
  DEFAULT_FILTERS,
  MAX_PRICE,
  MIN_PRICE,
  SORT_OPTIONS,
  type CategoryFilter,
  type ParsedFilters,
  type SortOption,
} from './types'

const VALID_CATEGORIES = new Set(CATEGORY_OPTIONS.map((option) => option.value))
const VALID_SORTS = new Set(SORT_OPTIONS.map((option) => option.value))

/** useSearchParams()의 ReadonlyURLSearchParams와 구조적으로 호환되는 최소 인터페이스. */
export interface QueryLike {
  get(name: string): string | null
}

export interface ParsedField<T> {
  value: T
  /** URL에 값이 있었지만 유효 목록에 없어 기본값으로 대체되었는가 */
  wasInvalid: boolean
}

/**
 * searchParams.get('category')는 항상 string | null이다.
 * 유효한 카테고리 값이 아니면 기본값('all')으로 대체한다.
 */
export function parseCategoryParam(raw: string | null): ParsedField<CategoryFilter> {
  if (raw === null) return { value: DEFAULT_FILTERS.category, wasInvalid: false }
  return VALID_CATEGORIES.has(raw as CategoryFilter)
    ? { value: raw as CategoryFilter, wasInvalid: false }
    : { value: DEFAULT_FILTERS.category, wasInvalid: true }
}

export function parseSortParam(raw: string | null): ParsedField<SortOption> {
  if (raw === null) return { value: DEFAULT_FILTERS.sort, wasInvalid: false }
  return VALID_SORTS.has(raw as SortOption)
    ? { value: raw as SortOption, wasInvalid: false }
    : { value: DEFAULT_FILTERS.sort, wasInvalid: true }
}

/**
 * maxPrice는 URL에서 문자열로 들어오므로 Number()로 변환해야 한다.
 * "abc" 같은 값은 NaN이 되므로 Number.isFinite로 반드시 검증한 뒤 기본값으로 대체한다.
 */
export function parseMaxPriceParam(raw: string | null): ParsedField<number> {
  if (raw === null) return { value: DEFAULT_FILTERS.maxPrice, wasInvalid: false }
  const parsed = Number(raw)
  const isValid = Number.isFinite(parsed) && parsed >= MIN_PRICE && parsed <= MAX_PRICE
  return isValid ? { value: parsed, wasInvalid: false } : { value: DEFAULT_FILTERS.maxPrice, wasInvalid: true }
}

export function parseFilters(searchParams: QueryLike): { filters: ParsedFilters; hasInvalidRaw: boolean } {
  const category = parseCategoryParam(searchParams.get('category'))
  const sort = parseSortParam(searchParams.get('sort'))
  const maxPrice = parseMaxPriceParam(searchParams.get('maxPrice'))

  return {
    filters: { category: category.value, sort: sort.value, maxPrice: maxPrice.value },
    hasInvalidRaw: category.wasInvalid || sort.wasInvalid || maxPrice.wasInvalid,
  }
}

export function filterAndSortProducts(products: Product[], filters: ParsedFilters): Product[] {
  const filtered = products.filter((product) => {
    if (filters.category !== 'all' && product.category !== filters.category) return false
    if (product.price > filters.maxPrice) return false
    return true
  })

  return [...filtered].sort((a, b) => {
    if (filters.sort === 'price-asc') return a.price - b.price
    if (filters.sort === 'price-desc') return b.price - a.price
    if (filters.sort === 'rating') return b.rating - a.rating
    return Number(b.isBest) - Number(a.isBest)
  })
}
