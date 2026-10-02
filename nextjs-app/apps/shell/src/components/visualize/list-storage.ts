export const VISUALIZE_LIST_STORAGE_KEY = 'study_visualize_list_context'
export const VISUALIZE_RESTORE_EXPIRY_MS = 60 * 60 * 1000

export interface VisualizeListContext {
  listUrl: string
  selectedSlug: string
  scrollY: number
  timestamp: number
}

export function clearVisualizeListContext(): void {
  try { sessionStorage.removeItem(VISUALIZE_LIST_STORAGE_KEY) } catch { /* Storage is optional. */ }
}

export function saveVisualizeListContext(context: Omit<VisualizeListContext, 'timestamp'>): void {
  try {
    sessionStorage.setItem(VISUALIZE_LIST_STORAGE_KEY, JSON.stringify({ ...context, timestamp: Date.now() }))
  } catch { /* Navigation must work without storage. */ }
}

export function getVisualizeListContext(): VisualizeListContext | null {
  try {
    const raw = sessionStorage.getItem(VISUALIZE_LIST_STORAGE_KEY)
    if (!raw) return null
    const value = JSON.parse(raw) as Partial<VisualizeListContext>
    const url = typeof value.listUrl === 'string' ? new URL(value.listUrl, 'https://local.invalid') : null
    if (!url || url.origin !== 'https://local.invalid' || url.pathname !== '/visualize'
      || typeof value.selectedSlug !== 'string' || !/^[a-z0-9-]+$/.test(value.selectedSlug)
      || typeof value.scrollY !== 'number' || !Number.isFinite(value.scrollY) || value.scrollY < 0
      || typeof value.timestamp !== 'number' || !Number.isFinite(value.timestamp)
      || value.timestamp > Date.now() || Date.now() - value.timestamp > VISUALIZE_RESTORE_EXPIRY_MS) {
      clearVisualizeListContext()
      return null
    }
    return value as VisualizeListContext
  } catch {
    clearVisualizeListContext()
    return null
  }
}
