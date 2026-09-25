import type { RouterTransitionStartEvent, RouterTransitionType } from 'next'

// instrumentation-client.ts는 HTML 문서가 로드된 뒤, React hydration이 시작되기 전에
// 동기 최상위 코드가 실행되는 클라이언트 전용 인스트루멘테이션 훅이다.
// (1차 출처: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation-client.md
//  "Execution timing" 절 — after HTML load / before hydration / before interaction)
//
// 이 파일은 client-timing-metrics 데모 전용으로 새로 생성됐다. Next.js는 애플리케이션당
// instrumentation-client.ts를 1개만 인식하므로, 다른 demo-baseline 데모가 클라이언트
// 인스트루멘테이션이 필요해지면 이 파일에 이어서 등록해야 한다.

/** 라우터 전환 1건의 실측 기록. onRouterTransitionStart가 시작을, 도착 페이지의 마운트가 완료를 채운다. */
export interface ClientTimingTransitionRecord {
  seq: number
  url: string
  navigationType: RouterTransitionType
  /** 실험 플래그(instrumentationClientRouterTransitionEvents) 비활성 시 항상 null */
  eventId: string | null
  startedAtPerf: number
  startedAtEpoch: number
  completedAtPerf: number | null
  durationMs: number | null
}

interface ClientTimingStore {
  transitions: ClientTimingTransitionRecord[]
  /** 도착한 페이지가 마운트 시점에 호출해 가장 최근 미완료 전환을 완료 처리한다. */
  recordArrival: () => void
}

declare global {
  interface Window {
    __clientTimingMetricsDemo?: ClientTimingStore
  }
}

const MAX_RECORDS = 8

export const CLIENT_TIMING_START_EVENT = 'client-timing-metrics:transition-start'
export const CLIENT_TIMING_COMPLETE_EVENT = 'client-timing-metrics:transition-complete'

let seq = 0

function ensureStore(): ClientTimingStore {
  if (!window.__clientTimingMetricsDemo) {
    const transitions: ClientTimingTransitionRecord[] = []
    window.__clientTimingMetricsDemo = {
      transitions,
      recordArrival() {
        const pending = transitions.find((t) => t.completedAtPerf === null)
        if (!pending) return
        pending.completedAtPerf = performance.now()
        pending.durationMs = pending.completedAtPerf - pending.startedAtPerf
        window.dispatchEvent(new CustomEvent(CLIENT_TIMING_COMPLETE_EVENT, { detail: pending }))
      },
    }
  }
  return window.__clientTimingMetricsDemo
}

/**
 * App Router 내비게이션이 시작될 때 Next.js가 호출한다.
 * 세 번째 인자(event)는 next.config.ts의 experimental.instrumentationClientRouterTransitionEvents를
 * 켜야 id/timestamp/fromRoutes/prefetchIntent가 채워진다 — 이 데모는 zone 공용 next.config.ts를
 * 건드리지 않는 작업 범위 제약상 비활성 상태이므로 event는 항상 null로 수신된다.
 */
export function onRouterTransitionStart(
  url: string,
  navigationType: RouterTransitionType,
  event: RouterTransitionStartEvent | null
) {
  try {
    const store = ensureStore()
    const record: ClientTimingTransitionRecord = {
      seq: ++seq,
      url,
      navigationType,
      eventId: event?.id ?? null,
      startedAtPerf: performance.now(),
      startedAtEpoch: event?.timestamp ?? Date.now(),
      completedAtPerf: null,
      durationMs: null,
    }
    store.transitions.push(record)
    if (store.transitions.length > MAX_RECORDS) {
      store.transitions.splice(0, store.transitions.length - MAX_RECORDS)
    }
    window.dispatchEvent(new CustomEvent(CLIENT_TIMING_START_EVENT, { detail: record }))
  } catch {
    // 공식 문서 "Hook errors are isolated" 원칙: 계측 실패가 실제 내비게이션에 영향을 주지 않도록 격리한다.
  }
}
