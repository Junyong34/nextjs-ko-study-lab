import React from 'react'
import { cn } from '../cn'
import { CARD_SURFACE, CARD_HOVER } from '../styles'

/**
 * 데모 색인 카드(p-5, shadow-xs)와 문서 하단 카드(p-4, 살짝 떠오르는 hover)가
 * 같은 표면을 다른 밀도로 쓰고 있었습니다. 밀도 차이는 화면이므로 보존합니다.
 */
export interface CardSurfaceProps {
  /** index: 데모 색인 (p-5) / doc: 문서 하단 (p-4, hover 시 살짝 떠오름) */
  density?: 'index' | 'doc'
  className?: string
}

export const CARD_DENSITY = {
  index: 'p-5 shadow-xs transition-all',
  doc: 'p-4 transition-all duration-200 hover:-translate-y-0.5',
} as const

/** 카드 클래스 문자열만 필요할 때 (링크·div 어느 태그에나 붙일 수 있도록). */
export function cardClass({ density = 'index', className = '' }: CardSurfaceProps = {}): string {
  return cn(
    'group relative flex flex-col justify-between',
    CARD_SURFACE,
    CARD_DENSITY[density],
    CARD_HOVER,
    className,
  )
}
