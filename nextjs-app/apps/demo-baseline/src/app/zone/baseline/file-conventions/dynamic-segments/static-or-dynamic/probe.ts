import { SAMPLES_PER_ROUTE, routeHref } from './routes'
import type { ProbeSample, RouteProbeResult, RouteSpec, RunMode } from './types'

/** next dev면 'development', next build 산출물이면 'production'으로 인라인된다. */
export const RUN_MODE: RunMode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

const pick = (html: string, attr: string) => html.match(new RegExp(`${attr}="([^"]+)"`))?.[1] ?? null

async function fetchOnce(route: RouteSpec): Promise<ProbeSample> {
  const res = await fetch(routeHref(route), { cache: 'no-store' })
  const html = await res.text()
  return {
    status: res.status,
    renderId: pick(html, 'data-render-id'),
    xNextjsCache: res.headers.get('x-nextjs-cache'),
    xNextjsPrerender: res.headers.get('x-nextjs-prerender'),
    cacheControl: res.headers.get('cache-control'),
  }
}

/** development는 정적 라우트도 요청마다 렌더링하므로 모두 요청 수만큼이다. */
export function expectedUniqueIds(route: RouteSpec, mode: RunMode, samples: number) {
  return mode === 'production' && route.prodUniqueIds === 1 ? 1 : samples
}

export async function probeRoute(route: RouteSpec): Promise<RouteProbeResult> {
  const samples: ProbeSample[] = []
  for (let i = 0; i < SAMPLES_PER_ROUTE; i++) samples.push(await fetchOnce(route))
  const ids = samples.map((s) => s.renderId)
  const uniqueIds = new Set(ids).size
  const allOk = samples.every((s) => s.status === 200) && ids.every(Boolean)
  return { route, samples, uniqueIds, ok: allOk && uniqueIds === expectedUniqueIds(route, RUN_MODE, samples.length) }
}
