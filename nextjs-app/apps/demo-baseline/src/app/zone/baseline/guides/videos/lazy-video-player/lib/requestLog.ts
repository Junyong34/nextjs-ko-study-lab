import type { RequestRecord } from '../types'

/** 서버 프로세스 메모리의 run별 요청 기록. 모듈 인스턴스가 라우트마다 달라도 공유되도록 globalThis에 둔다. */
const globalStore = globalThis as typeof globalThis & { __lazyVideoLog?: Map<string, RequestRecord[]> }
const store = (globalStore.__lazyVideoLog ??= new Map<string, RequestRecord[]>())
const MAX_RUNS = 100

export function recordRequest(run: string, record: RequestRecord): void {
  store.set(run, [...(store.get(run) ?? []), record])
  if (store.size > MAX_RUNS) store.delete(store.keys().next().value as string)
}

export function readRequests(run: string): RequestRecord[] {
  return store.get(run) ?? []
}
