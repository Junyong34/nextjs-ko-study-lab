'use client'

import React, { useState } from 'react'

export interface DemoResetButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 초기화 콜백 함수. 미지정 시 `window.location.reload()`가 호출됩니다. */
  onReset?: () => void | Promise<void>
  /** 버튼 라벨 (기본값: "예제 초기화") */
  label?: string
  /** 진행 중 표시 텍스트 */
  loadingLabel?: string
}

/**
 * 데모 상태를 초기 상태로 되돌리기 위한 공통 리셋 버튼 컴포넌트입니다.
 */
export function DemoResetButton({
  onReset,
  label = '예제 초기화',
  loadingLabel = '초기화 중...',
  className = '',
  disabled,
  ...props
}: DemoResetButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return

    if (onReset) {
      try {
        setIsLoading(true)
        await onReset()
      } finally {
        setIsLoading(false)
      }
    } else {
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-xs transition hover:bg-zinc-50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 ${className}`}
      {...props}
    >
      <svg
        className={`h-3.5 w-3.5 text-zinc-500 transition-transform dark:text-zinc-400 ${
          isLoading ? 'animate-spin' : ''
        }`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span>{isLoading ? loadingLabel : label}</span>
    </button>
  )
}
