'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export function DemoClickTracker() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const link = target.closest('[data-analytics="demo_click"]')
      if (!link) return

      const demoType = link.getAttribute('data-demo-type') || 'unknown'
      const fromDoc = link.getAttribute('data-from-doc') || window.location.pathname

      trackEvent({
        name: 'demo_click',
        params: {
          demo_type: demoType,
          from_doc: fromDoc,
        },
      })
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}
