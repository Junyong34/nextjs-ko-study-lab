'use client'

import { useEffect, useState, type RefObject } from 'react'

/** 데모 앱이 부모 셸로 높이를 알릴 때 쓰는 메시지 타입. */
export const DEMO_RESIZE = 'DEMO_RESIZE'

export interface DemoResizeBridgeOptions {
  /** 첫 렌더의 iframe 높이 (px). CLS를 줄이려고 미리 잡아둔다 */
  initialHeight: number
  /** 이보다 낮은 높이는 받지 않는다 */
  minHeight: number
}

/**
 * iframe 안 데모가 보내는 `DEMO_RESIZE`를 받아 높이를 따라갑니다.
 *
 * 이 로직이 `DemoViewer`(셸)와 `DemoFrame`(문서 본문)에 **두 벌로** 있었습니다.
 * origin 검증이 걸린 코드가 복사돼 있다는 게 특히 문제였습니다 — 한쪽만 고치면
 * 다른 쪽 구멍이 남습니다.
 *
 * 2px 문턱을 두는 이유: 소수점 높이가 오갈 때 setState가 무한히 반복되는 것을 막습니다.
 */
export function useDemoResizeBridge(
  iframeRef: RefObject<HTMLIFrameElement | null>,
  { initialHeight, minHeight }: DemoResizeBridgeOptions,
) {
  const [height, setHeight] = useState<number>(initialHeight)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 1. 같은 오리진에서 온 메시지만 받는다.
      //    모든 zone이 셸과 같은 오리진에 rewrite로 붙어 있다 (03. 3-1).
      if (typeof window === 'undefined' || event.origin !== window.location.origin) {
        return
      }

      // 2. 다른 iframe이 보낸 것은 무시한다. 한 화면에 프레임이 여럿일 수 있다.
      if (
        iframeRef.current &&
        iframeRef.current.contentWindow &&
        event.source !== iframeRef.current.contentWindow
      ) {
        return
      }

      if (
        event.data &&
        typeof event.data === 'object' &&
        event.data.type === DEMO_RESIZE &&
        typeof event.data.height === 'number'
      ) {
        const nextHeight = Math.max(event.data.height, minHeight)
        setHeight((prev) => (Math.abs(prev - nextHeight) > 2 ? nextHeight : prev))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [iframeRef, minHeight])

  return height
}
