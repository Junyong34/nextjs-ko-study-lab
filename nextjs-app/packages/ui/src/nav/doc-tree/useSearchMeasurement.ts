'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { TreeNode } from '../../types'
import { normalizeSearch, resultPaths, searchTopics, SearchMeasurement } from './search-measurement'

export function useSearchMeasurement(tree: TreeNode[], results: TreeNode[], query: string, demo: boolean, mobileOpen: boolean) {
  const [desktop, setDesktop] = useState(false)
  const [composing, setComposing] = useState(false)
  const ledger = useRef(new SearchMeasurement())
  const topics = useMemo(() => searchTopics(tree), [tree])
  const paths = useMemo(() => resultPaths(results, demo), [results, demo])
  const normalized = normalizeSearch(query)
  const search_surface = demo ? 'demo_sidebar' : 'doc_sidebar'
  const search_topic = topics.has(normalized) ? normalized : 'other'
  const visible = desktop || mobileOpen

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const update = () => setDesktop(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const emit = (name: string, params: Record<string, string | number>) => {
    try {
      document.dispatchEvent(new CustomEvent('study:analytics', { detail: { name, params } }))
    } catch {
      // Measurement must never block selecting a result.
    }
  }
  const flush = () => {
    ledger.current.update(query, paths, search_surface)
    if (ledger.current.claim(visible, composing)) {
      emit('content_search_results', { search_surface, search_topic, result_count: paths.length })
    }
  }

  useEffect(() => {
    ledger.current.update(query, paths, search_surface)
    if (!visible || composing || !normalized) return
    const timer = window.setTimeout(flush, 500)
    return () => window.clearTimeout(timer)
  }, [query, paths, search_surface, visible, composing])

  return {
    composing: setComposing,
    searching: Boolean(normalized),
    onResultClick: (target: string) => {
      if (!normalized || !visible || composing) return
      flush()
      emit('search_result_click', { search_surface, search_topic, target_path: target.split(/[?#]/)[0] })
    },
  }
}
