import { sendGAEvent } from '@next/third-parties/google'

type AnalyticsEvent =
  | {
      name: 'learning_progress_toggle'
      params: { kind: 'document' | 'demo'; item_key: string; completed: boolean }
    }
  | {
      name: 'demo_view'
      params: { zone: string; demo_url: string; demo_title: string }
    }
  | {
      name: 'book_click'
      params: { book_type: 'document' | 'demo'; chapter_step: string; chapter_title: string }
    }

export function trackEvent(event: AnalyticsEvent) {
  sendGAEvent('event', event.name, event.params)
}
