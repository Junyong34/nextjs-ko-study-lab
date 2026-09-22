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
      name: 'share_click'
      params: { share_url: string; page_path: string }
    }
  | {
      name: 'demo_view'
      params: { zone: string; demo_url: string; demo_title: string }
    }
  | {
      name: 'book_click'
      params: { book_type: 'document' | 'demo' | 'visualize'; chapter_step: string; chapter_title: string }
    }
  | {
      name: 'visualize_view'
      params: { demo_key: string; demo_title: string; group: string }
    }
  | { name: 'content_view'; params: Record<string, never> }
  | { name: 'code_copy'; params: { code_block_id: string; code_language: string } }
  | { name: 'content_search_results'; params: { search_surface: string; search_topic: string; result_count: number } }
  | { name: 'search_result_click'; params: { search_surface: string; search_topic: string; target_path: string } }
  | { name: 'toc_click'; params: { section_id: string; ui_location: string } }
  | { name: 'doc_navigation_click'; params: { target_path: string; ui_location: string } }
  | { name: 'content_feedback'; params: { rating: 'helpful' | 'unhelpful' } }
