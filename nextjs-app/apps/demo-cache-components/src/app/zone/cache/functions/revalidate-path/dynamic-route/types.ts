/** 허브에서 실행할 수 있는 동작. 'reload'는 revalidatePath 없이 iframe만 다시 요청하는 대조군이다. */
export type RevalidateMode = 'reload' | 'literal' | 'pattern-page' | 'pattern-no-type'

export interface RevalidateResult {
  mode: RevalidateMode
  /** 서버에서 실제로 실행한 호출식 */
  call: string
  executedAt: string
}

export interface ProductSnapshot {
  id: string
  /** 'use cache' 함수 내부에서 생성 — 캐시 엔트리가 재생성될 때만 바뀐다 */
  cacheId: string
  cachedAt: string
  /** 캐시 바깥(connection() 이후)에서 매 요청마다 기록 — iframe이 실제로 다시 요청됐음을 증명 */
  requestedAt: string
}

export interface SnapshotMessage extends ProductSnapshot {
  type: string
}

export interface RoundResult {
  mode: RevalidateMode
  call: string
  before: Record<string, ProductSnapshot>
  after: Record<string, ProductSnapshot>
  expectedChanged: string[]
  actualChanged: string[]
}
