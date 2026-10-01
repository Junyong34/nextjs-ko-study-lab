import type { Snapshot } from '../types'

export interface Check {
  label: string
  pass: boolean
}

export interface Judgement {
  /** 진입 전·후 스냅샷이 모두 있고 전부 통과하면 true, 하나라도 어긋나면 false */
  matched: boolean | undefined
  actual: string[]
}

const mark = (pass: boolean) => (pass ? '일치' : '불일치')

/** 뷰포트 진입 전: src가 없고, 브라우저와 서버 어느 쪽에도 영상 요청이 없어야 한다. */
export function judgeBefore(s: Snapshot): Check[] {
  return [
    { label: '진입 전 <video>에 src 없음, preload="none", readyState 0', pass: !s.hasSrc && s.preload === 'none' && s.readyState === 0 },
    { label: '진입 전 영상 요청 0건 (브라우저 Resource Timing, 서버 기록 모두)', pass: s.browserRequests === 0 && s.serverRequests === 0 },
  ]
}

/** 뷰포트 진입 후: 요청이 발생하고(Range 포함), 데이터가 로드되어 muted 상태로 자동 재생 중이어야 한다. */
export function judgeAfter(s: Snapshot): Check[] {
  return [
    { label: '진입 후 영상 요청 발생 (서버 기록 1건 이상, 브라우저 Resource Timing 1건 이상)', pass: s.serverRequests >= 1 && s.browserRequests >= 1 },
    { label: 'Range 요청에 206 Partial Content로 응답', pass: s.rangeRequests >= 1 && s.serverStatuses.includes(206) },
    { label: '프레임 데이터 로드됨 (readyState ≥ 2)', pass: s.readyState >= 2 },
    { label: 'muted 자동 재생 중 (paused=false, muted=true, 재생된 구간 > 0초)', pass: s.paused === false && s.muted === true && s.playedSeconds > 0 },
  ]
}

/** 비교군: 스크롤 없이 마운트 즉시 src를 가진 <video>는 곧바로 요청한다. */
export function judgeEager(s: Snapshot): Check[] {
  return [{ label: '비교군(즉시 로드)은 스크롤 없이도 요청 발생', pass: s.serverRequests >= 1 && s.browserRequests >= 1 }]
}

const describe = (s: Snapshot) =>
  `요청 브라우저 ${s.browserRequests}/서버 ${s.serverRequests}건(status ${s.serverStatuses.join(',') || '-'}), readyState ${s.readyState}, paused ${s.paused}, muted ${s.muted}, 재생 구간 ${s.playedSeconds}s`

export function judge(snapshots: Snapshot[], eager: Snapshot | null): Judgement {
  const before = snapshots.find((s) => s.phase === 'before')
  const after = [...snapshots].reverse().find((s) => s.phase === 'after')

  const sections: { title: string; snap: Snapshot; checks: Check[] }[] = []
  if (before) sections.push({ title: `[진입 전 ${before.measuredAt}]`, snap: before, checks: judgeBefore(before) })
  if (after) sections.push({ title: `[진입 후 ${after.measuredAt}]`, snap: after, checks: judgeAfter(after) })
  if (eager) sections.push({ title: `[비교군 ${eager.measuredAt}]`, snap: eager, checks: judgeEager(eager) })
  if (sections.length === 0) return { matched: undefined, actual: [] }

  const actual = sections.flatMap((s) => [`• ${s.title} ${describe(s.snap)}`, ...s.checks.map((c) => `  - ${c.label}: ${mark(c.pass)}`)])
  if (!before) actual.push('• 진입 전 측정이 없습니다. [초기화] 후 스크롤하기 전에 먼저 측정하세요.')
  if (!after) actual.push('• 진입 후 측정이 아직 없습니다. 스크롤 박스를 아래로 내린 뒤 다시 측정하세요.')

  const failed = sections.some((s) => s.checks.some((c) => !c.pass))
  return { matched: failed ? false : before && after ? true : undefined, actual }
}
