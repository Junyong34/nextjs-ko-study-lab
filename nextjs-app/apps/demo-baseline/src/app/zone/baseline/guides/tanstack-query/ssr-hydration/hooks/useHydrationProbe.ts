'use client'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { useQueryClient, type QueryClient } from '@tanstack/react-query'
import { API_PATH, BASE, dealsKey } from '../lib/deals-query'
import type { DealsSnapshot, HtmlCheck, HydrationMeasure, ServerRead, ServerRenderInfo } from '../types'

/** 첫 마운트 뒤 최소 이 시간 동안의 요청을 모은다 */
export const SETTLE_MS = 1200

/** 최소 대기 후, 이 쿼리의 요청이 모두 끝날 때까지(최대 10초) 기다린다. dev에서는 첫 요청이 컴파일 때문에 느릴 수 있다. */
export function waitUntilIdle(qc: QueryClient, queryKey: readonly unknown[], done: () => void) {
  const started = Date.now()
  let timer: ReturnType<typeof setTimeout>
  const tick = () => {
    // 응답이 끝난 뒤 Resource Timing 항목이 PerformanceObserver로 전달될 시간을 한 번 더 준다.
    if (qc.isFetching({ queryKey }) === 0 || Date.now() - started > 10_000) timer = setTimeout(done, 250)
    else timer = setTimeout(tick, 200)
  }
  timer = setTimeout(tick, SETTLE_MS)
  return () => clearTimeout(timer)
}

// 이 문서(탭)에서 실습 화면이 처음 마운트되는지 — 처음이면 하드 로드(HTML), 아니면 클라이언트 이동(RSC Payload)
let mountedInThisDocument = false

export function useHydrationProbe(info: ServerRenderInfo, listRef: RefObject<HTMLElement | null>) {
  const qc = useQueryClient()
  const [mountedAt] = useState(() => (typeof performance === 'undefined' ? 0 : performance.now()))
  const [measure, setMeasure] = useState<HydrationMeasure | null>(null)
  const [isHardLoad, setIsHardLoad] = useState<boolean | null>(null)
  const [resourceStarts, setResourceStarts] = useState<number[]>([])
  const [reads, setReads] = useState<ServerRead[] | null>(null)
  const [htmlCheck, setHtmlCheck] = useState<HtmlCheck | null>(null)
  const measured = useRef(false)

  // 1) 하이드레이션 직후 첫 effect: DOM에 이미 있는 행과 queryClient 상태를 읽는다.
  useEffect(() => {
    if (measured.current) return
    measured.current = true
    setIsHardLoad(!mountedInThisDocument)
    mountedInThisDocument = true
    const st = qc.getQueryState<DealsSnapshot>(dealsKey(info.variant))
    setMeasure({
      rowsAtFirstEffect: listRef.current?.querySelectorAll('[data-deal-row]').length ?? 0,
      statusAtFirstEffect: st?.status ?? 'none',
      dataSourceAtFirstEffect: st?.data?.source ?? null,
      dataUpdatedAt: st?.dataUpdatedAt ?? 0,
      clientNow: Date.now(),
    })
  }, [qc, info.variant, listRef])

  // 2) 브라우저가 실제로 보낸 api/deals 요청(Resource Timing). 전역 설정은 바꾸지 않고 구독만 한다.
  useEffect(() => {
    const po = new PerformanceObserver((list) => {
      const starts = list.getEntries().filter((e) => e.name.includes(API_PATH)).map((e) => e.startTime)
      if (starts.length) setResourceStarts((prev) => [...prev, ...starts])
    })
    po.observe({ type: 'resource', buffered: true })
    return () => po.disconnect()
  }, [])

  // 3) 잠시 뒤 서버가 데이터를 읽은 기록을 가져온다(이번 서버 렌더 이후만).
  useEffect(
    () =>
      waitUntilIdle(qc, dealsKey(info.variant), async () => {
        const res = await fetch(`${BASE}/api/reads`, { cache: 'no-store' })
        const body = (await res.json()) as { reads: ServerRead[] }
        setReads(body.reads.filter((r) => r.at >= info.renderedAt && r.variant === info.variant))
      }),
    [qc, info.renderedAt, info.variant]
  )

  // 4) 버튼: 이 라우트의 HTML을 새로 받아 서버가 그린 행과 dehydrated state가 들어 있는지 확인한다.
  const checkHtml = async () => {
    const path = info.variant === 'prefetched' ? BASE : `${BASE}/client-only`
    const res = await fetch(path, { cache: 'no-store', headers: { Accept: 'text/html' } })
    const html = await res.text()
    const doc = new DOMParser().parseFromString(html, 'text/html')
    setHtmlCheck({
      status: res.status,
      rowsInHtml: doc.querySelectorAll('[data-deal-row]').length,
      hasDehydratedKey: html.includes('guides-tanstack-ssr-hydration'),
      bytes: html.length,
    })
  }

  /** since 이후 시작된 api/deals 요청 수 */
  const requestsSince = (since: number) => resourceStarts.filter((t) => t >= since).length

  return { mountedAt, measure, isHardLoad, reads, htmlCheck, checkHtml, requestsSince, resourceStarts }
}
