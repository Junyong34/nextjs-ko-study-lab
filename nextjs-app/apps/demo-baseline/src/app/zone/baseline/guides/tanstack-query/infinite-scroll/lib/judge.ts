import type { CacheSnapshot } from '../hooks/useCacheSnapshot'
import type { LabAction, ObserveState } from '../types'

export interface Check {
  label: string
  ok: boolean
  detail: string
}

export interface Verdict {
  checks: Check[]
  done: boolean
}

export const ACTION_LABEL: Record<LabAction['type'], string> = {
  'first-entry': '첫 진입(캐시 없음)',
  reentry: '목록으로 다시 진입',
  scroll: '스크롤로 다음 페이지',
  'burst-default': 'fetchNextPage() 연속 호출',
  'burst-guarded': 'fetchNextPage({ cancelRefetch: false }) 연속 호출',
}

/**
 * 가장 최근 동작 하나를 판정한다.
 * calls: 동작 이후 시작된 queryFn 실행, resources: 같은 기간 Resource Timing에 남은 실제 HTTP 요청 수.
 */
export function judge(action: LabAction, obs: ObserveState, snap: CacheSnapshot | null, resources: number, burstCalls: number): Verdict {
  const calls = obs.fetches.filter((f) => f.startedAt >= action.startT)
  const ok = calls.filter((f) => f.status === 'ok')
  const aborted = calls.filter((f) => f.status === 'aborted')
  const pending = calls.some((f) => f.status === 'pending')
  const pages = snap?.pages ?? 0
  const hits = ok.map((f) => f.cursorHits ?? '-').join(', ') || '-'
  const checks: Check[] = []
  let done = calls.length > 0 && !pending

  switch (action.type) {
    case 'first-entry': {
      // dev의 StrictMode는 마운트 직후 effect를 한 번 정리했다가 다시 실행한다. 그 순간 observer가 0이 되어
      // signal을 쓴 첫 요청이 취소되고 다시 시작될 수 있다. 취소된 요청은 따로 표시하고, 완료된 요청이 1회인지 본다.
      const strictNote = aborted.length ? ` · 취소 ${aborted.length}회(dev StrictMode 재마운트)` : ''
      checks.push(
        { label: '첫 페이지 완료 요청 1회', ok: ok.length === 1 && ok[0].cursor === null && aborted.length <= 1 && calls.length === ok.length + aborted.length, detail: `queryFn ${calls.length}회(성공 ${ok.length}${strictNote}) cursor=null · 서버가 이 커서를 받은 횟수 ${hits}` },
        { label: 'initialPageParam으로 1페이지', ok: pages === 1, detail: `캐시 페이지 ${pages}개` }
      )
      break
    }
    case 'reentry': {
      const expected = action.staleAtEntry ? action.pagesAtStart : 0
      done = obs.settledIds.includes(action.id) && !pending
      checks.push(
        { label: '첫 렌더에 캐시 데이터 표시', ok: action.hadDataOnFirstRender === true, detail: `마운트 시점 캐시 페이지 ${action.pagesAtStart}개 — 로딩 화면 없이 바로 목록` },
        {
          label: action.staleAtEntry ? 'staleTime 지남 → 불러온 페이지 전부 다시 요청' : 'staleTime 안 → 추가 요청 없음',
          ok: calls.length === expected && resources === expected,
          detail: `queryFn ${calls.length}회 · Resource Timing 요청 ${resources}건 / 기대 ${expected}회`,
        }
      )
      break
    }
    case 'scroll':
    case 'burst-guarded':
      checks.push(
        { label: '다음 페이지 요청 1회', ok: calls.length === 1 && ok.length === 1, detail: `queryFn ${calls.length}회 · Resource Timing 요청 ${resources}건` },
        { label: '서버도 같은 커서를 1번만 받음', ok: ok.length === 1 && ok[0].cursorHits === 1, detail: `cursor=${ok[0]?.cursor ?? '-'} · 서버 수신 횟수 ${hits}` },
        { label: '페이지 1개 추가', ok: pages === action.pagesAtStart + 1, detail: `페이지 ${action.pagesAtStart} → ${pages}` }
      )
      break
    case 'burst-default':
      checks.push(
        { label: `queryFn ${burstCalls}회 실행, 앞의 ${burstCalls - 1}회 취소`, ok: calls.length === burstCalls && aborted.length === burstCalls - 1 && ok.length === 1, detail: `실행 ${calls.length} · 취소 ${aborted.length} · 성공 ${ok.length} · 서버가 이 커서를 받은 횟수 ${hits}` },
        { label: '그래도 페이지는 1개만 추가', ok: pages === action.pagesAtStart + 1, detail: `페이지 ${action.pagesAtStart} → ${pages}` }
      )
      break
  }

  if (snap && snap.pages > 0 && !snap.hasNextPage) {
    checks.push({
      label: '마지막 페이지에서 hasNextPage=false',
      ok: snap.lastNextCursor === null && snap.items === snap.total,
      detail: `getNextPageParam → ${String(snap.lastNextCursor)} · 상품 ${snap.items}/${snap.total ?? '-'}개`,
    })
  }
  return { checks, done }
}
