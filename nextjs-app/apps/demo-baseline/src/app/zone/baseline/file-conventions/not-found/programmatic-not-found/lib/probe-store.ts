import type { ProbeEvent, ProbeSite, ProbeSnapshot, RenderSite } from '../types'

// 서버 프로세스 메모리에 두는 실측 카운터.
// page.tsx / generateMetadata / Server Action / Route Handler는 서로 다른 모듈 그래프로
// 번들될 수 있어, 모듈 스코프 변수 대신 globalThis에 하나의 저장소를 둔다
// (functions/after/analytics-batch/lib/batch-store.ts와 같은 방식).
const STORE_KEY = Symbol.for('nextjs-ko-study-lab.file-conventions-not-found-programmatic-not-found.probe')
const MAX_EVENTS = 12

function emptySnapshot(): ProbeSnapshot {
  return {
    sites: {
      'page:missing-id': { reached: 0, after: 0 },
      'page:private': { reached: 0, after: 0 },
      'metadata:draft': { reached: 0, after: 0 },
      'review-page:missing-review': { reached: 0, after: 0 },
      'action:not-owner': { reached: 0, after: 0 },
    },
    rendered: { 'product-page': 0, 'review-page': 0, 'action:ok': 0 },
    events: [],
  }
}

interface Store {
  snapshot: ProbeSnapshot
  seq: number
}

function getStore(): Store {
  const g = globalThis as unknown as { [STORE_KEY]?: Store }
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = { snapshot: emptySnapshot(), seq: 0 }
  }
  return g[STORE_KEY]
}

function pushEvent(site: ProbeEvent['site'], kind: ProbeEvent['kind'], detail: string) {
  const store = getStore()
  store.seq += 1
  store.snapshot.events = [
    { seq: store.seq, at: new Date().toISOString(), site, kind, detail },
    ...store.snapshot.events,
  ].slice(0, MAX_EVENTS)
}

/** notFound() 바로 앞 줄에서 호출한다. */
export function markBeforeNotFound(site: ProbeSite, detail: string) {
  getStore().snapshot.sites[site].reached += 1
  pushEvent(site, 'before-notFound', detail)
}

/** notFound() 바로 다음 줄에 둔다. notFound()가 throw하므로 이 함수는 실행되지 않아야 한다. */
export function markAfterNotFound(site: ProbeSite, detail: string) {
  getStore().snapshot.sites[site].after += 1
  pushEvent(site, 'after-notFound', detail)
}

/** notFound() 없이 함수 끝까지 실행됐을 때 호출한다. */
export function markRendered(site: RenderSite, detail: string) {
  getStore().snapshot.rendered[site] += 1
  pushEvent(site, 'rendered', detail)
}

export function readProbe(): ProbeSnapshot {
  return structuredClone(getStore().snapshot)
}

export function resetProbe() {
  const store = getStore()
  store.snapshot = emptySnapshot()
  store.seq = 0
}
