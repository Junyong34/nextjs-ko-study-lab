import type { AnalyticsEvent } from './events.ts'

const fields: Record<AnalyticsEvent['name'], readonly string[]> = {
  learning_progress_toggle: ['kind', 'item_key', 'completed'],
  learning_complete: ['doc_id', 'chapter'], demo_click: ['demo_type', 'from_doc'],
  github_star_click: ['action'], share_click: ['share_url', 'page_path'],
  demo_view: ['zone', 'demo_url', 'demo_title'], book_click: ['book_type', 'chapter_step', 'chapter_title'],
  visualize_view: ['demo_key', 'demo_title', 'group'], content_view: [],
  code_copy: ['code_block_id', 'code_language'],
  content_search_results: ['search_surface', 'search_topic', 'result_count'],
  search_result_click: ['search_surface', 'search_topic', 'target_path'],
  toc_click: ['section_id', 'ui_location'], doc_navigation_click: ['target_path', 'ui_location'],
  content_feedback: ['rating'],
}
const urlFields = new Set(['share_url', 'page_path', 'target_path'])
export function cleanPath(value: string): string {
  try { return new URL(value, 'https://analytics.invalid').pathname } catch { return '/' }
}

/** Allowlist at the DOM boundary: arbitrary event fields never reach GA. */
export function parseEvent(input: unknown): AnalyticsEvent | null {
  if (!input || typeof input !== 'object') return null
  const { name, params } = input as { name?: unknown; params?: unknown }
  if (typeof name !== 'string' || !Object.hasOwn(fields, name) || !params || typeof params !== 'object') return null
  const data = params as Record<string, unknown>
  const result: Record<string, string | number | boolean> = {}
  for (const key of fields[name as AnalyticsEvent['name']]) {
    const value = data[key]
    if (key === 'result_count') {
      if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) return null
    } else if (key === 'completed') {
      if (typeof value !== 'boolean') return null
    } else if (typeof value !== 'string' || !value || value.length > 500) return null
    result[key] = typeof value === 'string' && urlFields.has(key) ? cleanPath(value) : value as string | number | boolean
  }
  if (name === 'content_feedback' && !['helpful', 'unhelpful'].includes(String(result.rating))) return null
  return { name, params: result } as AnalyticsEvent
}
