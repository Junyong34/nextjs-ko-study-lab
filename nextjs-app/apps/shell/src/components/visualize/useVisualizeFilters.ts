'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VISUALIZE_GROUPS } from './data'
import { visualizeCatalog } from './catalog'
import type { FilterGroup } from './types'
import { saveVisualizeListContext } from './list-storage'

export function useVisualizeFilters() {
  const params = useSearchParams()
  const router = useRouter()
  const rawGroup = params.get('group')
  const group: FilterGroup = VISUALIZE_GROUPS.find((item) => item === rawGroup) ?? 'all'
  const query = params.get('q') ?? ''
  const [compositionValue, setCompositionValue] = useState<string | null>(null)
  const composing = useRef(false)

  const update = (nextQuery: string, nextGroup: FilterGroup, mode: 'push' | 'replace') => {
    const next = new URLSearchParams(window.location.search)
    next.delete('demo')
    if (nextQuery.trim()) next.set('q', nextQuery)
    else next.delete('q')
    if (nextGroup === 'all') next.delete('group')
    else next.set('group', nextGroup)
    const url = `/visualize${next.size ? `?${next}` : ''}`
    if (url === window.location.pathname + window.location.search) return
    if (mode === 'push') window.history.pushState(null, '', url)
    else window.history.replaceState(null, '', url)
  }

  useEffect(() => {
    const demo = visualizeCatalog.find((item) => item.key === params.get('demo'))
    if (!demo) return
    const listParams = new URLSearchParams(params.toString())
    listParams.delete('demo')
    const listUrl = `/visualize${listParams.size ? `?${listParams}` : ''}`
    saveVisualizeListContext({ listUrl, selectedSlug: demo.key, scrollY: 0 })
    router.replace(`/visualize/${demo.key}`)
  }, [params, router])

  return {
    redirecting: visualizeCatalog.some((entry) => entry.key === params.get('demo')),
    group,
    query: compositionValue ?? query,
    listUrl: `/visualize${params.size ? `?${params}` : ''}`,
    setQuery(value: string) {
      if (composing.current) setCompositionValue(value)
      else update(value, group, 'replace')
    },
    startComposition(value: string) {
      composing.current = true
      setCompositionValue(value)
    },
    endComposition(value: string) {
      composing.current = false
      setCompositionValue(null)
      update(value, group, 'replace')
    },
    setGroup(nextGroup: FilterGroup) {
      update(compositionValue ?? query, nextGroup, 'push')
    },
    reset() {
      composing.current = false
      setCompositionValue(null)
      update('', 'all', 'replace')
    },
  }
}
