import type { BurstResult, FailProbe, Prediction } from '../types'

export interface Check {
  label: string
  ok: boolean
  detail: string
}

const distinct = <T,>(values: T[]) => Array.from(new Set(values))

/** 연속 요청 결과를 항목별로 대조한다. 기대값은 "register()는 런타임 인스턴스당 1회"에서 도출한다. */
export function judgeBurst(b: BurstResult, prediction: Prediction | null): Check[] {
  const snaps = b.probes.map((p) => p.snapshot)
  const present = snaps.every((s) => s !== null)
  const boot = distinct(snaps.map((s) => s?.bootedAtMs))
  const pid = distinct(snaps.map((s) => s?.pid))
  const reg = distinct(snaps.map((s) => s?.registerCallCount))
  const counts = b.probes.map((p) => p.handlerRequestCount)
  const stepByOne = counts.every((c, i) => i === 0 || c === counts[i - 1] + 1)
  const checks: Check[] = [
    { label: 'register() 스냅샷 존재', ok: present, detail: present ? `${b.probes.length}개 응답 모두 snapshot 있음` : 'snapshot이 없는 응답이 있음' },
    { label: '런타임 일치', ok: snaps.every((s) => s?.runtime === b.runtime), detail: `Route Handler runtime=${b.runtime} / snapshot.runtime=${distinct(snaps.map((s) => s?.runtime)).join(', ')}` },
    { label: 'bootedAtMs 불변', ok: boot.length === 1, detail: `${b.probes.length}회 동안 서로 다른 값 ${boot.length}개 (${boot.join(', ')})` },
    { label: 'pid 불변', ok: pid.length === 1, detail: `서로 다른 값 ${pid.length}개 (${pid.join(', ')})` },
    { label: 'registerCallCount 불변', ok: reg.length === 1, detail: `서로 다른 값 ${reg.length}개 (${reg.join(', ')})` },
    { label: '대조 카운터 매 요청 +1', ok: stepByOne && counts.length > 1, detail: `handlerRequestCount ${counts[0]} → ${counts[counts.length - 1]}` },
  ]
  if (prediction) {
    const measured: Prediction = reg.length === 1 ? 'unchanged' : 'increases'
    checks.push({
      label: '예측',
      ok: prediction === measured,
      detail: `예측 ${prediction === 'unchanged' ? '그대로' : '요청마다 증가'} / 실측 ${measured === 'unchanged' ? '그대로' : '증가'}`,
    })
  }
  return checks
}

/** Node.js와 Edge 묶음을 모두 잰 경우에만 두 런타임이 서로 다른 register() 호출을 가졌는지 대조한다. */
export function judgeRuntimes(node: BurstResult, edge: BurstResult): Check[] {
  const n = node.probes[0]?.snapshot
  const e = edge.probes[0]?.snapshot
  return [
    { label: 'Node/Edge 부팅 시각 다름', ok: !!n && !!e && n.bootedAtMs !== e.bootedAtMs, detail: `nodejs ${n?.bootedAt ?? '-'} / edge ${e?.bootedAt ?? '-'}` },
    { label: 'Edge에는 Node.js pid 없음', ok: !!n && !!e && n.pid > 0 && e.pid === -1, detail: `nodejs pid ${n?.pid ?? '-'} / edge pid ${e?.pid ?? '-'}` },
  ]
}

export function judgeFail(f: FailProbe): Check[] {
  const hit = f.captured[0]
  return [
    { label: '응답 상태', ok: f.status === 500, detail: `기대 500 / 실제 ${f.status}` },
    { label: 'onRequestError 호출', ok: f.captured.length === 1, detail: hit ? `새 기록 ${f.captured.length}건 — "${hit.message}"` : '새 기록 없음' },
    { label: 'routeType', ok: hit?.routeType === 'route', detail: `기대 route / 실제 ${hit?.routeType ?? '-'}` },
    {
      label: '오류 후에도 register() 재호출 없음',
      ok: f.registerCountBefore !== null && f.registerCountBefore === f.registerCountAfter,
      detail: `registerCallCount ${f.registerCountBefore ?? '-'} → ${f.registerCountAfter ?? '-'}`,
    },
  ]
}
