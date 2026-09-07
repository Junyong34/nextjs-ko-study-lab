'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export function ShareClickTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      if (!target) return

      const button = target.closest('[data-analytics="share_click"]')
      if (!button) return

      const shareUrl = button.getAttribute('data-share-url')
      if (!shareUrl) return

      trackEvent({
        name: 'share_click',
        params: {
          share_url: shareUrl,
          page_path: window.location.pathname,
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
