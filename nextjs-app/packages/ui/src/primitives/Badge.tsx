import React from 'react'
import { cn } from '../cn'
import { STATUS_TONE } from '../styles'

/**
 * 화면의 배지들은 서로 미묘하게 다릅니다. 예를 들어 zone 배지는
 * 데모 색인에서 `text-[11px] font-medium`, 독립 열람에서 `text-xs font-semibold`입니다.
 * 통일하면 화면이 바뀌므로 기존 크기를 variant로 보존합니다.
 */

export interface StatusBadgeProps {
  /** demos.yaml의 status 값 */
  status: string
  /**
   * pill: 데모 색인·독립 열람의 둥근 배지 (아이콘 동반)
   * tag:  문서 하단 카드의 사각 태그 (아이콘 없음)
   */
  variant?: 'pill' | 'tag'
  /** pill에서 상태 아이콘 (CheckCircle2 / Clock) */
  icon?: React.ReactNode
  className?: string
}

export function StatusBadge({
  status,
  variant = 'pill',
  icon,
  className = '',
}: StatusBadgeProps) {
  const tone = status === 'done' ? STATUS_TONE.done : STATUS_TONE.pending
  const label =
    status === 'done'
      ? '완료'
      : status === 'wip' || status === 'stub'
        ? '준비 중'
        : status.toUpperCase()

  if (variant === 'tag') {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
          tone.tag,
          className,
        )}
      >
        {label}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tone.pill,
        className,
      )}
    >
      {icon}
      <span>{label}</span>
    </span>
  )
}

export interface CountBadgeProps {
  children: React.ReactNode
  className?: string
}

/** 좌측 트리에서 하위 항목 개수를 보여주는 작은 배지. */
export function CountBadge({ children, className = '' }: CountBadgeProps) {
  return (
    <span
      className={cn(
        'shrink-0 inline-flex items-center justify-center rounded-full border border-zinc-200/80 bg-zinc-100/90 px-1.5 py-0.2 font-mono text-[9px] font-medium text-zinc-500 transition-colors group-hover:border-zinc-300 group-hover:bg-zinc-200/70 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400 dark:group-hover:border-zinc-700',
        className,
      )}
    >
      {children}
    </span>
  )
}
