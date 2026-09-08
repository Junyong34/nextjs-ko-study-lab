'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
  nextjsVisualizeDemos,
  VISUALIZE_GROUPS,
  groupLabels,
  type DemoKey,
} from './data'
import { VisualizeFilterTabs } from './VisualizeFilterTabs'
import { VisualizeCard } from './VisualizeCard'
import type { FilterGroup, VisualizeFilterOption } from './types'

export function VisualizeGalleryClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialDemo = searchParams.get('demo') as DemoKey | null
  const initialGroup = (searchParams.get('group') as FilterGroup) || 'all'

  const [selectedGroup, setSelectedGroup] = useState<FilterGroup>(initialGroup)
  const [activeSlug, setActiveSlug] = useState<DemoKey | null>(initialDemo)

  // URL 파라미터 동기화
  const updateUrl = useCallback(
    (newSlug: DemoKey | null, newGroup: FilterGroup) => {
      const params = new URLSearchParams()
      if (newGroup !== 'all') params.set('group', newGroup)
      if (newSlug) params.set('demo', newSlug)

      const qs = params.toString()
      const newUrl = qs ? `${pathname}?${qs}` : pathname
      window.history.replaceState(null, '', newUrl)
    },
    [pathname]
  )

  const handleSelectGroup = (group: FilterGroup) => {
    setSelectedGroup(group)
    updateUrl(activeSlug, group)
  }

  const handleToggleCard = (key: DemoKey) => {
    const nextSlug = activeSlug === key ? null : key
    setActiveSlug(nextSlug)
    updateUrl(nextSlug, selectedGroup)

    if (nextSlug) {
      setTimeout(() => {
        const el = document.getElementById(`card-${key}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }, 100)
    }
  }

  // 필터 탭 옵션 생성 (카운트 포함)
  const filterOptions = useMemo<VisualizeFilterOption[]>(() => {
    const allOption: VisualizeFilterOption = {
      key: 'all',
      label: '전체',
      count: nextjsVisualizeDemos.length,
    }

    const groupOptions: VisualizeFilterOption[] = VISUALIZE_GROUPS.map((group) => ({
      key: group,
      label: groupLabels[group],
      count: nextjsVisualizeDemos.filter((d) => d.group === group).length,
    }))

    return [allOption, ...groupOptions]
  }, [])

  // 현재 선택된 그룹 기준 목록 필터링
  const filteredDemos = useMemo(() => {
    if (selectedGroup === 'all') return nextjsVisualizeDemos
    return nextjsVisualizeDemos.filter((d) => d.group === selectedGroup)
  }, [selectedGroup])

  return (
    <div className="space-y-6">
      {/* 상단 필터 탭 바 */}
      <div className="flex items-center justify-between gap-4">
        <VisualizeFilterTabs
          options={filterOptions}
          activeGroup={selectedGroup}
          onSelectGroup={handleSelectGroup}
        />
      </div>

      {/* 카드 그리드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {filteredDemos.map((demo) => {
          const isActive = activeSlug === demo.key
          return (
            <div
              key={demo.key}
              className={isActive ? 'col-span-1 md:col-span-2' : 'col-span-1'}
            >
              <VisualizeCard
                demo={demo}
                isActive={isActive}
                onToggle={() => handleToggleCard(demo.key)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
