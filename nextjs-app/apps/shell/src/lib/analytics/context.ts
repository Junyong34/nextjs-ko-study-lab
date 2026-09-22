export interface ContentContext {
  page_path: string
  content_id: string
  content_group: string
  content_type: 'document' | 'demo' | 'visualize' | 'hub' | 'other'
}

export function currentContext(): ContentContext {
  const path = window.location.pathname
  const marker = document.querySelector<HTMLElement>('[data-content-id][data-page-path]')
  if (marker?.dataset.pagePath === path) {
    return {
      page_path: path,
      content_id: marker.dataset.contentId || path,
      content_group: marker.dataset.contentGroup || 'other',
      content_type: (marker.dataset.contentType || 'other') as ContentContext['content_type'],
    }
  }
  return { page_path: path, content_id: path, content_group: 'other', content_type: path === '/' || path === '/demo' || path === '/visualize' ? 'hub' : 'other' }
}
