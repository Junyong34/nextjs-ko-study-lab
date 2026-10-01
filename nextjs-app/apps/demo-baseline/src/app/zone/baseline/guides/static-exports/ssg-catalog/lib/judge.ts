import type { CheckItem, Judgement, ProbeRun, RenderMode } from '../types'
import { isPrebuilt } from './catalog'

const modeOf = (run: ProbeRun): RenderMode => {
  const env = run.samples[0]?.nodeEnv
  return env === 'development' || env === 'production' ? env : 'unknown'
}

/**
 * 측정값만으로 판정한다. 사전 생성 id 1개와 사전 생성되지 않은 id 1개가 측정돼야 판정을 시작한다.
 * 렌더 고정 여부는 응답이 알려 주는 NODE_ENV에 따라 기대값이 갈린다 (dev는 매 요청 렌더가 정상).
 */
export function judge(runs: ProbeRun[]): Judgement {
  const built = runs.find((r) => isPrebuilt(r.id))
  const missed = runs.find((r) => !isPrebuilt(r.id))
  if (!built || !missed) return { ready: false, mode: 'unknown', checks: [], unverified: null }

  const mode = modeOf(built)
  const [a, b] = built.samples
  const frozen = a.renderedAt !== null && a.renderedAt === b.renderedAt
  const hasStamp = a.renderedAt !== null && b.renderedAt !== null
  const noCache = /no-store|no-cache/.test(a.cacheControl ?? '')

  const checks: CheckItem[] = [
    {
      label: `사전 생성 id(${built.id}) 응답`,
      ok: built.samples.every((s) => s.status === 200) && hasStamp,
      detail: `상태 ${a.status}/${b.status}, 렌더 시각 ${hasStamp ? '확인' : '없음'}`,
    },
    {
      label: `사전 생성되지 않은 id(${missed.id}) 응답`,
      ok: missed.samples.every((s) => s.status === 404),
      detail: `상태 ${missed.samples[0].status}/${missed.samples[1].status} (dynamicParams = false이면 404)`,
    },
  ]

  if (mode === 'production') {
    checks.push({
      label: '빌드 시점 고정 (production)',
      ok: frozen && !noCache,
      detail: `렌더 시각 ${frozen ? '두 요청이 동일' : '요청마다 다름'}, cache-control: ${a.cacheControl ?? '없음'}, x-nextjs-cache: ${a.nextjsCache ?? '없음'}`,
    })
  } else if (mode === 'development') {
    checks.push({
      label: '요청마다 렌더 (dev 서버)',
      ok: hasStamp && !frozen,
      detail: `렌더 시각 ${frozen ? '두 요청이 동일' : '요청마다 다름'}, cache-control: ${a.cacheControl ?? '없음'}`,
    })
  } else {
    checks.push({ label: '실행 모드 식별', ok: false, detail: '응답에서 NODE_ENV를 읽지 못했습니다.' })
  }

  const unverified =
    mode === 'development'
      ? 'production 빌드에서의 "렌더 시각 고정" 동작은 이 dev 서버에서 관찰할 수 없어 미검증입니다.'
      : null
  return { ready: true, mode, checks, unverified }
}
