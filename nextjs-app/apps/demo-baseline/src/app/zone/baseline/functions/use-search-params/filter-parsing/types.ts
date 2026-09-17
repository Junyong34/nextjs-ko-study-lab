export type CategoryFilter = 'all' | 'electronics' | 'fashion' | 'books' | 'living' | 'sports'
export type SortOption = 'best' | 'price-asc' | 'price-desc' | 'rating'

export interface ParsedFilters {
  category: CategoryFilter
  sort: SortOption
  maxPrice: number
}

export const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: '전체 카테고리' },
  { value: 'electronics', label: '전자기기' },
  { value: 'fashion', label: '패션/의류' },
  { value: 'books', label: '도서' },
  { value: 'living', label: '리빙/인테리어' },
  { value: 'sports', label: '스포츠/레저' },
]

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'best', label: '인기/추천순' },
  { value: 'price-asc', label: '낮은 가격순' },
  { value: 'price-desc', label: '높은 가격순' },
  { value: 'rating', label: '평점 높은순' },
]

export const MIN_PRICE = 30000
export const MAX_PRICE = 350000
export const PRICE_STEP = 10000

export const DEFAULT_FILTERS: ParsedFilters = {
  category: 'all',
  sort: 'best',
  maxPrice: MAX_PRICE,
}
