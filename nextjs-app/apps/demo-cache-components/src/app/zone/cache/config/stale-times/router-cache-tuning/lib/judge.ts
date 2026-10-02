import { DEFAULT_STALE_TIMES, type NavRecord, type Verdict } from '../types'

/** 같은 page로 돌아온 이동(재방문)만 판정 대상이다. 첫 방문은 캐시할 것이 없다. */
export function revisits(records: NavRecord[], route: NavRecord['route']) {
  return records.filter((r) => r.route === route && r.prevRenderId !== null)
}

/**
 * 동적 page: staleTimes.dynamic 기본값 0초 → 재방문마다 RSC 요청이 나가고 서버가 새로 렌더한다.
 * dev와 production 모두 같은 기대값이다.
 */
export function judgeDynamic(records: NavRecord[]): Verdict {
  const rows = revisits(records, 'dynamic')
  if (rows.length === 0) return { isMatched: undefined, reasons: ['동적 page 재방문을 아직 측정하지 않았습니다.'] }
  const reasons: string[] = []
  for (const r of rows) {
    if (r.navRequests < 1) reasons.push(`#${r.seq}: RSC 요청이 0건입니다(dynamic ${DEFAULT_STALE_TIMES.dynamic}초면 1건 이상).`)
    if (r.renderId === r.prevRenderId) reasons.push(`#${r.seq}: 이전 렌더 ID ${r.renderId}가 다시 보였습니다(새 렌더여야 함).`)
  }
  if (reasons.length > 0) return { isMatched: false, reasons }
  return { isMatched: true, reasons: [`재방문 ${rows.length}회 모두 RSC 요청 1건 이상 + 새 렌더 ID — 클라이언트에서 재사용하지 않았습니다.`] }
}

/**
 * 정적 page: production에서는 staleTimes.static(기본 300초) 안의 재방문이 Client Cache(또는 prefetch)로 해결되어
 * 이동 중 일반 RSC 요청이 0건이어야 한다. dev는 prefetch가 꺼져 있고 page를 요청마다 다시 컴파일·렌더하므로
 * 이 기대를 판정할 수 없다 — 관찰값만 보여 준다.
 */
export function judgeStatic(records: NavRecord[]): Verdict {
  const rows = revisits(records, 'static')
  if (rows.length === 0) return { isMatched: undefined, reasons: ['정적 page 재방문을 아직 측정하지 않았습니다.'] }
  const observed = rows.map((r) => `#${r.seq}: ${r.ageSec ?? '?'}초 경과, RSC 요청 ${r.navRequests}건, 렌더 ID ${r.renderId === r.prevRenderId ? '같음' : '다름'}`)
  if (rows[0].mode === 'development') {
    return {
      isMatched: undefined,
      reasons: [
        '판정 불가: next dev는 prefetch를 하지 않고 이동마다 서버에 요청하므로 staleTimes.static의 클라이언트 재사용을 관찰할 수 없습니다.',
        ...observed,
        "렌더 ID가 같다면 서버의 'use cache' 결과를 다시 받은 것이지, 클라이언트 캐시가 재사용된 것이 아닙니다(요청이 나갔기 때문).",
      ],
    }
  }
  const reasons: string[] = []
  for (const r of rows) {
    const limit = r.staleTimeSec ?? DEFAULT_STALE_TIMES.static
    if (r.ageSec === null || r.ageSec >= limit) continue
    if (r.navRequests > 0) reasons.push(`#${r.seq}: ${r.ageSec}초(< ${limit}초) 안의 재방문인데 RSC 요청이 ${r.navRequests}건 나갔습니다.`)
  }
  const within = rows.filter((r) => r.ageSec !== null && r.ageSec < (r.staleTimeSec ?? DEFAULT_STALE_TIMES.static))
  if (within.length === 0) return { isMatched: undefined, reasons: ['stale 시간 안의 재방문이 없어 판정 불가입니다.', ...observed] }
  if (reasons.length > 0) return { isMatched: false, reasons: [...reasons, ...observed] }
  return { isMatched: true, reasons: [`stale 시간 안의 재방문 ${within.length}회 모두 이동 중 RSC 요청 0건.`, ...observed] }
}
