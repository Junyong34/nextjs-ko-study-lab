export interface GnbNavItem {
  href: string
  label: string
}

/** 이 데모의 실제 기본 라우트 경로. 서브 라우트는 모두 이 경로 아래 물리적 디렉토리로 존재한다. */
export const BASE_PATH = '/zone/baseline/functions/use-pathname/active-link'

/**
 * GNB 탭 목록. href는 실제 Next.js 서브 라우트(page.tsx)와 1:1로 대응한다.
 * GnbNav(하이라이트)와 VerificationFooter(검증)가 이 배열 하나를 공유해 기준이 어긋나지 않게 한다.
 */
export const NAV_ITEMS: GnbNavItem[] = [
  { href: BASE_PATH, label: '홈' },
  { href: `${BASE_PATH}/new`, label: '신상품 (New)' },
  { href: `${BASE_PATH}/deals`, label: '타임특가 (Deals)' },
  { href: `${BASE_PATH}/best`, label: '베스트 (Best 100)' },
  { href: `${BASE_PATH}/events`, label: '기획전 (Events)' },
]
