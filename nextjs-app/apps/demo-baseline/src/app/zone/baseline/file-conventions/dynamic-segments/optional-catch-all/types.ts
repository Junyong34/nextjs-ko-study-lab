export const BASE_PATH = '/zone/baseline/file-conventions/dynamic-segments/optional-catch-all'
export const SHOP_PATH = `${BASE_PATH}/shop`

/** 대조용 형제 실습: [...slug](필수 catch-all). 이 파일에서는 링크만 건다. */
export const CATCH_ALL_SIBLING_PATH = '/zone/baseline/file-conventions/dynamic-segments/catch-all-slug'

export interface ShopRouteCase {
  id: string
  label: string
  /** URL에 넣을 세그먼트 원문. href는 encodeURIComponent로 만든다. */
  segments: string[]
}

export const SHOP_ROUTE_CASES: ShopRouteCase[] = [
  { id: 'zero', label: '세그먼트 0개', segments: [] },
  { id: 'one', label: '세그먼트 1개', segments: ['clothes'] },
  { id: 'many', label: '세그먼트 3개', segments: ['clothes', 'tops', 't-shirts'] },
  { id: 'encoded', label: '한글·공백 세그먼트', segments: ['여름 세일', '반팔 티셔츠'] },
]

export function buildShopHref(segments: string[]): string {
  return SHOP_PATH + segments.map((s) => `/${encodeURIComponent(s)}`).join('')
}

/** 서버 page가 await params로 실제 받은 값을 그대로 측정한 결과 */
export interface ParamsObservation {
  /** JSON.stringify(await params) — undefined 값은 JSON에서 키째 빠진다 */
  paramsJson: string
  /** Object.keys(await params) */
  keys: string[]
  /** 'slug' in (await params) */
  hasSlugKey: boolean
  /** typeof params.slug */
  typeofSlug: string
  /** Array.isArray(params.slug) */
  isArray: boolean
  /** 배열일 때 params.slug.length, 아니면 null */
  length: number | null
  /** String(JSON.stringify(params.slug)) */
  slugJson: string
  /** 배열 요소 원문 */
  items: string[]
}

/** '%'가 섞여 decodeURIComponent가 실패하면 원문을 그대로 돌려준다 */
export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
