'use client'

import { useCallback, useEffect, useState, type RefObject } from 'react'

/** 데모 앱이 부모 셸로 높이를 알릴 때 쓰는 메시지 타입. */
export const DEMO_RESIZE = 'DEMO_RESIZE'

export interface DemoResizeBridgeOptions {
  /** 첫 렌더의 iframe 높이 (px). CLS를 줄이려고 미리 잡아둔다 */
  initialHeight: number
  /** 이보다 낮은 높이는 받지 않는다 */
  minHeight: number
}

export interface DemoResizeBridgeResult {
  height: number
  /**
   * 데모 iframe이 첫 `DEMO_RESIZE`를 보냈는지. `DemoContainer`는 마운트 직후(=Suspense
   * fallback이 이미 그려진 시점)에 이 메시지를 보낸다. 네이티브 iframe `onLoad`는 스트리밍
   * SSR 페이지에서는 모든 중첩 Suspense가 resolve되어 응답이 끝나야만 발생하므로, 그걸
   * 로딩 오버레이 해제 조건으로 쓰면 점진적 렌더링 과정이 오버레이 뒤에 전부 가려진다.
   */
  hasContentSignal: boolean
  /** iframe을 새로고침할 때 다음 로드를 위해 신호를 되돌린다. */
  resetContentSignal: () => void
}

/**
 * iframe 안 데모가 보내는 `DEMO_RESIZE`를 받아 높이를 따라가고, 데모가 살아있다는
 * 첫 신호(`hasContentSignal`)도 함께 넘겨줍니다.
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
): DemoResizeBridgeResult {
  const [height, setHeight] = useState<number>(initialHeight)
  const [hasContentSignal, setHasContentSignal] = useState(false)

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
        setHasContentSignal(true)
        const nextHeight = Math.max(event.data.height, minHeight)
        setHeight((prev) => (Math.abs(prev - nextHeight) > 2 ? nextHeight : prev))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [iframeRef, minHeight])

  const resetContentSignal = useCallback(() => setHasContentSignal(false), [])

  return { height, hasContentSignal, resetContentSignal }
}
