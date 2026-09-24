/** 장바구니 줄 하나 = 독립된 'use cache' 엔트리 하나 (각자 다른 태그) */
export type LineId = 'update' | 'revalidate'

/** 수량 변경 뒤 호출하는 무효화 API */
export type InvalidationApi = 'updateTag' | "revalidateTag(tag, 'max')"

/** 'use cache' 함수 본문이 실행된 순간 기록한 값 — 재계산될 때만 바뀐다 */
export interface CachedLine {
  qty: number
  cacheId: string
  generatedAt: string
  generatedAtMs: number
}

/** 서버 메모리의 장바구니 원본 (캐시를 거치지 않고 직접 읽은 값) */
export interface SourceLine {
  qty: number
  updatedAt: string
  updatedAtMs: number
}

/** 한 번의 서버 렌더가 이 줄에 대해 그린 값 */
export interface LineView {
  cached: CachedLine
  source: SourceLine
}

export interface CartLineSnapshot extends LineView {
  lineId: LineId
  name: string
  api: InvalidationApi
  tag: string
}

/** Server Action이 원본을 변경한 직후 돌려주는 값 */
export interface MutationResult {
  qtyAfterWrite: number
  writtenAt: string
  writtenAtMs: number
}

/**
 * 버튼 한 번의 측정 기록.
 * before: 클릭 순간 화면 → afterAction: Server Action 응답이 끝난 직후 화면 → afterRefresh: 바로 이어진 첫 재요청(router.refresh) 화면
 */
export interface SyncRun {
  id: number
  lineId: LineId
  api: InvalidationApi
  phase: 'action' | 'refresh' | 'done'
  before: LineView
  result?: MutationResult
  afterAction?: LineView
  afterRefresh?: LineView
  error?: string
}
