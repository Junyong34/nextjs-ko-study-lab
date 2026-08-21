'use client'

import React, { useRef } from 'react'
import { useResizeBridge } from './useResizeBridge'

export interface DemoContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

/**
 * 데모 페이지의 최상위를 감싸는 컨테이너입니다.
 * 넉넉한 여백과 반응형 패딩을 제공하며, iframe 높이를 자동 동기화합니다.
 */
export function DemoContainer({ children, className = '', ...props }: DemoContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useResizeBridge(containerRef)

  return (
    <div
      ref={containerRef}
      className={`demo-container w-full bg-white p-4 sm:p-6 font-sans text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
