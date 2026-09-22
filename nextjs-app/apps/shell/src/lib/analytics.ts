import type { AnalyticsEvent } from './analytics/events'
import { currentContext, type ContentContext } from './analytics/context'
import { parseEvent } from './analytics/payload'
import { sendEvent } from './analytics/transport'

export type { AnalyticsEvent } from './analytics/events'

export function trackEvent(event: AnalyticsEvent, context?: ContentContext) {
  if (typeof window === 'undefined') return
  try {
    const parsed = parseEvent(event)
    if (parsed) sendEvent(parsed.name, { ...currentContext(), ...context, ui_location: event.name === 'code_copy' ? 'code' : event.name.includes('search') ? 'sidebar' : event.name === 'content_feedback' ? 'feedback' : 'page', ...parsed.params })
  } catch { /* Never turn telemetry into a UI failure. */ }
}
