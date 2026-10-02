'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { RscRequest } from '../types'

function readHeaders(input: RequestInfo | URL, init?: RequestInit) {
  return new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined))
}

function toUrl(input: RequestInfo | URL) {
  return new URL(input instanceof Request ? input.url : String(input), window.location.href)
}

/**
 * 이 레이아웃이 마운트된 동안만 window.fetch를 감싸 클라이언트 라우터의 RSC 요청(_rsc 쿼리)을 기록한다.
 * Next.js 라우터는 탐색할 때 전역 fetch를 호출하므로(next/dist/client/components/segment-cache/fetch.js) 실제 요청이 그대로 잡힌다.
 * 응답 본문은 읽지 않고 상태 코드와 content-type만 본다.
 */
export function useRscLog() {
  const [requests, setRequests] = useState<RscRequest[]>([])
  const seq = useRef(0)

  useEffect(() => {
    const original = window.fetch
    const patched: typeof window.fetch = async (input, init) => {
      const url = toUrl(input)
      const rscQuery = url.searchParams.get('_rsc')
      if (rscQuery === null) return original(input, init)

      const headers = readHeaders(input, init)
      const entry: RscRequest = {
        seq: ++seq.current,
        url: url.pathname + url.search,
        pathname: url.pathname,
        rscQuery,
        rscHeader: headers.get('rsc'),
        kind: headers.has('next-router-prefetch') ? 'prefetch' : 'navigation',
        status: null,
        contentType: null,
      }
      try {
        const res = await original(input, init)
        setRequests((prev) => [{ ...entry, status: res.status, contentType: res.headers.get('content-type') }, ...prev].slice(0, 12))
        return res
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        setRequests((prev) => [{ ...entry, error: message }, ...prev].slice(0, 12))
        throw error
      }
    }
    window.fetch = patched
    return () => {
      // 다른 코드가 그 사이에 fetch를 다시 감쌌다면 건드리지 않는다.
      if (window.fetch === patched) window.fetch = original
    }
  }, [])

  const clear = useCallback(() => setRequests([]), [])
  return { requests, clear }
}
