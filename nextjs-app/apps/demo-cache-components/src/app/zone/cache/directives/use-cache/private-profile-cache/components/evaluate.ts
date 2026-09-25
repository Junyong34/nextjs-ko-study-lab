import type { ExecCheck, ProbeResult, VisitObservation } from '../types'

type V = VisitObservation

/** 기록된 화면 표시 이력만으로 문서의 세 가지 주장을 판정한다. */
export function evaluate(visits: V[], probe: ProbeResult | null, checks: ExecCheck[]) {
  const pairs = visits.flatMap((a, i) => visits.slice(i + 1).map((b) => [a, b] as const))

  // 1) 같은 문서 안에서 다른 탭을 거쳐 돌아왔는데 같은 cacheId → 브라우저 메모리 재사용
  const reuse = pairs.find(
    ([a, b]) =>
      a.pageLoadId === b.pageLoadId &&
      a.route === b.route &&
      a.viewer === b.viewer &&
      a.cacheId === b.cacheId &&
      visits.some((m) => m.seq > a.seq && m.seq < b.seq && m.pageLoadId === a.pageLoadId && m.route !== a.route),
  )
  // 2) 새로고침(문서 로드 ID 변경) 후 같은 사용자·같은 탭인데 새 cacheId → 유지되지 않음
  const reloadFresh = pairs.find(
    ([a, b]) => a.pageLoadId !== b.pageLoadId && a.route === b.route && a.viewer === b.viewer && a.cacheId !== b.cacheId,
  )
  // 1-1) 두 번의 [서버 실행 횟수 조회] 사이 화면 표시가 전부 "재사용"이었다면 서버 실행 횟수는 그대로여야 한다
  const isReuse = (v: V, i: number) => visits.slice(0, i).some((p) => p.pageLoadId === v.pageLoadId && p.cacheId === v.cacheId)
  const checkPairs = checks.flatMap((a, i) => checks.slice(i + 1).map((b) => [a, b] as const))
  const bracket = checkPairs.filter(([a, b]) => {
    if (a.pageLoadId !== b.pageLoadId || a.viewer !== b.viewer) return false
    const between = visits
      .map((v, i) => [v, i] as const)
      .filter(([v]) => v.pageLoadId === a.pageLoadId && v.seq > a.afterSeq && v.seq <= b.afterSeq)
    return between.length > 0 && between.every(([v, i]) => isReuse(v, i))
  })
  const noServerExec = bracket.find(([a, b]) => a.count === b.count)
  const execDuringReuse = bracket.find(([a, b]) => b.count > a.count)
  const persisted = pairs.find(([a, b]) => a.pageLoadId !== b.pageLoadId && a.cacheId === b.cacheId)
  // 3) 서로 다른 사용자는 절대 같은 cacheId를 받지 않음
  const viewers = [...new Set(visits.filter((v) => v.viewer !== 'guest').map((v) => v.viewer))]
  const crossShared = pairs.find(([a, b]) => a.viewer !== b.viewer && a.cacheId === b.cacheId)
  const isolated = viewers.length >= 2 && !crossShared
  // 4) 대조군: 일반 'use cache' + cookies()는 오류
  const probeRejected = probe !== null && !probe.ok

  const isMatched =
    persisted || crossShared || execDuringReuse || (probe && probe.ok)
      ? false
      : reuse && noServerExec && reloadFresh && isolated && probeRejected
        ? true
        : undefined

  return { reuse, noServerExec, execDuringReuse, reloadFresh, persisted, viewers, crossShared, isolated, probeRejected, isMatched }
}
