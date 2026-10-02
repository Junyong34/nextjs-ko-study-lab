import { routeFromPath, type RscFetch } from '../types'

/** fetch 인자에서 RSC 요청인지 판별하고 기록용 값을 뽑는다. RSC 요청이 아니면 null. */
export function describeRscRequest(input: RequestInfo | URL, init?: RequestInit): Omit<RscFetch, 'status' | 'staleTime'> | null {
  const url = new URL(input instanceof Request ? input.url : String(input), window.location.href)
  const headers = new Headers(input instanceof Request ? input.headers : init?.headers)
  const isRsc = headers.get('rsc') === '1' || url.searchParams.has('_rsc')
  if (!isRsc) return null
  return {
    route: routeFromPath(url.pathname),
    path: url.pathname,
    prefetch: headers.has('next-router-prefetch') || headers.has('next-router-segment-prefetch'),
    startedAt: performance.now(),
  }
}

/**
 * window.fetch를 감싸 Next 라우터의 RSC 요청을 기록한다. 원래 fetch를 그대로 호출하고 응답도 그대로 돌려준다.
 * Next 라우터는 호출 시점에 전역 fetch를 찾으므로(segment-cache/fetch.js) 감싼 함수가 요청을 본다.
 * 반환 함수로 원래 fetch를 되돌린다.
 */
export function instrumentFetch(onRecord: (record: RscFetch) => void): () => void {
  const original = window.fetch
  const wrapped: typeof window.fetch = async (input, init) => {
    const described = describeRscRequest(input, init)
    const response = await original(input, init)
    if (described) {
      onRecord({ ...described, status: response.status, staleTime: response.headers.get('x-nextjs-stale-time') })
    }
    return response
  }
  window.fetch = wrapped
  return () => {
    if (window.fetch === wrapped) window.fetch = original
  }
}
