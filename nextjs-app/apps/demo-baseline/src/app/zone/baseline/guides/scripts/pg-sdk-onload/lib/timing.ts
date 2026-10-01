import type { BootTiming } from '../types'

/** src에 대응하는 Resource Timing 항목의 requestStart(없으면 startTime)를 performance.now 기준으로 반환한다. */
export function requestStartOf(src: string): number | null {
  const entries = performance.getEntriesByName(new URL(src, location.href).href) as PerformanceResourceTiming[]
  const entry = entries.at(-1)
  return entry ? entry.startTime : null
}

export function readLoadEventStart(): number {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  return nav?.loadEventStart ?? 0
}

export function readBootTiming(afterSrc: string, lazySrc: string): BootTiming {
  return {
    loadEventStart: readLoadEventStart(),
    afterInteractiveRequestStart: requestStartOf(afterSrc),
    lazyOnloadRequestStart: requestStartOf(lazySrc),
    afterInteractiveExecutedAt: window.__pgProbe?.after?.executedAt ?? null,
    lazyOnloadExecutedAt: window.__pgProbe?.lazy?.executedAt ?? null,
  }
}

/** 새 시도 전에 이전 시도가 남긴 전역 객체와 <script> 요소를 치운다. */
export function resetScriptGlobals(): void {
  delete window.PgSdk
  delete window.PgWidget
  document.querySelectorAll('script[id^="pg-run-"]').forEach((el) => el.remove())
}
