'use client'

import { useEffect, useState } from 'react'

export interface EntrySignals {
  measured: boolean
  /** PerformanceNavigationTiming.type — 'navigate' | 'reload' | 'back_forward' | 'prerender' */
  navigationType: string | null
  /** 브라우저가 문서를 최초로 요청한 경로 */
  documentEntryPath: string | null
  /** documentEntryPath === 현재 경로 → 하드 내비게이션(직접 진입·새로고침). 측정 전엔 null */
  isHard: boolean | null
  /** responseEnd - responseStart. HTML 응답이 몇 ms에 걸쳐 도착했는가(스트리밍이면 길다) */
  streamMs: number | null
  /** 지금 document.title */
  title: string
}

/**
 * 진입 방식과 탭 제목을 브라우저가 기록한 값으로 읽는다. useState 토글이 아니다.
 * - Navigation Timing: 링크 이동(소프트)은 새 문서를 요청하지 않으므로 최초 요청 경로 ≠ 현재 경로.
 * - document.title: 메타데이터가 스트리밍으로 늦게 붙을 수 있어 <head> 변화를 관찰한다.
 */
export function useEntrySignals(currentPath: string): EntrySignals {
  const [nav, setNav] = useState<Omit<EntrySignals, 'title'>>({
    measured: false,
    navigationType: null,
    documentEntryPath: null,
    isHard: null,
    streamMs: null,
  })
  const [title, setTitle] = useState('')

  useEffect(() => {
    const measure = () => {
      const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      if (!entry) return
      const documentEntryPath = new URL(entry.name).pathname
      setNav({
        measured: true,
        navigationType: entry.type,
        documentEntryPath,
        isHard: documentEntryPath === currentPath,
        streamMs: Math.round(entry.responseEnd - entry.responseStart),
      })
    }

    // 스트리밍 중에는 하이드레이션이 응답 수신보다 먼저 끝날 수 있다. 그때 responseEnd는 아직 0이라
    // streamMs가 음수가 되므로, 문서 로드가 끝난 뒤(= HTML 마지막 청크 도착 후)에 측정한다.
    if (document.readyState === 'complete') {
      measure()
      return
    }
    window.addEventListener('load', measure, { once: true })
    return () => window.removeEventListener('load', measure)
  }, [currentPath])

  useEffect(() => {
    const read = () => setTitle(document.title)
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.head, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [])

  return { ...nav, title }
}
