'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MODE_KEYS } from '../catalog'
import type { ModeActivity, PrefetchMode } from '../types'

type ActivityByMode = Record<PrefetchMode, ModeActivity>

function emptyActivity(): ActivityByMode {
  return Object.fromEntries(MODE_KEYS.map((k) => [k, { seen: 0, hovered: 0 }])) as ActivityByMode
}

/**
 * next/link 내부 IntersectionObserver와 별개로, 이 데모의 IntersectionObserver로
 * "실제로 화면에 보인 링크 수"를 모드별로 센다. root를 지정하지 않아(뷰포트 기준)
 * 스크롤 박스에 가려진 링크는 교차하지 않은 것으로 계산된다 — Link와 같은 기준이다.
 */
export function useCatalogActivity() {
  const [activity, setActivity] = useState<ActivityByMode>(emptyActivity)
  const seenSets = useRef(new Map<PrefetchMode, Set<string>>())
  const hoverSets = useRef(new Map<PrefetchMode, Set<string>>())
  const observerRef = useRef<IntersectionObserver | null>(null)

  const bump = useCallback((sets: Map<PrefetchMode, Set<string>>, m: PrefetchMode, sku: string, field: keyof ModeActivity) => {
    const set = sets.get(m) ?? new Set<string>()
    if (set.has(sku)) return
    set.add(sku)
    sets.set(m, set)
    setActivity((prev) => ({ ...prev, [m]: { ...prev[m], [field]: set.size } }))
  }, [])

  // ref 콜백은 useEffect보다 먼저 실행되므로 observer는 첫 등록 시점에 만든다.
  const registerLink = useCallback(
    (el: HTMLElement | null) => {
      if (!el || typeof IntersectionObserver === 'undefined') return
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            const target = entry.target as HTMLElement
            bump(seenSets.current, target.dataset.mode as PrefetchMode, target.dataset.sku ?? '', 'seen')
          }
        })
      }
      observerRef.current.observe(el)
    },
    [bump],
  )

  useEffect(() => () => observerRef.current?.disconnect(), [])

  const markHover = useCallback((m: PrefetchMode, sku: string) => bump(hoverSets.current, m, sku, 'hovered'), [bump])

  return { activity, registerLink, markHover }
}
