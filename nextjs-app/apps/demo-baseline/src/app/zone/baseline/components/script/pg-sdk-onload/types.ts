/** 이 데모의 내부 라우트 경로 (zone 내부 URL — 셸 iframe 안에서만 이동한다) */
export const DEMO_BASE_PATH = '/zone/baseline/components/script/pg-sdk-onload'
export const RECEIPT_PATH = `${DEMO_BASE_PATH}/receipt`

/** sdk/route.ts가 실제로 서빙하는 로컬 결제 SDK(외부 CDN 아님) */
export const SDK_PATH = `${DEMO_BASE_PATH}/sdk`

/** 메인 SDK 응답을 서버가 실제로 지연시키는 시간(ms). 로드 전 호출 실패를 관찰할 시간을 벌어준다. */
export const SDK_DELAY_MS = 1500
export const SDK_MAX_DELAY_MS = 5000
export const MAIN_SDK_SRC = `${SDK_PATH}?delay=${SDK_DELAY_MS}`
export const MAIN_SDK_ID = 'demopay-sdk'

/** SDK 호스트 컴포넌트가 DOM에 있는지 하위 라우트에서 확인하기 위한 마커 속성 */
export const SDK_HOST_ATTR = 'data-pg-sdk-host'

export const CLIENT_KEY = 'test_ck_local_demo'

/** onError 실측용 실패 응답 코드 (sdk/route.ts가 실제로 이 status로 응답한다) */
export type FailStatus = 404 | 500
export const FAIL_STATUSES: FailStatus[] = [500, 404]

/** 이벤트가 어느 <Script>에서 왔는지: 메인 SDK 또는 실패 시나리오 */
export type EventScope = 'main' | `fail-${FailStatus}`

export type SdkEventKind =
  | 'mount' // SDK 호스트 컴포넌트 마운트 (Script보다 먼저 렌더되는 형제의 useEffect)
  | 'early-call' // 마운트 직후 window.DemoPay.init() 직접 호출 결과
  | 'manual-call' // 사용자가 버튼으로 직접 호출한 결과
  | 'onLoad'
  | 'onReady'
  | 'onError'
  | 'away' // 하위 라우트(receipt) 마운트 = SDK 호스트가 언마운트된 상태

export interface SdkEvent {
  seq: number
  kind: SdkEventKind
  scope: EventScope
  /** performance.now() 실측 시각 */
  at: number
  /** 콜백/호출 시점에 typeof window.DemoPay !== 'undefined' 였는지 */
  sdkPresent: boolean
  /** 기록 시점까지의 SDK 호스트 마운트 누적 횟수 */
  mountNo: number
  /** 기록 시점의 window.DemoPay.executionCount (SDK 스크립트가 실제로 실행된 누적 횟수), 없으면 null */
  execCount: number | null
  /** 호출 성공 여부 (early-call / manual-call / onReady) */
  ok?: boolean
  detail: string
}

/** 로컬 SDK가 window에 실제로 정의하는 전역 객체의 형태 */
export interface DemoPayInstance {
  instanceId: number
  clientKey: string
  createdAt: number
  requestPayment: (req: { amount: number; orderName: string }) => {
    instanceId: number
    orderName: string
    amount: number
    requestedAt: number
  }
}

export interface DemoPayGlobal {
  version: string
  servedAt: string
  delayMs: number
  executedAt: number
  executionCount: number
  init: (opts: { clientKey: string }) => DemoPayInstance
}

declare global {
  interface Window {
    DemoPay?: DemoPayGlobal
  }
}
