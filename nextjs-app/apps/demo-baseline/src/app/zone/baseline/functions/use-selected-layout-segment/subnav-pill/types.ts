import { MOCK_PRODUCTS } from '@study/demo-kit'

export interface SubnavTab {
  /** useSelectedLayoutSegment()가 이 탭에서 반환해야 하는 값. 기본 경로(개요) 탭은 null. */
  segment: string | null
  href: string
  label: string
}

/** 이 데모의 실제 기본 라우트 경로. 서브 라우트는 모두 이 경로 아래 물리적 디렉토리로 존재한다. */
export const BASE_PATH = '/zone/baseline/functions/use-selected-layout-segment/subnav-pill'

/**
 * 상품 상세 서브내비 탭 목록. href는 실제 Next.js 서브 라우트(page.tsx)와 1:1로 대응하고,
 * segment는 그 라우트에서 useSelectedLayoutSegment()가 반환해야 하는 값이다.
 * SubnavPill(하이라이트)과 VerificationFooter(검증)가 이 배열 하나를 공유해 기준이 어긋나지 않게 한다.
 */
export const SUBNAV_TABS: SubnavTab[] = [
  { segment: null, href: BASE_PATH, label: '개요' },
  { segment: 'specs', href: `${BASE_PATH}/specs`, label: '상세 스펙' },
  { segment: 'reviews', href: `${BASE_PATH}/reviews`, label: '리뷰' },
  { segment: 'shipping', href: `${BASE_PATH}/shipping`, label: '배송 안내' },
]

/** 데모 전체가 공유하는 상품 상세 mock 데이터. @study/demo-kit의 기존 MOCK_PRODUCTS를 재사용한다. */
export const DEMO_PRODUCT = MOCK_PRODUCTS.find((product) => product.id === 'prod-001')!
