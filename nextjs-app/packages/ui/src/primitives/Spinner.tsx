import React from 'react'
import { cn } from '../cn'

/**
 * 데모 로딩 표시. DemoViewer(h-6, 진한 대비)와 DemoFrame(h-5, 옅은 대비)이
 * 각각 만들어 쓰고 있었습니다. Phase 5에서 두 프레임이 합쳐지면 하나로 정리됩니다.
 */
export interface SpinnerProps {
  size?: 'sm' | 'md'
  /** strong: 검정/흰색 대비 / soft: 회색 대비 */
  tone?: 'strong' | 'soft'
  className?: string
}

const SIZE = {
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
} as const

const TONE = {
  strong: 'border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100',
  soft: 'border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300',
} as const

export function Spinner({ size = 'md', tone = 'strong', className = '' }: SpinnerProps) {
  return (
    <div
      className={cn('animate-spin rounded-full border-2', SIZE[size], TONE[tone], className)}
      role="status"
      aria-label="불러오는 중"
    />
  )
}
