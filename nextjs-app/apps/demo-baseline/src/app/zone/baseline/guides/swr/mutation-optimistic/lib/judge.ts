import type { LabEvent, MountRun, MutationRun } from '../types'

export interface Check {
  label: string
  ok: boolean
  detail: string
}

export interface Verdict {
  checks: Check[]
  /** 판정에 필요한 응답이 아직 다 오지 않았으면 false */
  done: boolean
}

const ms = (from: number, e: LabEvent | undefined) => (e ? `${e.t - from}ms` : '-')

/** 첫 사용자 동작 전, 같은 키를 읽는 두 컴포넌트가 마운트됐을 때의 GET 횟수 */
export function judgeInitial(events: LabEvent[]): Check | null {
  const firstAction = events.find((e) => e.kind === 'patch-start' || e.kind === 'mount')
  const before = events.filter((e) => !firstAction || e.t < firstAction.t)
  if (!before.some((e) => e.kind === 'fetch-end')) return null
  const gets = before.filter((e) => e.kind === 'fetch-start').length
  return {
    label: '초기 로드 중복 제거',
    ok: gets === 1,
    detail: `useSWR(같은 키) 구독 2곳 마운트 → GET ${gets}회`,
  }
}

export function judgeMutation(run: MutationRun, events: LabEvent[]): Verdict {
  const evs = events.filter((e) => e.t >= run.startT)
  const end = evs.find((e) => e.kind === 'patch-ok' || e.kind === 'patch-fail')
  const shown = evs.find((e) => e.kind === 'display' && e.optimistic && e.qtys?.[run.itemId] === run.optimisticQty)
  const checks: Check[] = [
    {
      label: '응답 전 낙관적 값 표시',
      ok: !!shown && (!end || shown.t <= end.t),
      detail: `화면 ${run.beforeQty} → ${run.optimisticQty}개: ${ms(run.startT, shown)} 뒤 / PATCH 응답: ${end ? ms(run.startT, end) + ' 뒤' : '대기 중'}`,
    },
  ]
  if (!end) return { checks, done: false }

  const after = evs.filter((e) => e.t >= end.t)
  const lastDisplay = [...after].reverse().find((e) => e.kind === 'display')
  const shownQty = lastDisplay?.qtys?.[run.itemId]
  const revalidateGets = after.filter((e) => e.kind === 'fetch-start').length
  const revalidateDone = !run.settings.revalidate || after.some((e) => e.kind === 'fetch-end')

  if (run.settings.failNext) {
    const rollback = after.find((e) => e.kind === 'display')
    checks.push(
      { label: 'PATCH 실패 응답', ok: end.kind === 'patch-fail', detail: end.detail },
      {
        label: '롤백 (rollbackOnError)',
        ok: !!lastDisplay && !lastDisplay.optimistic && shownQty === run.beforeQty,
        detail: `응답 후 첫 표시 ${rollback?.qtys?.[run.itemId] ?? '-'}개(${ms(run.startT, rollback)}) · 최종 표시 ${shownQty ?? '-'}개 / 기대 ${run.beforeQty}개`,
      },
      {
        label: '서버 저장소 변경 없음',
        ok: run.serverQtyAfter === run.beforeQty,
        detail: `api/log로 다시 읽은 서버 수량 ${run.serverQtyAfter ?? '-'}개`,
      }
    )
  } else {
    const confirmed = end.serverQty
    checks.push(
      { label: 'PATCH 성공 응답', ok: end.kind === 'patch-ok', detail: end.detail },
      {
        label: '서버 확정값으로 교체 (populateCache)',
        ok: !!lastDisplay && !lastDisplay.optimistic && shownQty === confirmed,
        detail:
          `최종 표시 ${shownQty ?? '-'}개 / 서버 확정 ${confirmed ?? '-'}개` +
          (confirmed !== undefined && confirmed !== run.optimisticQty ? ` — 낙관적 값 ${run.optimisticQty}개를 서버가 재고 상한으로 바꿈` : ''),
      },
      {
        label: '서버 저장소와 일치',
        ok: run.serverQtyAfter !== null && run.serverQtyAfter === confirmed,
        detail: `api/log로 다시 읽은 서버 수량 ${run.serverQtyAfter ?? '-'}개`,
      }
    )
  }

  checks.push({
    label: `revalidate: ${run.settings.revalidate}`,
    ok: run.settings.revalidate ? revalidateGets === 1 : revalidateGets === 0,
    detail: `PATCH 응답 뒤 GET ${revalidateGets}회 / 기대 ${run.settings.revalidate ? 1 : 0}회`,
  })
  return { checks, done: run.settled && revalidateDone }
}

/** 같은 키 구독을 하나 더 마운트했을 때 dedupingInterval 안이면 요청이 없어야 한다 */
export function judgeMount(run: MountRun, events: LabEvent[], dedupingInterval: number): Verdict {
  const gets = events.filter((e) => e.kind === 'fetch-start' && e.t >= run.startT).length
  const inside = run.msSinceLastFetch !== null && run.msSinceLastFetch < dedupingInterval
  const expected = inside ? 0 : 1
  return {
    checks: [
      {
        label: inside ? 'dedupingInterval 안 — 요청 생략' : 'dedupingInterval 밖 — 재검증 1회',
        ok: gets === expected,
        detail: `직전 GET 시작 후 ${run.msSinceLastFetch ?? '-'}ms에 마운트 → 새 GET ${gets}회 / 기대 ${expected}회 (간격 ${dedupingInterval}ms)`,
      },
    ],
    done: run.settled,
  }
}
