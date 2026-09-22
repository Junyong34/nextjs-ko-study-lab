'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'
import type { ContentContext } from '@/lib/analytics/context'

export function ContentViewTracker({ contentId, group, type, event }: {
  contentId: string; group: string; type: ContentContext['content_type']; event: AnalyticsEvent
}) {
  const pathname = usePathname()
  const last = useRef('')
  const serialized = JSON.stringify(event)
  useEffect(() => {
    const key = pathname + serialized
    if (last.current === key) return
    last.current = key
    trackEvent(JSON.parse(serialized), { page_path: pathname, content_id: contentId, content_group: group, content_type: type })
  }, [pathname, serialized, contentId, group, type])
  return <span hidden data-page-path={pathname} data-content-id={contentId} data-content-group={group} data-content-type={type} />
}
