import { sendGAEvent } from '@next/third-parties/google'

export type AnalyticsEvent =
  | {
      name: 'learning_progress_toggle'
      params: { kind: 'document' | 'demo'; item_key: string; completed: boolean }
    }
  | {
      name: 'learning_complete'
      params: { doc_id: string; chapter: string }
    }
  | {
      name: 'demo_click'
      params: { demo_type: string; from_doc: string }
    }
  | {
      name: 'github_star_click'
      params: { action: 'open_modal' | 'go_to_repo' | 'dismiss' | 'dismiss_forever' }
    }
  | {
      name: 'demo_view'
      params: { zone: string; demo_url: string; demo_title: string }
    }
  | {
      name: 'book_click'
      params: { book_type: 'document' | 'demo' | 'visualize'; chapter_step: string; chapter_title: string }
    }

export function trackEvent(event: AnalyticsEvent) {
  sendGAEvent('event', event.name, event.params)
}
