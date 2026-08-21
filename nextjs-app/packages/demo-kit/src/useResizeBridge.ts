'use client'

import { useEffect, useRef, type RefObject } from 'react'

/** 셸의 `useDemoResizeBridge`가 기다리는 메시지 타입. 양쪽이 같은 문자열을 써야 한다. */
export const DEMO_RESIZE = 'DEMO_RESIZE'

/**
 * 데모 내용의 높이를 재서 부모 셸(iframe 바깥)로 알립니다. 브릿지의 **보내는 쪽**입니다.
 * 받는 쪽은 `@study/docs-render`의 `useDemoResizeBridge`입니다.
 *
 * 반드시 컨테이너 DOM만 관찰합니다. body나 html을 관찰하면 iframe 높이가 늘어난 것이
 * 다시 측정값을 키우는 되먹임이 생겨 무한히 자랍니다.
 */
export function useResizeBridge(containerRef: RefObject<HTMLDivElement | null>) {
  const lastHeightRef = useRef<number>(0)

  useEffect(() => {
    // iframe 안이 아니면 보낼 곳이 없다
    if (typeof window === 'undefined' || window.parent === window) {
      return
    }

    const sendHeight = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const scrollHeight = containerRef.current.scrollHeight
      const height = Math.ceil(Math.max(rect.height, scrollHeight))

      // 2px 미만 흔들림은 보내지 않는다 — 소수점 높이로 진동하는 것을 막는다
      if (height > 0 && Math.abs(height - lastHeightRef.current) > 2) {
        lastHeightRef.current = height
        window.parent.postMessage({ type: DEMO_RESIZE, height }, window.location.origin)
      }
    }

    sendHeight()
    // 첫 페인트 직후 폰트·이미지가 자리를 잡고 나서 한 번 더 잰다
    const timerId = setTimeout(sendHeight, 100)

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(sendHeight)
      resizeObserver.observe(containerRef.current)
    }

    let mutationObserver: MutationObserver | null = null
    if (typeof MutationObserver !== 'undefined' && containerRef.current) {
      mutationObserver = new MutationObserver(sendHeight)
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      })
    }

    return () => {
      clearTimeout(timerId)
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
    }
  }, [containerRef])
}
