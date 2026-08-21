import React from 'react'
import { cn } from '../cn'

/** 아이콘만 있는 버튼 — 모달 닫기, 데모 프레임 툴바, 모바일 드로어 닫기. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** tight: 데모 프레임 툴바(p-1) / normal: 모달 닫기(p-1.5) */
  density?: 'tight' | 'normal'
}

const DENSITY = {
  tight: 'rounded p-1',
  normal: 'rounded-lg p-1.5',
} as const

export function IconButton({
  density = 'normal',
  className = '',
  type = 'button',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        DENSITY[density],
        'text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
