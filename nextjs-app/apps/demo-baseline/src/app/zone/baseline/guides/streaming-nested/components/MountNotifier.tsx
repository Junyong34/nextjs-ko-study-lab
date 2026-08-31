'use client'

import { useEffect } from 'react'

export function MountNotifier({ target }: { target: 'recommended' | 'reviews' }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stream-chunk-mounted', { detail: target }))
    }
  }, [target])

  return null
}
