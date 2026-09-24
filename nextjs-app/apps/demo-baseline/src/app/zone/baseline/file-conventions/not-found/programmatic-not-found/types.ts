export const PNF_BASE_PATH = '/zone/baseline/file-conventions/not-found/programmatic-not-found'

/** 카탈로그 상품. 존재하더라도 visibility/status 조건에 따라 notFound()가 호출될 수 있다. */
export interface Product {
  id: string
  name: string
  price: number
  /** 'private'이면 page.tsx가 notFound()로 존재 자체를 숨긴다. */
  visibility: 'public' | 'private'
  /** 'draft'이면 generateMetadata가 notFound()를 호출한다. */
  status: 'published' | 'draft'
}

export interface Review {
  id: string
  productId: string
  authorId: string
  body: string
}

/**
 * notFound()를 호출하는 지점(파일·함수)과 조건의 조합.
 * 서버 카운터는 이 키별로 "notFound() 직전 도달"과 "notFound() 직후 줄 실행"을 따로 센다.
 */
export type ProbeSite =
  | 'page:missing-id'
  | 'page:private'
  | 'metadata:draft'
  | 'review-page:missing-review'
  | 'action:not-owner'

/** notFound() 없이 끝까지 렌더/실행된 경로 */
export type RenderSite = 'product-page' | 'review-page' | 'action:ok'

export interface SiteCounter {
  /** notFound() 바로 앞 줄까지 도달한 횟수 */
  reached: number
  /** notFound() 바로 다음 줄이 실행된 횟수 — never 반환이므로 항상 0이어야 한다 */
  after: number
}

export interface ProbeEvent {
  seq: number
  at: string
  site: ProbeSite | RenderSite
  kind: 'before-notFound' | 'after-notFound' | 'rendered'
  detail: string
}

export interface ProbeSnapshot {
  sites: Record<ProbeSite, SiteCounter>
  rendered: Record<RenderSite, number>
  events: ProbeEvent[]
}

export const SITE_LABELS: Record<ProbeSite, { where: string; condition: string }> = {
  'page:missing-id': { where: '[id]/page.tsx (Server Component)', condition: '존재하지 않는 상품 id' },
  'page:private': { where: '[id]/page.tsx (Server Component)', condition: '비공개(private) 상품' },
  'metadata:draft': { where: '[id]/page.tsx generateMetadata()', condition: '출시 전 초안(draft) 상품' },
  'review-page:missing-review': {
    where: '[id]/reviews/[reviewId]/page.tsx (하위 세그먼트)',
    condition: '존재하지 않는 리뷰 id',
  },
  'action:not-owner': { where: '[id]/actions.ts (Server Action)', condition: '작성자가 아닌 사용자의 리뷰 수정 요청' },
}

export const RENDER_LABELS: Record<RenderSite, string> = {
  'product-page': '[id]/page.tsx 끝까지 렌더',
  'review-page': '[id]/reviews/[reviewId]/page.tsx 끝까지 렌더',
  'action:ok': 'Server Action 정상 반환',
}
