// Route Handler 모듈마다 하나씩 만드는 대조 카운터.
// register()의 registerCallCount(서버 인스턴스당 1회)와 달리 요청마다 증가한다.
export function createHandlerCounter() {
  let count = 0
  const loadedAtMs = Date.now()
  return {
    next: () => (count += 1),
    loadedAtMs,
  }
}
