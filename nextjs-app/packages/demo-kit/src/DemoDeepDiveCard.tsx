'use client'

import React from 'react'

export interface DemoDeepDiveCardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

/**
 * 데모 페이지 최하단에서 Next.js의 핵심 개념,
 * children 합성 구조 및 실무 원리를 명확하게 정리해 주는 표준 컴포넌트입니다.
 */
export function DemoDeepDiveCard({
  title = '핵심 개념 정리',
  children,
  className = '',
}: DemoDeepDiveCardProps) {
  return (
    <fieldset
      className={`rounded-lg border border-zinc-300 bg-white p-4 sm:p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 space-y-4 ${className}`}
    >
      <legend className="px-2.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
        [개념 정리] {title}
      </legend>
      <div className="space-y-3.5 mt-1">{children}</div>
    </fieldset>
  )
}
