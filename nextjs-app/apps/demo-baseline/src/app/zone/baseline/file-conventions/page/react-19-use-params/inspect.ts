import type { ObservedProbe, PromiseInspection, SearchParamsRecord } from './types'

/**
 * 서버/브라우저 양쪽에서 호출하는 순수 함수. 값을 await/use() 하기 "전"에
 * 그 값 자체가 정말 Promise인지 실제 런타임 검사로 기록한다 (결과를 하드코딩하지 않는다).
 */
export function inspectPromise(value: unknown): PromiseInspection {
  const thenable = value as { then?: unknown } | null
  const proto = value === null || value === undefined ? null : Object.getPrototypeOf(value)
  return {
    isPromise: value instanceof Promise,
    thenType: typeof thenable?.then,
    tag: Object.prototype.toString.call(value),
    ctorName: proto?.constructor?.name ?? '(none)',
  }
}

/** 언래핑된 객체를 JSON 친화적인 평범한 객체로 복사한다 (null-prototype 객체 대비). */
export function toPlain<T extends Record<string, unknown>>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/** 브라우저의 실제 URL(location)을 searchParams와 같은 모양으로 변환한다 — 중복 키는 배열. */
export function readBrowserUrl(): ObservedProbe['url'] {
  const query: SearchParamsRecord = {}
  new URLSearchParams(window.location.search).forEach((v, k) => {
    const prev = query[k]
    query[k] = prev === undefined ? v : Array.isArray(prev) ? [...prev, v] : [prev, v]
  })
  const segments = window.location.pathname.split('/').filter(Boolean)
  return {
    pathname: window.location.pathname,
    sku: decodeURIComponent(segments[segments.length - 1] ?? ''),
    query,
  }
}

function stable(value: unknown): string {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    return `{${Object.keys(obj).sort().map((k) => `${JSON.stringify(k)}:${stable(obj[k])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

/** 관측 기록이 (1) 두 prop 모두 Promise였고 (2) 언래핑 값이 실제 URL과 같은지 판정한다. */
export function evaluateProbe({ report, url }: ObservedProbe) {
  const bothPromise = report.params.isPromise && report.searchParams.isPromise
  const paramsMatch = report.resolvedParams.sku === url.sku
  const queryMatch = stable(report.resolvedSearchParams) === stable(url.query)
  // Server page의 검사는 서버에서, Client Component 쪽 검사는 브라우저에서 실행돼야 한다.
  const envMatch = report.inspectedIn === (report.kind === 'server-await' ? 'server' : 'browser')
  return { bothPromise, paramsMatch, queryMatch, envMatch, ok: bothPromise && paramsMatch && queryMatch && envMatch }
}
