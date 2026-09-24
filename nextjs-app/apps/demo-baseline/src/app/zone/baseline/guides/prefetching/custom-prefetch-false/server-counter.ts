// 서버 전용 모듈: 목적지 layout/page가 실제로 서버에서 실행된 횟수를 센다.
// 라우트 엔트리마다 번들이 달라도 같은 프로세스 안에서는 한 저장소를 보도록 globalThis에 둔다.
// (서버리스 배포에서는 인스턴스마다 따로 세므로 학습용 근사치다.)
import type { ServerCounts } from './types'

const KEY = '__guides_prefetching_custom_prefetch_false_counts__'
type Store = { counts: ServerCounts }
const g = globalThis as typeof globalThis & { [KEY]?: Store }

function store(): Store {
  if (!g[KEY]) g[KEY] = { counts: {} }
  return g[KEY]
}

export function recordRender(id: string, kind: 'layout' | 'page') {
  const counts = store().counts
  const row = counts[id] ?? { layout: 0, page: 0 }
  row[kind] += 1
  counts[id] = row
}

export function readCounts(): ServerCounts {
  return structuredClone(store().counts)
}

export function resetCounts() {
  store().counts = {}
}
