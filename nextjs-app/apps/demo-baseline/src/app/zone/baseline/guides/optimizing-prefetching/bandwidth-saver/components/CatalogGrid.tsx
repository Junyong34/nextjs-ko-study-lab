'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { MODES, SKUS, itemHref } from '../catalog'
import type { PrefetchMode } from '../types'
import { HoverPrefetchLink } from './HoverPrefetchLink'

const CELL =
  'block rounded border border-zinc-200 bg-white px-2 py-2 text-center font-mono text-[11px] text-zinc-700 transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600'

interface CatalogGridProps {
  mode: PrefetchMode
  onModeChange: (mode: PrefetchMode) => void
  registerLink: (el: HTMLElement | null) => void
  onHover: (mode: PrefetchMode, sku: string) => void
}

function CatalogLink({ mode, sku, onHover }: { mode: PrefetchMode; sku: string; onHover: CatalogGridProps['onHover'] }) {
  const href = itemHref(mode, sku)
  const intent = () => onHover(mode, sku)
  if (mode === 'hover') {
    return (
      <HoverPrefetchLink href={href} className={CELL} onIntent={intent}>
        {sku}
      </HoverPrefetchLink>
    )
  }
  // full → prefetch={true}, auto → prefetch 미지정, off → prefetch={false}
  const prefetch = mode === 'full' ? true : mode === 'off' ? false : undefined
  return (
    <Link href={href} prefetch={prefetch} className={CELL} onMouseEnter={intent}>
      {sku}
    </Link>
  )
}

export function CatalogGrid({ mode, onModeChange, registerLink, onHover }: CatalogGridProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const current = MODES.find((m) => m.key === mode)!

  return (
    <div className="space-y-3">
      <div role="radiogroup" aria-label="prefetch 전략" className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            role="radio"
            aria-checked={m.key === mode}
            onClick={() => onModeChange(m.key)}
            className={`rounded-md border px-2 py-1.5 text-left text-xs transition ${
              m.key === mode
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            <span className="block font-semibold">{m.label}</span>
            <span className="block font-mono text-[10px] opacity-80">{m.code}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-600 dark:text-zinc-400">
        <span>
          상품 {SKUS.length}개 · <strong className="text-zinc-900 dark:text-zinc-100">{current.label}</strong> — {current.summary}
        </span>
        <button
          type="button"
          onClick={() => boxRef.current?.scrollBy({ top: boxRef.current.clientHeight, behavior: 'smooth' })}
          className="rounded-md border border-zinc-300 px-2 py-1 font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          한 화면 아래로 스크롤
        </button>
      </div>

      {/* key={mode}: 모드를 바꾸면 링크 96개를 새로 마운트하고 스크롤을 맨 위로 되돌린다. */}
      <div
        key={mode}
        ref={boxRef}
        className="h-64 overflow-y-auto rounded-lg border border-zinc-300 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {SKUS.map((sku) => (
            <li key={sku} ref={registerLink} data-mode={mode} data-sku={sku}>
              <CatalogLink mode={mode} sku={sku} onHover={onHover} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
