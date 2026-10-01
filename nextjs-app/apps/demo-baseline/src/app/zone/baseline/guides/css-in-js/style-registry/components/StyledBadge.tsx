'use client'

import React from 'react'
import { useStyleRegistry } from './RegistryContext'

const BASE = 'display:inline-block;padding:2px 10px;border-radius:9999px;font-size:11px;font-weight:700;color:#fff;'

/** 서버 렌더에서 확정되는 고정 tone. 동적 tone은 hue로 새 규칙을 만든다. */
const STATIC_TONES: Record<string, string> = {
  sale: '#b91c1c',
  new: '#15803d',
}

export type BadgeTone = keyof typeof STATIC_TONES | { hue: number }

/** 렌더 중 규칙을 registry에 등록하고 클래스명만 반환하는 아주 작은 CSS-in-JS 컴포넌트 */
export function StyledBadge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  const registry = useStyleRegistry()
  const background = typeof tone === 'string' ? STATIC_TONES[tone] : `hsl(${tone.hue} 65% 38%)`
  const className = registry.insert(`&{${BASE}background:${background};}`)

  return <span className={className}>{children}</span>
}
