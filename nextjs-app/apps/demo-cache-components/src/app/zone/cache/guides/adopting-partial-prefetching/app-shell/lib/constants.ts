export const DEMO_PATH = '/zone/cache/guides/adopting-partial-prefetching/app-shell'

/** 같은 라우트를 가리키는 링크 수. App Shell을 공유하는지 보려면 둘 이상이어야 한다. */
export const SHARED_IDS = ['1', '2', '3'] as const
export const FULL_ID = '4'
export const DISABLED_ID = '5'
/** 링크가 전부 prefetch={false}인 cold 라우트의 상품 id (셸을 공유할 다른 링크가 없는 대조군) */
export const COLD_IDS = ['6', '7'] as const

/** 도착지가 일부러 기다리는 시간 — 클릭 뒤 스트리밍되는 URL별 영역을 눈에 보이게 한다 */
export const DETAIL_DELAY_MS = 800

/** 영역 D(실시간)가 일부러 기다리는 시간 */
export const REALTIME_DELAY_MS = 800

/** 캐시 태그는 앱 전역이라 데모 접두사를 붙인다 (apps/AGENTS.md 8항) */
export const TAG_PREFIX = 'guides-adopting-partial-prefetching-app-shell:'
