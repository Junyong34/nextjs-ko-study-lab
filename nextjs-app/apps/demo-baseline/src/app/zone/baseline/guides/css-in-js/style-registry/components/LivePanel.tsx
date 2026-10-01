'use client'

import React, { useRef } from 'react'
import { ProductShelf } from './ProductShelf'
import { StyledBadge } from './StyledBadge'
import { useStyleRegistry } from './RegistryContext'
import { measureDom } from '../lib/measureDom'
import type { DomProbeResult } from '../types'

interface LivePanelProps {
  hues: number[]
  dom: DomProbeResult | null
  onAddHue: () => void
  onMeasure: (result: DomProbeResult) => void
}

/** RegistryProvider 안에서 실제로 렌더되는 영역: 이 화면 자체가 registry의 SSR→hydrate 결과물이다. */
export function LivePanel({ hues, dom, onAddHue, onMeasure }: LivePanelProps) {
  const registry = useStyleRegistry()
  const shelfRef = useRef<HTMLDivElement>(null)

  const measure = () => onMeasure(measureDom(registry, shelfRef.current?.querySelector('span') ?? null, hues.length))

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">2. 하이드레이션 후 클라이언트 registry</div>
      <div ref={shelfRef}>
        <ProductShelf />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {hues.map((hue) => (
          <StyledBadge key={hue} tone={{ hue }}>hsl {hue}</StyledBadge>
        ))}
        {hues.length === 0 && <span className="text-[11px] text-zinc-500">클라이언트에서 만든 규칙이 아직 없습니다.</span>}
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <button type="button" onClick={onAddHue} className="cursor-pointer rounded bg-blue-600 px-3 py-1.5 font-bold text-white hover:bg-blue-700">
          클라이언트 규칙 추가
        </button>
        <button type="button" onClick={measure} className="cursor-pointer rounded bg-zinc-900 px-3 py-1.5 font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900">
          하이드레이션 후 DOM 실측
        </button>
      </div>
      <p className="font-mono text-[10px] leading-relaxed text-zinc-500">
        {dom
          ? dom.tags.map((t) => `<style data-registry="${t.source}"> in ${t.parent}, 규칙 ${t.ruleCount}개, ${t.bytes}자`).join('\n')
          : '실측 전: 위 뱃지는 SSR로 받은 규칙을, 추가 뱃지는 클라이언트가 주입한 규칙을 씁니다.'}
      </p>
    </div>
  )
}
