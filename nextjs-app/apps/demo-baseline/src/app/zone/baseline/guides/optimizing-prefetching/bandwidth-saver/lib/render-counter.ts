import type { PrefetchMode, RenderSnapshot } from '../types'

// 서버 프로세스 메모리에 두는 실측 카운터.
// 목적지 layout/page와 Server Action은 서로 다른 모듈 그래프로 번들될 수 있어
// 모듈 스코프 변수 대신 globalThis에 저장소 하나를 둔다.
// 인스턴스별 메모리이므로 서버리스(Vercel)에서는 요청이 여러 인스턴스로 나뉘면 합계가 갈라질 수 있다.
const STORE_KEY = Symbol.for('nextjs-ko-study-lab.guides-optimizing-prefetching-bandwidth-saver.renders')

function emptySnapshot(): RenderSnapshot {
  return {
    full: { layout: 0, page: 0 },
    auto: { layout: 0, page: 0 },
    hover: { layout: 0, page: 0 },
    off: { layout: 0, page: 0 },
  }
}

function getStore(): { snapshot: RenderSnapshot } {
  const g = globalThis as unknown as { [STORE_KEY]?: { snapshot: RenderSnapshot } }
  if (!g[STORE_KEY]) g[STORE_KEY] = { snapshot: emptySnapshot() }
  return g[STORE_KEY]
}

export function countRender(mode: PrefetchMode, site: 'layout' | 'page') {
  getStore().snapshot[mode][site] += 1
}

export function readRenders(): RenderSnapshot {
  return structuredClone(getStore().snapshot)
}

export function resetRenders() {
  getStore().snapshot = emptySnapshot()
}
