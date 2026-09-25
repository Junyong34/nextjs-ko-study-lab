/** 이 데모의 내부 라우트 기준 경로 (학습자 URL이 아니라 zone 내부 경로) */
export const DEMO_BASE = '/zone/baseline/guides/scripts/strategy-order'
export const CAMPAIGN_PATH = `${DEMO_BASE}/campaign`
export const CAMPAIGN_DETAIL_PATH = `${DEMO_BASE}/campaign/detail`

/** 서드파티 스크립트를 대신하는 실제 JS를 서빙하는 Route Handler 경로 */
export const PROBE_PATH = `${DEMO_BASE}/probe`

/** 프로브 스크립트가 실행될 때 방출하는 window 이벤트 이름 (데모 접두사 포함) */
export const PROBE_EVENT = 'guides-scripts-strategy-order:probe'

/** 서버가 응답을 실제로 늦추는 최대 시간(ms) */
export const PROBE_MAX_DELAY_MS = 2000

/** "무거운 코어 SDK"의 서버 응답 지연(ms). 플러그인보다 먼저 선언되지만 늦게 도착한다. */
export const CORE_DELAY_MS = 800

export type ProbeName =
  | 'core-sdk'
  | 'core-plugin'
  | 'core-plugin-chained'
  | 'chat-widget'
  | 'layout-analytics'
  | 'campaign-pixel'
  | 'shared-widget'
  | 'inline-with-id'
  | 'inline-no-id'

export const PROBE_NAMES: ProbeName[] = [
  'core-sdk',
  'core-plugin',
  'core-plugin-chained',
  'chat-widget',
  'layout-analytics',
  'campaign-pixel',
  'shared-widget',
  'inline-with-id',
  'inline-no-id',
]

/** 프로브 스크립트 1회 실행의 실측 기록 (스크립트 자신이 실행되는 순간 기록한다) */
export interface ProbeRun {
  name: ProbeName
  /** performance.now() — 이 스크립트 본문이 실제로 실행된 시각 */
  at: number
  readyState: DocumentReadyState
  /** 실행 당시의 location.pathname */
  path: string
  /** 같은 이름의 스크립트가 이 문서에서 몇 번째로 실행됐는지 */
  execNo: number
  /** 실행 당시 window.__strategyOrderCore(코어 SDK 전역)가 존재했는지 */
  coreReady: boolean
}

export interface RouteVisit {
  path: string
  at: number
}

/** window.__strategyOrder — 새로고침 전까지 유지되는 전역 실측 로그 (next/script 캐시와 같은 수명) */
export interface ProbeStore {
  runs: ProbeRun[]
  /** 첫 하이드레이션 커밋 직후(레이아웃 클라이언트 컴포넌트의 첫 useEffect) 시각 */
  hydratedAt: number | null
  /** Navigation Timing의 loadEventEnd (window load 이벤트 종료 시각) */
  loadAt: number | null
  /** usePathname 변화로 기록한 실제 라우트 이동 이력 */
  visits: RouteVisit[]
  /** 중복 방지 실습 슬롯 컴포넌트가 실제로 마운트된 누적 횟수 */
  slotMounts: number
}

declare global {
  interface Window {
    __strategyOrder?: ProbeStore
    __strategyOrderCore?: { version: string; loadedAt: number }
  }
}

export function probeSrc(name: ProbeName, delayMs = 0) {
  return delayMs > 0 ? `${PROBE_PATH}?name=${name}&delay=${delayMs}` : `${PROBE_PATH}?name=${name}`
}

/** 각 프로브가 어디에 어떤 strategy로 선언됐는지 (화면 표시용 설명, 실측값 아님) */
export const PROBE_META: Record<ProbeName, { placement: string; strategy: string }> = {
  'core-sdk': { placement: 'page · 1번째 선언', strategy: `afterInteractive · 서버 지연 ${CORE_DELAY_MS}ms` },
  'core-plugin': { placement: 'page · 2번째 선언', strategy: 'afterInteractive · 코어 의존' },
  'core-plugin-chained': { placement: 'page · 코어 onReady 후 렌더', strategy: 'afterInteractive · 코어 의존' },
  'chat-widget': { placement: 'page · 3번째 선언', strategy: 'lazyOnload' },
  'layout-analytics': { placement: 'strategy-order/layout.tsx', strategy: 'afterInteractive' },
  'campaign-pixel': { placement: 'campaign/layout.tsx', strategy: 'afterInteractive' },
  'shared-widget': { placement: '슬롯마다 동일 id+src', strategy: 'afterInteractive' },
  'inline-with-id': { placement: '슬롯마다 인라인 · id 있음', strategy: 'afterInteractive' },
  'inline-no-id': { placement: '슬롯마다 인라인 · id 없음', strategy: 'afterInteractive' },
}
