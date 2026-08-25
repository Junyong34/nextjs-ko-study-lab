export const DEMO_LIST_STORAGE_KEY = 'study_demo_list_context'
export const DEMO_RESTORE_EXPIRY_MS = 60 * 60 * 1000 // 1 hour

export interface DemoListRestorationContext {
  listUrl: string
  clickedDemoUrl: string
  scrollY: number
  timestamp: number
}

export function saveDemoListContext(
  context: Omit<DemoListRestorationContext, 'timestamp'>
): void {
  if (typeof window === 'undefined') return
  try {
    const payload: DemoListRestorationContext = {
      ...context,
      timestamp: Date.now(),
    }
    sessionStorage.setItem(DEMO_LIST_STORAGE_KEY, JSON.stringify(payload))
  } catch (err) {
    console.warn('Failed to save demo list context to sessionStorage', err)
  }
}

export function getDemoListContext(): DemoListRestorationContext | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(DEMO_LIST_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DemoListRestorationContext
    if (!parsed || typeof parsed.listUrl !== 'string') {
      sessionStorage.removeItem(DEMO_LIST_STORAGE_KEY)
      return null
    }
    if (Date.now() - parsed.timestamp > DEMO_RESTORE_EXPIRY_MS) {
      sessionStorage.removeItem(DEMO_LIST_STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function clearDemoListContext(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(DEMO_LIST_STORAGE_KEY)
  } catch {
    // silent catch
  }
}
