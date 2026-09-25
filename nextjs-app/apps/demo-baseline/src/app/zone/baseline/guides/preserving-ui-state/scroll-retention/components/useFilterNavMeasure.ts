'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MSG_FRAME_READY, MSG_NAV_RECORD } from '../types'
import type { FrameReadyMessage, NavMethod, NavRecord, NavRecordMessage } from '../types'

const TIMEOUT_MS = 15000

const round = (n: number) => Math.round(n)
const pageRoot = () => document.querySelector<HTMLElement>('[data-scroll-page]')
const pane = (name: 'kept' | 'keyed') => document.querySelector<HTMLElement>(`[data-pane="${name}"]`)

function postToParent(message: FrameReadyMessage | NavRecordMessage) {
  if (window.parent !== window) window.parent.postMessage(message, location.origin)
}

/**
 * iframe 문서 안에서 필터 변경 1회를 실측한다. layout 쪽 컴포넌트에서 쓰이므로 이동 중에도 state가 유지된다.
 * 스크롤 값은 읽기만 한다. 이동 중 스크롤을 움직이는 것은 Next.js 라우터(와 브라우저)뿐이다.
 */
export function useFilterNavMeasure() {
  const [seq, setSeq] = useState(0)
  const seqRef = useRef(0)
  const [lastRecord, setLastRecord] = useState<NavRecord | null>(null)

  useEffect(() => {
    postToParent({ type: MSG_FRAME_READY, timeOrigin: performance.timeOrigin, href: location.href })
  }, [])

  /** 이동을 시작하기 직전(Link onClick / router 호출 직전)에 호출한다. */
  const begin = useCallback((method: NavMethod, href: string) => {
    const target = new URL(href, location.href)
    const keptNode = pane('kept')
    const keyedNode = pane('keyed')
    const before = {
      y: round(window.scrollY),
      pageTop: round(pageRoot()?.getBoundingClientRect().top ?? 0),
      kept: round(keptNode?.scrollTop ?? 0),
      keyed: round(keyedNode?.scrollTop ?? 0),
      renderId: pageRoot()?.dataset.renderId ?? '',
      search: location.search,
    }
    const vh = document.documentElement.clientHeight
    const startedAt = performance.now()

    const finish = (timedOut: boolean) => {
      const root = pageRoot()
      seqRef.current += 1
      const record: NavRecord = {
        seq: seqRef.current,
        method,
        fromSearch: before.search,
        toSearch: target.search,
        receivedSearch: root?.dataset.receivedSearch ?? '',
        renderIdBefore: before.renderId,
        renderIdAfter: root?.dataset.renderId ?? '',
        beforeY: before.y,
        afterY: round(window.scrollY),
        viewportH: vh,
        pageTopBefore: before.pageTop,
        pageTopAfter: round(root?.getBoundingClientRect().top ?? 0),
        keptBefore: before.kept,
        keptAfter: round(pane('kept')?.scrollTop ?? 0),
        keyedBefore: before.keyed,
        keyedAfter: round(pane('keyed')?.scrollTop ?? 0),
        keptReplaced: pane('kept') !== keptNode,
        keyedReplaced: pane('keyed') !== keyedNode,
        timeOrigin: performance.timeOrigin,
        elapsedMs: round(performance.now() - startedAt),
        timedOut,
      }
      setSeq(seqRef.current)
      setLastRecord(record)
      postToParent({ type: MSG_NAV_RECORD, record })
    }

    // 이동 완료 조건: 주소창 search가 목적지와 같고, 서버가 그 searchParams로 렌더링한 Page가 DOM에 커밋됨.
    // Next.js의 스크롤 처리는 같은 커밋의 레이아웃 이펙트에서 끝나므로 조건 충족 후 2프레임 뒤에 읽는다.
    const tick = () => {
      const urlDone = location.search === target.search
      const root = pageRoot()
      const pageDone = root?.dataset.receivedSearch === target.search && root.dataset.renderId !== before.renderId
      if (urlDone && pageDone) {
        requestAnimationFrame(() => requestAnimationFrame(() => finish(false)))
        return
      }
      if (performance.now() - startedAt > TIMEOUT_MS) {
        finish(true)
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])

  return { seq, lastRecord, begin }
}

const readLive = () => ({
  y: round(window.scrollY),
  kept: round(pane('kept')?.scrollTop ?? 0),
  keyed: round(pane('keyed')?.scrollTop ?? 0),
  vh: document.documentElement.clientHeight,
})

/**
 * 문서·패널 스크롤 값을 그대로 보여주기 위한 훅. scroll 이벤트는 버블링되지 않으므로 capture로 받는다.
 * @param seq 이동이 끝날 때마다 바뀌는 값 — key 교체로 새로 생긴 패널 B의 값을 다시 읽기 위해 쓴다.
 */
export function useLiveScroll(seq: number) {
  const [live, setLive] = useState({ y: 0, kept: 0, keyed: 0, vh: 0 })
  const [timeOrigin, setTimeOrigin] = useState<number | null>(null)
  useEffect(() => {
    setTimeOrigin(round(performance.timeOrigin))
    const update = () => setLive(readLive())
    update()
    document.addEventListener('scroll', update, { capture: true, passive: true })
    window.addEventListener('resize', update)
    return () => {
      document.removeEventListener('scroll', update, { capture: true })
      window.removeEventListener('resize', update)
    }
  }, [])
  useEffect(() => {
    setLive(readLive())
  }, [seq])
  return { live, timeOrigin }
}
