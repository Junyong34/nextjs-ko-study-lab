'use client'

import { useEffect, useState } from 'react'

export interface LiveHead {
  title: string
  canonical: string | null
  ogSiteName: string | null
  ogTitle: string | null
  ogImage: string | null
  /** generateMetadata가 `other`로 심어둔, 서버에서 await parent로 읽은 openGraph.siteName */
  parentOgSiteNameFromServer: string | null
}

/**
 * 지금 이 문서가 실제로 받은 <head> 태그(title, canonical, og:site_name, og:title, og:image)를
 * DOM에서 직접 읽는다 — 부모 상속 여부를 텍스트로 주장하지 않고 실측한다.
 * generateMetadata는 비동기라 클라이언트 내비게이션 시 <head> 갱신이 초기 렌더보다
 * 늦게 도착할 수 있어, MutationObserver로 실제 변경을 지켜보다가 바뀔 때마다 다시 읽는다.
 */
export function useLiveHead(): LiveHead | null {
  const [liveHead, setLiveHead] = useState<LiveHead | null>(null)

  useEffect(() => {
    const readHead = () => {
      setLiveHead({
        title: document.title,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
        ogSiteName: document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ?? null,
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? null,
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? null,
        parentOgSiteNameFromServer:
          document.querySelector('meta[name="x-demo-parent-og-site-name"]')?.getAttribute('content') ?? null,
      })
    }

    readHead()

    const observer = new MutationObserver(readHead)
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['content', 'href'],
    })

    return () => observer.disconnect()
  }, [])

  return liveHead
}
