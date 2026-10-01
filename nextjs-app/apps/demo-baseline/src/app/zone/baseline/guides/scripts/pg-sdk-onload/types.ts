/** 이 데모의 내부 라우트 경로와 SDK를 서빙하는 Route Handler 경로 */
export const DEMO_BASE_PATH = '/zone/baseline/guides/scripts/pg-sdk-onload'
export const SDK_ROUTE = `${DEMO_BASE_PATH}/api/sdk`

/** SDK 응답을 서버에서 실제로 지연시키는 시간(ms). 이 시간 동안 SDK 전역 객체는 존재하지 않는다. */
export const SDK_DELAY_MS = 1200
export const MAX_DELAY_MS = 3000

/** parallel: SDK·플러그인을 동시에 마운트, chained: SDK onLoad 이후에 플러그인을 마운트, error: SDK가 HTTP 500 */
export type TrialOrder = 'parallel' | 'chained' | 'error'
export const TRIAL_ORDERS: TrialOrder[] = ['parallel', 'chained', 'error']

export type EventKind =
  | 'start'
  | 'sdk-onLoad'
  | 'sdk-onReady'
  | 'sdk-onError'
  | 'plugin-onLoad'
  | 'plugin-onReady'

export interface TrialEvent {
  seq: number
  kind: EventKind
  /** 시도 시작 후 경과 시간(ms, performance.now 실측) */
  at: number
  /** 이벤트 시점에 typeof window.PgSdk !== 'undefined' 였는지 */
  sdkPresent: boolean
  detail: string
}

/** 플러그인 스크립트가 실행되는 순간 스스로 기록한 값 (window.PgWidget) */
export interface PluginRecord {
  executedAt: number
  sdkPresent: boolean
  ok: boolean
  error?: string
}

export interface ActiveTrial {
  runId: number
  order: TrialOrder
  startedAt: number
}

export interface TrialResult {
  order: TrialOrder
  runId: number
  events: TrialEvent[]
  plugin: PluginRecord | null
  /** Resource Timing으로 읽은 요청 시작 시각 (시도 시작 기준, ms) */
  sdkRequestStart: number | null
  pluginRequestStart: number | null
}

/** [결제 요청] 버튼으로 window.PgSdk.requestPay를 직접 호출해 본 기록 */
export interface PayAttempt {
  seq: number
  /** 호출 시점에 SDK onLoad가 이미 끝났는가 */
  afterOnLoad: boolean
  ok: boolean
  detail: string
}

/** 페이지 로드와 함께 마운트된 strategy별 스크립트의 실측 시각 (performance.now 기준, ms) */
export interface BootTiming {
  loadEventStart: number
  afterInteractiveRequestStart: number | null
  lazyOnloadRequestStart: number | null
  afterInteractiveExecutedAt: number | null
  lazyOnloadExecutedAt: number | null
}

export interface PgSdkGlobal {
  version: string
  executedAt: number
  widgets: string[]
  registerWidget: (name: string) => number
  requestPay: (req: { orderName: string; amount: number }) => { paymentKey: string; orderName: string; amount: number; at: number }
}

declare global {
  interface Window {
    PgSdk?: PgSdkGlobal
    PgWidget?: PluginRecord
    __pgProbe?: Record<string, { executedAt: number }>
  }
}
