import { SAMPLES_PER_TARGET } from './terms'
import type { ProbeSample, ProbeTarget, RunMode, TargetResult } from './types'

/** 이 번들이 빌드된 모드. next dev면 'development', next build 산출물이면 'production'으로 인라인된다. */
export const RUN_MODE: RunMode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

const pick = (html: string, attr: string) => html.match(new RegExp(`${attr}="([^"]+)"`))?.[1] ?? null

/** 브라우저가 실제로 GET 요청하고, 응답 헤더와 HTML에 박힌 렌더 ID/시각을 읽는다. */
async function fetchOnce(target: ProbeTarget): Promise<ProbeSample> {
  const res = await fetch(target.href, { cache: 'no-store' })
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

/** 대상 성격과 실행 모드별 기대 조건. 문서(generate-static-params.md, dynamicParams.md) 기준으로 적었다. */
function judge(target: ProbeTarget, samples: ProbeSample[], probedAt: string, mode: RunMode) {
  const n = samples.length
  const ids = new Set(samples.map((s) => s.renderId)).size
  const all = (fn: (s: ProbeSample) => boolean) => samples.every(fn)
  const checks: { label: string; ok: boolean }[] = []

  if (target.kind === 'unknown') {
    checks.push({ label: `${n}번 모두 404`, ok: all((s) => s.status === 404) })
    return checks
  }

  checks.push({ label: `${n}번 모두 200`, ok: all((s) => s.status === 200 && Boolean(s.renderId)) })

  if (target.kind === 'prebuilt' && mode === 'production') {
    checks.push({ label: '렌더 ID 1개 (빌드 때 만든 HTML 재사용)', ok: ids === 1 })
    checks.push({
      label: '렌더 시각이 실측 시작보다 과거 (빌드 시점 고정)',
      ok: all((s) => s.renderedAt !== null && s.renderedAt < probedAt),
    })
    checks.push({ label: 'x-nextjs-cache 존재', ok: all((s) => s.xNextjsCache !== null) })
    checks.push({ label: 'cache-control에 s-maxage (CDN 공유 캐시 허용)', ok: all((s) => /s-maxage/.test(s.cacheControl ?? '')) })
    return checks
  }

  checks.push({ label: `렌더 ID ${n}개 (요청마다 렌더)`, ok: ids === n })
  if (target.kind === 'runtime-api' && mode === 'production') {
    checks.push({ label: 'x-nextjs-cache 없음', ok: all((s) => s.xNextjsCache === null) })
    checks.push({ label: 'cache-control에 no-store (CDN 캐시 금지)', ok: all((s) => /no-store/.test(s.cacheControl ?? '')) })
  }
  return checks
}

export async function probeTarget(target: ProbeTarget): Promise<TargetResult> {
  const probedAt = new Date().toISOString()
  const samples: ProbeSample[] = []
  for (let i = 0; i < SAMPLES_PER_TARGET; i++) samples.push(await fetchOnce(target))

  const checks = judge(target, samples, probedAt, RUN_MODE)
  return {
    target,
    samples,
    uniqueIds: new Set(samples.map((s) => s.renderId).filter(Boolean)).size,
    probedAt,
    checks,
    ok: checks.every((c) => c.ok),
  }
}
