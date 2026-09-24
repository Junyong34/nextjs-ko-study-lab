import { routeHref } from './routes'
import type { FlowAnalysis, ProbeSample, RouteKey, RunMode } from './types'

/** 이 번들이 빌드된 모드. next dev면 'development', next build 산출물이면 'production'으로 인라인된다. */
export const RUN_MODE: RunMode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

const pick = (html: string, attr: string) => html.match(new RegExp(`${attr}="([^"]+)"`))?.[1] ?? null

/** 하위 page를 실제로 GET 요청하고, 응답 헤더와 HTML에 박힌 렌더 ID/시각을 읽는다. */
export async function fetchOnce(route: RouteKey, seq: number, startedAt: number): Promise<ProbeSample> {
  // cache: 'no-store'는 "브라우저 HTTP 캐시를 쓰지 말라"는 뜻일 뿐, 서버 쪽 ISR 캐시에는 영향이 없다.
  const res = await fetch(routeHref(route), { cache: 'no-store' })
  const html = await res.text()
  const receivedAt = Date.now()
  return {
    seq,
    route,
    elapsedMs: receivedAt - startedAt,
    receivedAt,
    status: res.status,
    renderId: pick(html, 'data-render-id'),
    renderedAt: pick(html, 'data-rendered-at'),
    xNextjsCache: res.headers.get('x-nextjs-cache'),
    xVercelCache: res.headers.get('x-vercel-cache'),
    cacheControl: res.headers.get('cache-control'),
  }
}

/** 캐시 상태: next start에서는 x-nextjs-cache, Vercel에서는 x-vercel-cache로 드러난다. */
export const cacheStatus = (s: ProbeSample) => s.xNextjsCache ?? s.xVercelCache

/** 응답을 받은 시점에 그 결과가 몇 초 전에 렌더링된 것인지 (브라우저 시계 - 서버 렌더 시각) */
export function ageSeconds(s: ProbeSample): number | null {
  if (!s.renderedAt) return null
  return Math.max(0, (s.receivedAt - Date.parse(s.renderedAt)) / 1000)
}

const uniq = (xs: (string | null)[]) => new Set(xs).size

/**
 * 연속된 STALE 응답 묶음([start, end])을 찾는다. 재생성이 끝나기 전에 들어온 요청도 STALE을 받으므로
 * STALE이 여러 번 이어질 수 있다(짧은 간격으로 요청하면 실제로 관측된다).
 */
function staleRuns(isr: ProbeSample[]): [number, number][] {
  const runs: [number, number][] = []
  isr.forEach((s, i) => {
    if (cacheStatus(s) !== 'STALE') return
    const last = runs[runs.length - 1]
    if (last && last[1] === i - 1) last[1] = i
    else runs.push([i, i])
  })
  return runs
}

function analyzeProduction(isr: ProbeSample[], stat: ProbeSample[], finished: boolean): FlowAnalysis {
  const lines: string[] = []
  const runs = staleRuns(isr)
  // STALE 묶음 뒤의 "다음 요청"까지 관측된 것만 흐름 판정에 쓴다.
  const judged = runs.filter(([, end]) => end + 1 < isr.length)
  const flowOk =
    judged.length > 0 &&
    judged.every(([start, end]) => {
      const oldId = start === 0 ? isr[start].renderId : isr[start - 1].renderId
      const keptOld = isr.slice(start, end + 1).every((s) => s.renderId === oldId)
      const replaced = isr[end + 1].renderId !== oldId
      return keptOld && replaced
    })
  const staticOk = stat.length >= 2 && uniq(stat.map((s) => s.renderId)) === 1
  const staleCount = runs.reduce((n, [a, b]) => n + b - a + 1, 0)

  lines.push(`• isr-10s/: ${isr.length}번 요청 → 고유 렌더 ID ${uniq(isr.map((s) => s.renderId))}개, STALE ${staleCount}회`)
  for (const [start, end] of judged) {
    const prev = start > 0 ? isr[start - 1].renderId : '(첫 요청)'
    const age = ageSeconds(isr[start])
    const seqs = isr.slice(start, end + 1).map((s) => `#${s.seq}`).join(',')
    const next = isr[end + 1]
    lines.push(
      `  - ${seqs} STALE: 받은 ID ${isr[start].renderId} (직전 ${prev}), 렌더 후 ${age?.toFixed(1) ?? '?'}초 경과` +
        ` → 다음 #${next.seq} ${cacheStatus(next) ?? '헤더 없음'}: ID ${next.renderId}`,
    )
  }
  lines.push(`• static/: ${stat.length}번 요청 → 고유 렌더 ID ${uniq(stat.map((s) => s.renderId))}개`)

  const ready = finished || (flowOk && staticOk)
  if (!ready) lines.push('• 판정 대기: STALE 응답과 그 다음 요청, static/ 요청 2회 이상이 필요합니다.')
  return { ready, isMatched: ready ? flowOk && staticOk : undefined, lines }
}

function analyzeDevelopment(isr: ProbeSample[], stat: ProbeSample[], finished: boolean): FlowAnalysis {
  const all = [...isr, ...stat]
  const everyNew = uniq(all.map((s) => s.renderId)) === all.length
  const noCacheHeader = all.every((s) => !s.xNextjsCache)
  const ready = finished || (isr.length >= 3 && stat.length >= 2)
  return {
    ready,
    isMatched: ready ? everyNew && noCacheHeader && all.length > 0 : undefined,
    lines: [
      `• isr-10s/ ${isr.length}회 + static/ ${stat.length}회 요청 → 고유 렌더 ID ${uniq(all.map((s) => s.renderId))}개`,
      `• x-nextjs-cache 헤더: ${noCacheHeader ? '모든 응답에 없음' : '일부 응답에 있음'}`,
      ...(ready ? [] : ['• 판정 대기: isr-10s/ 3회, static/ 2회 이상 요청하세요.']),
    ],
  }
}

/**
 * 판정 기준 (isr-10s/의 revalidate = 10)
 * - production: STALE 응답(연속될 수 있음)은 직전과 같은(옛) ID이고, STALE이 끝난 다음 요청은 새 ID여야 한다.
 *   static/은 ID가 하나로 고정.
 * - development: 개발 서버는 캐시하지 않으므로 두 page 모두 요청마다 새 ID.
 */
export function analyze(samples: ProbeSample[], finished: boolean, mode: RunMode = RUN_MODE): FlowAnalysis {
  const isr = samples.filter((s) => s.route === 'isr-10s')
  const stat = samples.filter((s) => s.route === 'static')
  if (samples.some((s) => s.status !== 200 || !s.renderId)) {
    return { ready: true, isMatched: false, lines: ['• 200이 아니거나 렌더 ID를 읽지 못한 응답이 있습니다.'] }
  }
  return mode === 'production' ? analyzeProduction(isr, stat, finished) : analyzeDevelopment(isr, stat, finished)
}
