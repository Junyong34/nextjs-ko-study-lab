import type { Category } from './types'

/** 데모 접두사: 태그·키가 같은 zone의 다른 데모 캐시와 섞이지 않도록 URL 기반 접두사를 붙인다 */
export const DEMO_PREFIX = 'functions-unstable-cache-db-query:'

/** unstable_cache 옵션의 revalidate(초). 이 시간이 지나면 다음 호출이 stale 값을 받고 백그라운드 재실행된다 */
export const REVALIDATE_SECONDS = 20

export const CATEGORIES: Record<Category, string> = {
  keyboard: '키보드',
  mouse: '마우스',
  monitor: '모니터',
}
export const CATEGORY_IDS = Object.keys(CATEGORIES) as Category[]

export const TAGS = {
  all: `${DEMO_PREFIX}products`,
  category: (c: Category) => `${DEMO_PREFIX}products:${c}`,
}

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && value in CATEGORIES
}
