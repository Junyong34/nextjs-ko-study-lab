/** 이 데모의 실제 기본 라우트 경로. 예제 페이지는 모두 이 아래 실제 다이나믹 세그먼트([sku]) 디렉토리로 존재한다. */
export const BASE_PATH = '/zone/baseline/file-conventions/page/react-19-use-params'

export type ProbeKind = 'server-await' | 'client-use' | 'forwarded-use'

export type SearchParamsRecord = Record<string, string | string[] | undefined>

/** page props로 받은 값(params / searchParams)을 언래핑하기 "전"에 실제로 검사한 결과. */
export interface PromiseInspection {
  /** value instanceof Promise */
  isPromise: boolean
  /** typeof value.then */
  thenType: string
  /** Object.prototype.toString.call(value) */
  tag: string
  /** Object.getPrototypeOf(value)?.constructor?.name */
  ctorName: string
}

/** 한 번의 렌더(또는 마운트)에서 실제로 관측한 언래핑 결과. */
export interface ProbeReport {
  kind: ProbeKind
  /** 언래핑에 사용한 API 표기 */
  unwrapApi: 'await' | 'use()'
  /** 검사 코드가 실행된 환경 — typeof window 실측값 기반 */
  inspectedIn: 'server' | 'browser'
  /** 서버에서 측정한 경우 process.env.NEXT_RUNTIME, 브라우저면 navigator.userAgent 일부 */
  runtime: string
  params: PromiseInspection
  searchParams: PromiseInspection
  resolvedParams: Record<string, string | string[]>
  resolvedSearchParams: SearchParamsRecord
  observedAt: string
}

/** 검증 패널이 보관하는 관측 기록: 리포트 + 관측 시점의 실제 브라우저 URL. */
export interface ObservedProbe {
  report: ProbeReport
  url: { pathname: string; sku: string; query: SearchParamsRecord }
}

export const PROBE_LABELS: Record<ProbeKind, string> = {
  'server-await': "Server Component page — await params",
  'client-use': "Client Component page ('use client') — use(params)",
  'forwarded-use': 'Server page가 넘긴 Promise prop — Client Component의 use()',
}

/** 실제 <Link>로 이동하는 예제 경로. 같은 [sku]에서 쿼리만 바꾸는 링크도 포함한다. */
export const ROUTE_LINKS: { href: string; label: string }[] = [
  { href: `${BASE_PATH}/server/prod-001?color=black`, label: 'server/prod-001?color=black' },
  { href: `${BASE_PATH}/server/prod-001?color=white`, label: 'server/prod-001?color=white' },
  { href: `${BASE_PATH}/server/prod-004?size=L&size=XL`, label: 'server/prod-004?size=L&size=XL' },
  { href: `${BASE_PATH}/client/prod-001?color=black`, label: 'client/prod-001?color=black' },
  { href: `${BASE_PATH}/client/prod-004?size=M&size=L`, label: 'client/prod-004?size=M&size=L' },
]
