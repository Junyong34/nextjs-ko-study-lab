import React from 'react'
import { cn } from '../cn'
import { PRIMARY_SURFACE, OUTLINE_SURFACE } from '../styles'

/**
 * 화면에 있던 버튼들은 색만 같고 형태가 제각각이었습니다
 * (rounded-md/lg/full, px-3/3.5/4, font-medium/semibold, shadow 유무).
 * 형태를 강제로 통일하면 화면이 바뀌므로, 기존 형태를 variant로 그대로 보존합니다.
 * 통일은 별도 티켓의 몫입니다.
 */
export type ButtonVariant = 'primary' | 'outline' | 'ghost'

/** 기존 사용처의 형태를 그대로 옮겨둔 것입니다. 새 값을 만들기 전에 기존 것을 재사용하세요. */
export type ButtonShape =
  /** 데모 색인의 "데모 열기" — rounded-lg px-3.5 py-1.5 semibold */
  | 'cta'
  /** 모달 제출 — rounded-lg px-4 py-2 semibold + shadow */
  | 'submit'
  /** 문서 안 카드의 링크 버튼 — rounded-md px-3 py-1.5 medium */
  | 'compact'
  /** 목차 하단 "맨 위로 이동" — 폭 전체, 세로 중앙 */
  | 'block'

const SHAPE: Record<ButtonShape, string> = {
  cta: 'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold',
  submit: 'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm',
  compact: 'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium',
  block: 'flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium',
}

const VARIANT: Record<ButtonVariant, string> = {
  primary: PRIMARY_SURFACE,
  outline: OUTLINE_SURFACE,
  ghost:
    'text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  shape?: ButtonShape
}

export function Button({
  variant = 'primary',
  shape = 'cta',
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cn(SHAPE[shape], VARIANT[variant], className)} {...props}>
      {children}
    </button>
  )
}
