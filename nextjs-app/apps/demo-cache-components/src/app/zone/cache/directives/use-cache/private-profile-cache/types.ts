/** 이 데모의 라우트 경로. 쿠키 path와 탭 링크가 모두 이 경로 아래로 한정된다. */
export const BASE_PATH = '/zone/cache/directives/use-cache/private-profile-cache'

/** 데모 접두사를 붙인 세션 쿠키. path를 데모 경로로 한정해 다른 데모에 전송되지 않게 한다. */
export const USER_COOKIE = 'directives-use-cache-private-profile-cache-user'

/** 관측 기록을 새로고침 너머까지 비교하기 위한 sessionStorage 키 (데모 접두사) */
export const OBSERVATION_STORAGE_KEY = 'directives-use-cache-private-profile-cache:observations'

export type DemoUserId = 'user-a' | 'user-b'
export type ViewerId = DemoUserId | 'guest'

export const DEMO_USERS: { id: DemoUserId; name: string }[] = [
  { id: 'user-a', name: '민지' },
  { id: 'user-b', name: '준호' },
]

export function toViewerId(value: string | undefined): ViewerId {
  return DEMO_USERS.some((u) => u.id === value) ? (value as DemoUserId) : 'guest'
}

export function viewerName(id: ViewerId): string {
  return DEMO_USERS.find((u) => u.id === id)?.name ?? '비로그인'
}

export type RouteView = 'orders' | 'shipping'

export const VIEWS: { id: RouteView; label: string; href: string }[] = [
  { id: 'orders', label: '주문 내역', href: BASE_PATH },
  { id: 'shipping', label: '배송 조회', href: `${BASE_PATH}/shipping` },
]

export interface OrderRow {
  orderId: string
  productName: string
  price: number
  status: '결제 완료' | '배송 중' | '배송 완료'
  trackingNo: string
}

/** 'use cache: private' 함수 본문이 실제로 실행될 때 만든 값 */
export interface PrivateOrderSnapshot {
  viewer: ViewerId
  /** 함수 본문 안에서 cookies()로 읽은 원본 쿠키 값 (없으면 null) */
  cookieValue: string | null
  cacheId: string
  generatedAt: string
  /** 서버 프로세스에서 이 사용자로 본문이 실행된 순번 */
  execNoForViewer: number
  orders: OrderRow[]
}

/** 페이지가 화면에 나타날 때(마운트) 클라이언트가 기록하는 한 줄 */
export interface VisitObservation {
  seq: number
  /** 브라우저 문서 1회 로드마다 새로 만든 ID. 새로고침하면 바뀐다. */
  pageLoadId: string
  route: RouteView
  viewer: ViewerId
  cacheId: string
  generatedAt: string
  execNoForViewer: number
  shownAt: string
}

export type ProbeResult =
  | { ok: true; value: string; checkedAt: string }
  | { ok: false; name: string; message: string; digest: string | null; checkedAt: string }

export interface ExecCountResult {
  viewer: ViewerId
  count: number
  checkedAt: string
}

/** 조회 시점의 관측 위치(마지막 기록 번호·문서 로드 ID)를 붙여 보관한다 */
export interface ExecCheck extends ExecCountResult {
  afterSeq: number
  pageLoadId: string
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
  })
}
