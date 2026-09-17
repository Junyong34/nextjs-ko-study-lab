'use client'

import { useEffect, useState } from 'react'

export interface LiveHead {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
}

/**
 * 지금 이 문서(iframe 안의 demo-baseline 페이지)가 실제로 받은 <head> 태그를
 * DOM에서 직접 읽는다 — 가짜 텍스트가 아니다.
 * generateMetadata는 비동기라 클라이언트 내비게이션 시 <head> 갱신이 초기 렌더보다
 * 늦게 도착할 수 있다 — 마운트 시 한 번만 읽으면 갱신 전의 값을 캡처해버리므로,
 * MutationObserver로 실제 <head> 변경을 계속 지켜보다가 바뀔 때마다 다시 읽는다.
 */
export function useLiveHead(): LiveHead | null {
  const [liveHead, setLiveHead] = useState<LiveHead | null>(null)

  useEffect(() => {
    const readHead = () => {
      setLiveHead({
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
        ogDescription:
          document.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? '',
      })
    }

    readHead()

    const observer = new MutationObserver(readHead)
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['content'],
    })

    return () => observer.disconnect()
  }, [])

  return liveHead
}
