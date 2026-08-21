import React from 'react'
import { cn } from '../cn'
import { FIELD_SURFACE } from '../styles'

/**
 * 좌측 트리 검색창과 피드백 폼 3필드가 같은 11개짜리 클래스 체인을 복붙하고 있었습니다.
 * 다른 것은 padding뿐입니다 — 검색창은 아이콘 자리를 비워야 합니다.
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** withIcon: 좌측 아이콘 자리를 비운 검색창용 padding */
  padding?: 'normal' | 'withIcon'
}

const PADDING = {
  normal: 'px-3 py-2',
  withIcon: 'py-1.5 pl-8 pr-3',
} as const

export function Input({ padding = 'normal', className = '', ...props }: InputProps) {
  return <input className={cn(FIELD_SURFACE, PADDING[padding], className)} {...props} />
}

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className = '', ...props }: TextareaProps) {
  return <textarea className={cn(FIELD_SURFACE, PADDING.normal, 'resize-none', className)} {...props} />
}
