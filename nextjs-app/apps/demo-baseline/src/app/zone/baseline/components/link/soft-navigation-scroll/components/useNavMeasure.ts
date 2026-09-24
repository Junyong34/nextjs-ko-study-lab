'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MSG_FRAME_READY, MSG_NAV_RECORD } from '../types'
import type { FrameReadyMessage, NavKind, NavRecord, NavRecordMessage } from '../types'

const TIMEOUT_MS = 15000

const round = (n: number) => Math.round(n)
const pageRoot = () => document.querySelector<HTMLElement>('[data-scroll-page]')
/** scrollIntoView가 정렬시킨 섹션 찾기: rect.top === scroll-margin-top(±2px) */
function findLandedSection() {
  for (const el of document.querySelectorAll<HTMLElement>('[data-scroll-page] section[id]')) {
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
    if (Math.abs(el.getBoundingClientRect().top - margin) <= 2) return el.id
  }
  return null
}
const pathWithHash = () => `${location.pathname.split('/').slice(-2).join('/')}${location.hash}`

function postToParent(message: FrameReadyMessage | NavRecordMessage) {
  if (window.parent !== window) window.parent.postMessage(message, location.origin)
}

/**
 * iframe 문서 안에서 <Link> 클릭 1회를 실측한다.
 * 이 훅은 viewport/layout.tsx 쪽 컴포넌트에서 쓰이므로 Page 세그먼트가 바뀌어도 state가 유지된다.
 * 스크롤은 절대 건드리지 않는다 — 읽기만 한다. 스크롤 이동은 전부 Next.js 라우터가 한다.
 */
export function useNavMeasure() {
  const [seq, setSeq] = useState(0)
  const seqRef = useRef(0)
  const [lastRecord, setLastRecord] = useState<NavRecord | null>(null)

  useEffect(() => {
    postToParent({ type: MSG_FRAME_READY, timeOrigin: performance.timeOrigin, href: location.href })
  }, [])

  /** <Link onClick>에서 호출된다. onClick은 라우터가 이동을 시작하기 전에 실행된다. */
  const begin = useCallback((kind: NavKind, href: string) => {
    const target = new URL(href, location.href)
    const targetChapter = target.pathname.split('/').pop()
    const hashId = target.hash ? decodeURIComponent(target.hash.slice(1)) : null
    const vh = document.documentElement.clientHeight
    const before = {
      y: round(window.scrollY),
      pageTop: round(pageRoot()?.getBoundingClientRect().top ?? 0),
      targetTop: hashId ? document.getElementById(hashId)?.getBoundingClientRect().top ?? null : null,
      fromUrl: pathWithHash(),
      hashChanged: location.pathname === target.pathname && location.hash !== target.hash,
    }
    const startedAt = performance.now()

    const finish = (timedOut: boolean) => {
      const targetEl = hashId ? document.getElementById(hashId) : null
      seqRef.current += 1
      const record: NavRecord = {
        seq: seqRef.current,
        kind,
        fromUrl: before.fromUrl,
        toUrl: pathWithHash(),
        beforeY: before.y,
        afterY: round(window.scrollY),
        viewportH: vh,
        pageTopBefore: before.pageTop,
        pageTopAfter: round(pageRoot()?.getBoundingClientRect().top ?? 0),
        targetTopBefore: before.targetTop === null ? null : round(before.targetTop),
        targetTopAfter: targetEl ? round(targetEl.getBoundingClientRect().top) : null,
        scrollMarginTop: targetEl ? round(parseFloat(getComputedStyle(targetEl).scrollMarginTop) || 0) : null,
        landedOn: findLandedSection(),
        hashChanged: before.hashChanged,
        timeOrigin: performance.timeOrigin,
        elapsedMs: round(performance.now() - startedAt),
        timedOut,
      }
      setSeq(seqRef.current)
      setLastRecord(record)
      postToParent({ type: MSG_NAV_RECORD, record })
    }

    // 이동 완료 조건: 주소창(pathname+hash)이 목적지와 같고, 목적지 Page가 DOM에 커밋됨.
    // Next.js의 스크롤 처리는 같은 커밋의 레이아웃 이펙트에서 끝나므로, 조건 충족 후 2프레임 뒤에 읽는다.
    const tick = () => {
      const urlDone = location.pathname === target.pathname && location.hash === target.hash
      const pageDone = pageRoot()?.dataset.chapter === targetChapter
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

/** 스크롤 이벤트로 현재 window.scrollY를 그대로 보여주기 위한 훅 */
export function useLiveScrollY() {
  const [y, setY] = useState(0)
  const [vh, setVh] = useState(0)
  const [timeOrigin, setTimeOrigin] = useState<number | null>(null)
  useEffect(() => {
    setTimeOrigin(Math.round(performance.timeOrigin))
    const update = () => {
      setY(round(window.scrollY))
      setVh(document.documentElement.clientHeight)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return { y, vh, timeOrigin }
}
