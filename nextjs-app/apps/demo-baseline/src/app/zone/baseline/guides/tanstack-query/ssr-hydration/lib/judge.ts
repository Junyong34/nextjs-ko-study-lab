import type { HtmlCheck, HydrationMeasure, ServerRead, ServerRenderInfo, StaleProbeRun } from '../types'

export interface Check {
  label: string
  ok: boolean
  detail: string
}

const EXPECTED_ROWS = 4

interface HydrationInput {
  info: ServerRenderInfo
  measure: HydrationMeasure
  isHardLoad: boolean
  /** 마운트 후 첫 staleTime 구독 추가 전까지의 api/deals 요청 수 */
  requestsAfterMount: number
  reads: ServerRead[]
}

export function judgeHydration({ info, measure, isHardLoad, requestsAfterMount, reads }: HydrationInput): Check[] {
  const prefetchReads = reads.filter((r) => r.source === 'server-prefetch').length
  const handlerReads = reads.filter((r) => r.source === 'route-handler').length
  const where = isHardLoad ? '서버 HTML' : 'RSC Payload(클라이언트 이동)'

  if (info.variant === 'prefetched') {
    return [
      { label: `첫 렌더부터 데이터 표시 (${where})`, ok: measure.rowsAtFirstEffect === EXPECTED_ROWS, detail: `하이드레이션 직후 DOM의 상품 행 ${measure.rowsAtFirstEffect}개 / 기대 ${EXPECTED_ROWS}개` },
      {
        label: 'hydrate된 queryClient 상태',
        ok: measure.statusAtFirstEffect === 'success' && measure.dataSourceAtFirstEffect === 'server-prefetch' && measure.dataUpdatedAt <= measure.clientNow,
        detail: `status=${measure.statusAtFirstEffect} · data.source=${measure.dataSourceAtFirstEffect ?? '-'} · dataUpdatedAt이 하이드레이션 ${measure.clientNow - measure.dataUpdatedAt}ms 전(서버에서 읽은 시각)`,
      },
      { label: '브라우저의 api/deals 요청 없음', ok: requestsAfterMount === 0, detail: `마운트 후 Resource Timing 요청 ${requestsAfterMount}건` },
      { label: '서버가 prefetch로 1번만 읽음', ok: prefetchReads === 1 && handlerReads === 0, detail: `이번 렌더 이후 서버 읽기: prefetch ${prefetchReads}회 · Route Handler ${handlerReads}회` },
      { label: '요청마다 새 QueryClient', ok: info.cacheSizeAtCreate === 0, detail: `new QueryClient() 직후 캐시 쿼리 수 ${info.cacheSizeAtCreate ?? '-'} · 렌더 id ${info.renderId.slice(0, 8)}` },
    ]
  }
  return [
    { label: '첫 렌더는 로딩 표시 (데이터 없음)', ok: measure.rowsAtFirstEffect === 0 && measure.statusAtFirstEffect === 'pending', detail: `하이드레이션 직후 상품 행 ${measure.rowsAtFirstEffect}개 · status=${measure.statusAtFirstEffect}` },
    { label: '브라우저가 api/deals를 1번 요청', ok: requestsAfterMount === 1, detail: `마운트 후 Resource Timing 요청 ${requestsAfterMount}건` },
    { label: '서버는 Route Handler로만 읽음', ok: prefetchReads === 0 && handlerReads === 1, detail: `이번 렌더 이후 서버 읽기: prefetch ${prefetchReads}회 · Route Handler ${handlerReads}회` },
  ]
}

/** 같은 키를 staleTime 0 또는 60초로 구독하는 컴포넌트를 추가했을 때 재요청 여부 */
export function judgeStaleProbe(run: StaleProbeRun, requests: number): Check {
  const expected = run.ageAtMount > run.staleTime ? 1 : 0
  const age = Number.isFinite(run.ageAtMount) ? `${Math.round(run.ageAtMount / 1000)}초` : '데이터 없음'
  return {
    label: `staleTime ${run.staleTime === 0 ? '0' : '60초'} 구독 추가 → ${expected ? '재요청' : '캐시 사용'}`,
    ok: requests === expected,
    detail: `데이터 나이 ${age} · 새 api/deals 요청 ${requests}건 / 기대 ${expected}건`,
  }
}

export function judgeHtml(variant: ServerRenderInfo['variant'], html: HtmlCheck): Check {
  const ok = variant === 'prefetched' ? html.rowsInHtml === EXPECTED_ROWS && html.hasDehydratedKey : html.rowsInHtml === 0 && !html.hasDehydratedKey
  return {
    label: '응답 HTML 직접 검사',
    ok: ok && html.status === 200,
    detail: `HTTP ${html.status} · HTML 안의 상품 행 ${html.rowsInHtml}개 · queryKey(dehydrated state) ${html.hasDehydratedKey ? '있음' : '없음'} · ${Math.round(html.bytes / 1024)}KB`,
  }
}
