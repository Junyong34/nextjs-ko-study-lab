'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { usePathname } from 'next/navigation'
import { getVisualizeListContext, saveVisualizeListContext, clearVisualizeListContext } from './list-storage'

export function rememberVisualizeSelection(event: MouseEvent<HTMLAnchorElement>, slug: string) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const previous = getVisualizeListContext()
  const inList = window.location.pathname === '/visualize'
  if (!inList) {
    if (previous) saveVisualizeListContext({ ...previous, selectedSlug: slug })
    return
  }
  saveVisualizeListContext({
    listUrl: window.location.pathname + window.location.search,
    selectedSlug: slug,
    scrollY: window.scrollY,
  })
}

export function useVisualizeListRestoration(listUrl: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const context = getVisualizeListContext()
    if (!context) return
    if (context.listUrl !== listUrl) {
      clearVisualizeListContext()
      return
    }
    const frame = requestAnimationFrame(() => {
      // Next.js can retain an inactive page; only focus the visible list.
      const link = Array.from(document.querySelectorAll<HTMLAnchorElement>(`a[id="visualize-${context.selectedSlug}"]`))
        .find((element) => element.getClientRects().length > 0)
      if (link) {
        link.scrollIntoView({ block: 'center', behavior: 'instant' })
        link.focus({ preventScroll: true })
      } else {
        window.scrollTo({ top: context.scrollY, behavior: 'instant' })
      }
      clearVisualizeListContext()
    })
    return () => cancelAnimationFrame(frame)
  }, [listUrl, enabled])
}

export function useVisualizeReturnUrl(slug: string) {
  const pathname = usePathname()
  const [returnUrl, setReturnUrl] = useState('/visualize')
  useEffect(() => {
    const context = getVisualizeListContext()
    if (context?.selectedSlug === slug) setReturnUrl(context.listUrl)
    else {
      setReturnUrl('/visualize')
      clearVisualizeListContext()
    }
  }, [pathname, slug])
  return returnUrl
}
