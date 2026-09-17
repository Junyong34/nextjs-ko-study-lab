'use client'

import { useCallback, useRef, useState } from 'react'
import type { PrefetchVariant } from '../types'

/**
 * next/link 내부 IntersectionObserver와는 별개로, 이 데모 자체의 IntersectionObserver로
 * "링크가 실제 뷰포트에 교차했는가"를 독립적으로 검증한다.
 * prefetch={false} 링크는 요청이 0건이어야 정상이므로, 요청 유무만으로는
 * "스크롤을 안 해서 관찰이 안 된 것"과 "관찰했지만 정상적으로 요청이 없는 것"을 구분할 수 없다.
 */
export function useViewportSeen(variants: readonly PrefetchVariant[]) {
  const [seen, setSeen] = useState<Record<PrefetchVariant, boolean>>(() =>
    Object.fromEntries(variants.map((v) => [v, false])) as Record<PrefetchVariant, boolean>,
  )
  const observerRef = useRef<IntersectionObserver | null>(null)

  const registerRef = useCallback((variant: PrefetchVariant) => (element: HTMLElement | null) => {
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') return

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            const target = entry.target as HTMLElement
            const targetVariant = target.dataset.variant as PrefetchVariant | undefined
            if (targetVariant) {
              setSeen((prev) => (prev[targetVariant] ? prev : { ...prev, [targetVariant]: true }))
            }
          }
        },
        { threshold: 0.1 },
      )
    }
    element.dataset.variant = variant
    observerRef.current.observe(element)
  }, [])

  return { seen, registerRef }
}
