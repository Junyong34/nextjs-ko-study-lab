import { SAMPLES_PER_ROUTE, routeHref } from './routes'
import type { ProbeSample, RouteProbeResult, RouteSpec, RunMode } from './types'

/** 이 번들이 빌드된 모드. next dev면 'development', next build 산출물이면 'production'으로 인라인된다. */
export const RUN_MODE: RunMode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

const pick = (html: string, attr: string) => html.match(new RegExp(`${attr}="([^"]+)"`))?.[1] ?? null

/** 하위 page를 실제로 GET 요청하고, 응답 헤더와 HTML에 박힌 렌더 ID/시각을 읽는다. */
async function fetchOnce(route: RouteSpec, n: number): Promise<ProbeSample> {
  const url = `${routeHref(route)}${route.probeQuery ? `${route.probeQuery}${n}` : ''}`
  const res = await fetch(url, { cache: 'no-store' })
  const html = await res.text()
  return {
    status: res.status,
    renderId: pick(html, 'data-render-id'),
    renderedAt: pick(html, 'data-rendered-at'),
    xNextjsCache: res.headers.get('x-nextjs-cache'),
    xNextjsPrerender: res.headers.get('x-nextjs-prerender'),
    cacheControl: res.headers.get('cache-control'),
  }
}

/**
 * 기대 판정:
 * - production: 정적 page(○)는 N번 요청해도 렌더 ID가 1개, 동적 page(ƒ)는 N개
 * - development: next dev는 정적 page도 요청마다 렌더링하므로 모든 page가 N개
 */
export function expectedUniqueIds(route: RouteSpec, mode: RunMode, samples: number) {
  return mode === 'production' && route.expectedSymbol === '○' ? 1 : samples
}

export async function probeRoute(route: RouteSpec): Promise<RouteProbeResult> {
  const samples: ProbeSample[] = []
  for (let i = 1; i <= SAMPLES_PER_ROUTE; i++) samples.push(await fetchOnce(route, i))

  const ids = samples.map((s) => s.renderId)
  const uniqueIds = new Set(ids).size
  const allOk = samples.every((s) => s.status === 200) && ids.every(Boolean)
  const ok = allOk && uniqueIds === expectedUniqueIds(route, RUN_MODE, samples.length)
  return { route, samples, uniqueIds, ok }
}
