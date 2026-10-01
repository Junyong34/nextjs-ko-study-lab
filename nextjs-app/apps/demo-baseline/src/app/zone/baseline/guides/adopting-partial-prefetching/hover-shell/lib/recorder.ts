import type { RscRequest } from '../types'

interface Handlers {
  onStart: (r: RscRequest) => void
  onUpdate: (id: number, patch: Partial<RscRequest>) => void
}

let seq = 0

/**
 * window.fetch를 감싸 App Router가 보내는 RSC 요청(`RSC: 1` 헤더)의 헤더·타이밍을 기록한다.
 * 라우터는 호출 시점에 전역 fetch를 읽으므로 이 계측이 그대로 적용된다. 반환 함수로 원복한다.
 */
export function installFetchRecorder({ onStart, onUpdate }: Handlers): () => void {
  const original = window.fetch

  const patched: typeof window.fetch = function (input, init) {
    const request = input instanceof Request ? input : null
    const headers = new Headers(init?.headers ?? request?.headers)
    if (!headers.has('rsc')) return original.call(window, input, init)

    const href = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const url = new URL(href, location.href)
    const prefetchHeader = headers.get('next-router-prefetch')
    const segmentPrefetch = headers.get('next-router-segment-prefetch')
    const id = ++seq
    const startedAt = performance.now()

    onStart({
      id,
      kind: prefetchHeader !== null || segmentPrefetch !== null ? 'prefetch' : 'navigation',
      path: url.pathname,
      hasRscParam: url.searchParams.has('_rsc'),
      prefetchHeader,
      segmentPrefetch,
      startedAt,
      headersMs: null,
      bodyMs: null,
      status: null,
    })

    const pending = original.call(window, input, init)
    pending.then(
      (res) => {
        onUpdate(id, { headersMs: Math.round(performance.now() - startedAt), status: res.status })
        // 라우터가 읽는 스트림과 별개로 복제본을 끝까지 읽어 body 완료 시점을 잰다.
        const reader = res.clone().body?.getReader()
        if (!reader) return
        const drain = async () => {
          while (!(await reader.read()).done);
          onUpdate(id, { bodyMs: Math.round(performance.now() - startedAt) })
        }
        drain().catch(() => {})
      },
      () => {},
    )
    return pending
  }

  window.fetch = patched
  return () => {
    if (window.fetch === patched) window.fetch = original
  }
}
