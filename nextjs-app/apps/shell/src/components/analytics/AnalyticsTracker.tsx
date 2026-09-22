'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'
import { parseEvent } from '@/lib/analytics/payload'
import { currentContext } from '@/lib/analytics/context'

export function AnalyticsTracker() {
  useEffect(() => {
    function click(event: MouseEvent) {
      if (!(event.target instanceof Element)) return
      const element = event.target.closest<HTMLElement>('[data-analytics]')
      const name = element?.dataset.analytics
      if (name === 'search_result_click') return // Search owner flushes its result before navigation.
      if (element && name === 'demo_click') {
        trackEvent({ name, params: { demo_type: element.dataset.demoType || 'unknown', from_doc: element.dataset.fromDoc || location.pathname } })
      } else if (element && name === 'share_click' && element.dataset.shareUrl) {
        trackEvent({ name, params: { share_url: element.dataset.shareUrl, page_path: location.pathname } })
      } else if (element && name === 'toc_click' && element.dataset.sectionId) {
        trackEvent({ name, params: { section_id: element.dataset.sectionId, ui_location: 'toc' } })
      } else {
        const link = event.target.closest<HTMLAnchorElement>('a[href]')
        if (!link || link.origin !== location.origin || link.pathname === location.pathname) return
        if (name !== 'doc_navigation_click' && !link.closest('[data-document-body]')) return
        if (link.pathname.startsWith('/demo') || link.pathname.startsWith('/visualize')) return
        trackEvent({ name: 'doc_navigation_click', params: { target_path: link.pathname, ui_location: element?.dataset.uiLocation || 'body' } })
      }
    }
    function semantic(event: Event) {
      if (!(event instanceof CustomEvent)) return
      const parsed = parseEvent(event.detail)
      if (!parsed || !['code_copy', 'content_search_results', 'search_result_click'].includes(parsed.name)) return
      // Copy events carry a snapshot captured before the clipboard promise resolves.
      const snapshot = parsed.name === 'code_copy' ? event.detail.context : undefined
      trackEvent(parsed, snapshot && typeof snapshot.content_id === 'string' ? {
        ...currentContext(), page_path: snapshot.page_path, content_id: snapshot.content_id,
        content_group: snapshot.content_group, content_type: 'document',
      } : undefined)
    }
    document.addEventListener('click', click)
    document.addEventListener('study:analytics', semantic)
    return () => {
      document.removeEventListener('click', click)
      document.removeEventListener('study:analytics', semantic)
    }
  }, [])
  return null
}
