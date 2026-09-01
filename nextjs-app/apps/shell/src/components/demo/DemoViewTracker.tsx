'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export function DemoViewTracker({
  zone,
  demoUrl,
  demoTitle,
}: {
  zone: string
  demoUrl: string
  demoTitle: string
}) {
  useEffect(() => {
    trackEvent({ name: 'demo_view', params: { zone, demo_url: demoUrl, demo_title: demoTitle } })
  }, [zone, demoUrl, demoTitle])

  return null
}
