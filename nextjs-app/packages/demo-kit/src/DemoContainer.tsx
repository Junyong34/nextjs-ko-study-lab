'use client'

import React, { useEffect, useRef } from 'react'

export interface DemoContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

/**
 * 데모 앱 페이지의 최상위를 감싸는 공통 컨테이너 컴포넌트입니다.
 * 내부 콘텐츠의 순수 높이 변화를 감지하여 셸(부모 윈도우)의 iframe으로 `DEMO_RESIZE` postMessage를 전송합니다.
 * 무한 루프 증식을 방지하기 위해 body/html이 아닌 순수 컨테이너 DOM의 크기만 측정합니다.
 */
export function DemoContainer({
  children,
  className = '',
  ...props
}: DemoContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastHeightRef = useRef<number>(0)

  useEffect(() => {
    // 윈도우 환경 및 부모 윈도우(iframe 내부) 존재 여부 확인
    if (typeof window === 'undefined' || window.parent === window) {
      return
    }

    const sendHeight = () => {
      if (!containerRef.current) return

      // 순수 컨테이너의 렌더링 높이 측정 (부모 iframe 크기에 영향받지 않도록)
      const rect = containerRef.current.getBoundingClientRect()
      const scrollHeight = containerRef.current.scrollHeight
      const height = Math.ceil(Math.max(rect.height, scrollHeight))

      // 이전 전송 높이와 2px 이상 차이날 때만 전송하여 미세 진동/무한 루프 방지
      if (height > 0 && Math.abs(height - lastHeightRef.current) > 2) {
        lastHeightRef.current = height
        window.parent.postMessage(
          {
            type: 'DEMO_RESIZE',
            height,
          },
          window.location.origin,
        )
      }
    }

    // 마운트 후 전송
    sendHeight()
    const timerId = setTimeout(sendHeight, 100)

    // ResizeObserver는 오직 컨테이너 자체만 관찰 (body 관찰 금지 -> 무한 루프 방지)
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        sendHeight()
      })
      resizeObserver.observe(containerRef.current)
    }

    // DOM Mutation 감지
    let mutationObserver: MutationObserver | null = null
    if (typeof MutationObserver !== 'undefined' && containerRef.current) {
      mutationObserver = new MutationObserver(() => {
        sendHeight()
      })
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      })
    }

    return () => {
      clearTimeout(timerId)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      if (mutationObserver) {
        mutationObserver.disconnect()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`demo-container w-full bg-white p-4 font-sans text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
