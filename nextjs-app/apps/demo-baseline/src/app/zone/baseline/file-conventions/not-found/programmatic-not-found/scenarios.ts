import { PNF_BASE_PATH, type ProbeSite, type RenderSite } from './types'

export const PRODUCT_BOUNDARY = 'product-[id]'

/**
 * 실측 러너가 순서대로 실행하는 트리거 시나리오.
 * expect* 값은 공식 문서 기준 기대값이고, 실제값은 러너가 iframe 로드·클릭과 서버 카운터로 측정한다.
 */
export interface Scenario {
  key: string
  where: string
  condition: string
  /** 'hard': 문서 요청, 'soft': P-100에서 <Link> 클릭, 'action': P-100에서 Server Action 버튼 클릭 */
  mode: 'hard' | 'soft' | 'action'
  url: string
  /** soft/action 모드에서 iframe 안에서 클릭할 요소 */
  clickSelector?: string
  /**
   * 기대 HTTP 상태. hard=문서 요청, action=Server Action POST 응답.
   * soft는 문서 요청이 없고 RSC 요청 상태는 관찰값으로만 표시하므로 null
   */
  expectStatus: number | null
  expectBoundary: string | null
  /** notFound() 직전 줄 도달이 +1 되어야 하는 지점 */
  expectSite: ProbeSite | null
  /** 끝까지 렌더/실행 카운터가 +1 되어야 하는 경로 */
  expectRendered: RenderSite | null
}

export const SCENARIOS: Scenario[] = [
  {
    key: 'control',
    where: '[id]/page.tsx',
    condition: '공개 상품 P-100 (대조군)',
    mode: 'hard',
    url: `${PNF_BASE_PATH}/P-100`,
    expectStatus: 200,
    expectBoundary: null,
    expectSite: null,
    expectRendered: 'product-page',
  },
  {
    key: 'missing',
    where: '[id]/page.tsx',
    condition: '존재하지 않는 id P-999',
    mode: 'hard',
    url: `${PNF_BASE_PATH}/P-999`,
    expectStatus: 404,
    expectBoundary: PRODUCT_BOUNDARY,
    expectSite: 'page:missing-id',
    expectRendered: null,
  },
  {
    key: 'private',
    where: '[id]/page.tsx',
    condition: '비공개 상품 P-200',
    mode: 'hard',
    url: `${PNF_BASE_PATH}/P-200`,
    expectStatus: 404,
    expectBoundary: PRODUCT_BOUNDARY,
    expectSite: 'page:private',
    expectRendered: null,
  },
  {
    key: 'metadata',
    where: 'generateMetadata()',
    condition: '출시 전 초안 P-300',
    mode: 'hard',
    url: `${PNF_BASE_PATH}/P-300`,
    // 브라우저 UA에서는 metadata가 스트리밍되어 셸이 먼저 200으로 나간다 (generate-metadata "Streaming metadata").
    expectStatus: 200,
    expectBoundary: PRODUCT_BOUNDARY,
    expectSite: 'metadata:draft',
    // page.tsx는 generateMetadata와 병렬로 실행되므로 draft 검사가 없는 page 본문은 끝까지 렌더된다.
    expectRendered: 'product-page',
  },
  {
    key: 'nested',
    where: 'reviews/[reviewId]/page.tsx',
    condition: '없는 리뷰 R-9 (자기 not-found.tsx 없음)',
    mode: 'hard',
    url: `${PNF_BASE_PATH}/P-100/reviews/R-9`,
    expectStatus: 404,
    expectBoundary: PRODUCT_BOUNDARY,
    expectSite: 'review-page:missing-review',
    expectRendered: null,
  },
  {
    key: 'soft',
    where: 'reviews/[reviewId]/page.tsx',
    condition: 'P-100에서 <Link>로 R-9 이동',
    mode: 'soft',
    url: `${PNF_BASE_PATH}/P-100`,
    clickSelector: 'a[href$="/reviews/R-9"]',
    expectStatus: null,
    expectBoundary: PRODUCT_BOUNDARY,
    expectSite: 'review-page:missing-review',
    expectRendered: null,
  },
  {
    key: 'action',
    where: 'actions.ts (Server Action)',
    condition: '타인 리뷰 R-2 수정 요청',
    mode: 'action',
    url: `${PNF_BASE_PATH}/P-100`,
    clickSelector: 'button[value="R-2"]',
    // next/dist/server/app-render/action-handler.js: notFound()를 잡으면 res.statusCode = 404로 두고
    // skipPageRendering: false로 현재 페이지 RSC 트리를 다시 렌더해 함께 보낸다.
    expectStatus: 404,
    expectBoundary: PRODUCT_BOUNDARY,
    expectSite: 'action:not-owner',
    expectRendered: 'product-page',
  },
]
