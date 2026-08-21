'use client'

import React from 'react'

export interface DemoPlaygroundCardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

/**
 * 2단 [데모 예제] 실습 조작 영역을 감싸는 표준 fieldset 컴포넌트입니다.
 * 선명한 테두리와 넉넉한 내부 여백을 적용하여 가이드/검증 영역과 뚜렷하게 구분됩니다.
 */
export function DemoPlaygroundCard({
  title = '데모 예제',
  children,
  className = '',
}: DemoPlaygroundCardProps) {
  return (
    <fieldset
      className={`rounded-lg border border-zinc-400/90 bg-white p-4 sm:p-5 shadow-2xs dark:border-zinc-700 dark:bg-zinc-950 ${className}`}
    >
      <legend className="px-2.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
        [데모 예제] {title}
      </legend>
      <div className="mt-1.5">{children}</div>
    </fieldset>
  )
}
