'use client'

import React, { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { toRel } from '../routes'
import type { ChainNode } from '../types'
import { useObservation } from './ObservationContext'

/**
 * 조상 체인을 실제 DOM에서 읽는다. 서버가 렌더한 data-layout 속성을 가진 요소와
 * 루트 layout이 만든 body·html 요소를 만나는 순서대로 기록한다 (바깥 → 안쪽).
 */
function readAncestorChain(start: HTMLElement, pageFile: string): ChainNode[] {
  const chain: ChainNode[] = [{ kind: 'page', file: pageFile }]
  let el: HTMLElement | null = start.parentElement
  while (el) {
    const layoutFile = el.getAttribute('data-layout')
    if (layoutFile) chain.unshift({ kind: 'layout', file: layoutFile })
    else if (el === document.body) chain.unshift({ kind: 'body' })
    else if (el === document.documentElement) chain.unshift({ kind: 'html', lang: el.getAttribute('lang') ?? '' })
    el = el.parentElement
  }
  return chain
}

/** 각 page.tsx가 렌더하는 관측 지점. 마운트되면 자기 위치에서 조상을 거슬러 올라가 보고한다. */
export function PageProbe({ pageFile, children }: { pageFile: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const { reportPage } = useObservation()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    reportPage({
      rel: toRel(pathname),
      chain: readAncestorChain(el, pageFile),
      htmlCount: document.getElementsByTagName('html').length,
      bodyCount: document.getElementsByTagName('body').length,
    })
  }, [pathname, pageFile, reportPage])

  return (
    <section
      ref={ref}
      data-page={pageFile}
      className="rounded border border-emerald-300 bg-emerald-50/40 p-3 text-xs dark:border-emerald-800 dark:bg-emerald-950/20"
    >
      <p className="mb-1 font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">{pageFile}</p>
      <div className="text-zinc-700 dark:text-zinc-300">{children}</div>
    </section>
  )
}
