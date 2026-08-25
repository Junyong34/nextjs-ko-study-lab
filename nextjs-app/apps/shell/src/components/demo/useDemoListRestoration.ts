'use client'

import { useEffect, useCallback, useRef } from 'react'
import {
  saveDemoListContext,
  getDemoListContext,
  clearDemoListContext,
} from '../../lib/demo-storage'

export function useDemoListRestoration(currentUrl: string) {
  const restoredRef = useRef(false)

  const saveContextOnCardClick = useCallback((demoUrl: string) => {
    if (typeof window === 'undefined') return
    const currentFullUrl = window.location.pathname + window.location.search
    saveDemoListContext({
      listUrl: currentFullUrl,
      clickedDemoUrl: demoUrl,
      scrollY: window.scrollY,
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (restoredRef.current) return

    const context = getDemoListContext()
    if (!context) return

    const currentFullUrl = window.location.pathname + window.location.search

    if (context.listUrl === currentFullUrl) {
      requestAnimationFrame(() => {
        const cardElement =
          document.querySelector(`[data-demo-url="${context.clickedDemoUrl}"]`) ||
          document.getElementById(`demo-card-${context.clickedDemoUrl.replace(/\//g, '-')}`)

        if (cardElement) {
          cardElement.scrollIntoView({ block: 'center', behavior: 'auto' })
          if (cardElement instanceof HTMLElement) {
            cardElement.focus({ preventScroll: true })
          }
        } else if (typeof context.scrollY === 'number' && context.scrollY > 0) {
          window.scrollTo({ top: context.scrollY, behavior: 'auto' })
        }
        restoredRef.current = true
        clearDemoListContext()
      })
    } else {
      // 쿼리/페이지가 달라진 새로운 탐색인 경우 stale 데이터 삭제
      clearDemoListContext()
    }
  }, [currentUrl])

  return { saveContextOnCardClick }
}
