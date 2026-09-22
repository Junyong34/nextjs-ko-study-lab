export type FeedbackRating = 'helpful' | 'unhelpful'
export const FEEDBACK_STORAGE_KEY = 'study_content_feedback_v1'

type FeedbackStorage = Pick<Storage, 'getItem' | 'setItem'>

/** Each instance represents one tab session; memory survives storage failures. */
export function createFeedbackStore(getStorage: () => FeedbackStorage) {
  const memory = new Map<string, FeedbackRating>()

  function restore() {
    try {
      const parsed: unknown = JSON.parse(getStorage().getItem(FEEDBACK_STORAGE_KEY) ?? '{}')
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return
      for (const [docId, rating] of Object.entries(parsed)) {
        if ((rating === 'helpful' || rating === 'unhelpful') && !memory.has(docId)) {
          memory.set(docId, rating)
        }
      }
    } catch {
      // Blocked or malformed storage must not prevent feedback.
    }
  }

  return {
    get(docId: string): FeedbackRating | null {
      restore()
      return memory.get(docId) ?? null
    },
    submit(docId: string, rating: FeedbackRating): boolean {
      restore()
      if (memory.has(docId)) return false
      memory.set(docId, rating)
      try {
        getStorage().setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(Object.fromEntries(memory)))
      } catch {
        // The in-memory first response remains authoritative in this page lifetime.
      }
      return true
    },
  }
}
