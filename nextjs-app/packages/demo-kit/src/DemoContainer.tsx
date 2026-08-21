'use client'

import React, { useRef } from 'react'
import { useResizeBridge } from './useResizeBridge'

export interface DemoContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

/**
 * 데모 페이지의 최상위를 감싸는 컨테이너입니다.
 * 내용의 높이 변화를 셸에 알려 iframe이 따라오게 합니다 — 측정과 전송은 `useResizeBridge`가 합니다.
 */
export function DemoContainer({ children, className = '', ...props }: DemoContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useResizeBridge(containerRef)

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
