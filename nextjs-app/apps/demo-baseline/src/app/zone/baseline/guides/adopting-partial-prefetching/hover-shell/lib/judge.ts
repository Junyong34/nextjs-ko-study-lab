import { PRODUCTS, STOCK_DELAY_MS, productPath } from '../data'
import type { CheckLine, Judgement, ProbeState } from '../types'

/** 동적 영역이 STOCK_DELAY_MS만큼 늦는다면 헤더 도착과 body 완료 사이에 이 정도는 벌어져야 한다 */
const MIN_STREAM_GAP_MS = Math.round(STOCK_DELAY_MS * 0.5)

type Input = Pick<ProbeState, 'requests' | 'hovers' | 'resources'> & { isProduction: boolean }

/** 상세 라우트로 가는 클릭 이동만 센다 (목록으로 돌아가는 이동은 동적 영역이 없어 스트리밍 판정 대상이 아니다) */
function detailNavigations(requests: Input['requests']) {
  return requests.filter((r) => r.kind === 'navigation' && r.path.includes('/products/'))
}

function summarize(checks: CheckLine[]): boolean | undefined {
  if (checks.some((c) => c.ok === false)) return false
  if (checks.some((c) => c.ok === null)) return undefined
  return true
}

/** 개발 모드: Link prefetch는 production 전용이므로 요청 0건이어야 하고, 클릭 이동만 RSC 요청을 만든다 */
function judgeDev({ requests }: Input): Judgement {
  const prefetches = requests.filter((r) => r.kind === 'prefetch')
  const navs = detailNavigations(requests)
  if (navs.length === 0) {
    return { isMatched: undefined, checks: [], info: [`prefetch 요청 ${prefetches.length}건 (카드를 클릭해 상세로 이동하면 판정합니다)`] }
  }
  const latest = navs[navs.length - 1]
  const gap = latest.bodyMs !== null && latest.headersMs !== null ? latest.bodyMs - latest.headersMs : null
  const checks: CheckLine[] = [
    { ok: prefetches.length === 0, text: `viewport 진입·hover 중 prefetch 요청 ${prefetches.length}건 (기대: 0건, dev는 prefetch 비활성)` },
    {
      ok: navs.every((n) => n.hasRscParam && n.prefetchHeader === null),
      text: `상세 라우트 클릭 이동 RSC 요청 ${navs.length}건 — _rsc 쿼리 있음, Next-Router-Prefetch 헤더 없음`,
    },
    {
      ok: gap === null ? null : gap >= MIN_STREAM_GAP_MS,
      text:
        gap === null
          ? '응답 body 스트림 완료 대기 중...'
          : `마지막 이동 응답: 헤더 ${latest.headersMs}ms, body 완료 ${latest.bodyMs}ms (간격 ${gap}ms ≥ ${MIN_STREAM_GAP_MS}ms → 동적 영역이 뒤따라 스트리밍)`,
    },
  ]
  return { isMatched: summarize(checks), checks, info: [] }
}

/** production: 뷰포트에 들어온 prefetch 대상 링크만 prefetch 요청을 만들고, prefetch={false} 링크는 만들지 않는다 */
function judgeProd({ requests, hovers }: Input): Judgement {
  const prefetches = requests.filter((r) => r.kind === 'prefetch')
  const navs = detailNavigations(requests)
  if (prefetches.length === 0 && navs.length === 0 && hovers.length === 0) {
    return { isMatched: undefined, checks: [], info: ['목록이 표시된 뒤 prefetch 요청이 관측되면 판정합니다'] }
  }
  const prefetched = new Set(prefetches.map((r) => r.path))
  const checks: CheckLine[] = PRODUCTS.map((p) => {
    const got = prefetched.has(productPath(p.id))
    const want = p.linkMode !== 'false'
    return {
      ok: got === want,
      text: `상품 ${p.id} (prefetch ${p.linkMode === 'auto' ? '기본값' : `={${p.linkMode}}`}): prefetch 요청 ${got ? '있음' : '없음'} (기대: ${want ? '있음' : '없음'})`,
    }
  })
  return { isMatched: summarize(checks), checks, info: [`클릭 이동 RSC 요청 ${navs.length}건 (prefetch 캐시 적중 시 0건일 수 있음)`] }
}

export function judge(input: Input): Judgement {
  const result = input.isProduction ? judgeProd(input) : judgeDev(input)
  const { requests, resources } = input
  const note = `참고: fetch로 잡은 RSC 요청 ${requests.length}건 / Resource Timing의 _rsc 항목 ${resources.length}건`
  return { ...result, info: [...result.info, note] }
}
