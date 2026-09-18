'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export function VisualizeViewTracker({
  demoKey,
  demoTitle,
  group,
}: {
  demoKey: string
  demoTitle: string
  group: string
}) {
  useEffect(() => {
    trackEvent({ name: 'visualize_view', params: { demo_key: demoKey, demo_title: demoTitle, group } })
  }, [demoKey, demoTitle, group])

  return null
}
