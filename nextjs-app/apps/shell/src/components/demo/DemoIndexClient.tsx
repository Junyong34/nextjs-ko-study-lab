'use client'

import React, { useState, useEffect, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { DemoIndexToolbar, DemoIndexCard, DemoPagination, DemoEmptyState } from '@study/ui'
import type { DemoIndexViewModel } from '@/lib/demo-index'
import { buildDemoIndexUrl } from '@/lib/demo-index'
import { useDemoListRestoration } from './useDemoListRestoration'
import { useLearningProgress } from '@/components/learning-progress/LearningProgressProvider'

export interface DemoIndexClientProps {
  viewModel: DemoIndexViewModel
}

export function DemoIndexClient({ viewModel }: DemoIndexClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchInput, setSearchInput] = useState(viewModel.query.q)
  const listRef = useRef<HTMLDivElement>(null)
  const { isCompleted } = useLearningProgress()

  const currentUrl = buildDemoIndexUrl(viewModel.query)
  const { saveContextOnCardClick } = useDemoListRestoration(currentUrl)

  // 동기화: URL 변경(뒤로가기 등) 시 내부 검색어 state 갱신
  useEffect(() => {
    setSearchInput(viewModel.query.q)
  }, [viewModel.query.q])

  // 검색어 입력 Debounce (250ms) -> router.replace({ scroll: false })
  useEffect(() => {
    if (searchInput === viewModel.query.q) return
    const timer = setTimeout(() => {
      startTransition(() => {
        const nextUrl = buildDemoIndexUrl({
          q: searchInput.trim(),
          category: viewModel.query.category,
          page: 1, // 검색어 변경 시 1페이지 리셋
        })
        router.replace(nextUrl, { scroll: false })
      })
    }, 250)
    return () => clearTimeout(timer)
  }, [searchInput, viewModel.query.q, viewModel.query.category, router])

  // 카테고리 탭 선택 -> router.push({ scroll: false })
  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === viewModel.query.category) return
    startTransition(() => {
      const nextUrl = buildDemoIndexUrl({
        q: searchInput.trim(),
        category: newCategory as any,
        page: 1, // 카테고리 변경 시 1페이지 리셋
      })
      router.push(nextUrl, { scroll: false })
    })
  }

  // 페이지네이션 이동 -> router.push({ scroll: false }) + 상단 스크롤
  const handlePageChange = (newPage: number) => {
    if (newPage === viewModel.currentPage) return
    startTransition(() => {
      const nextUrl = buildDemoIndexUrl({
        q: searchInput.trim(),
        category: viewModel.query.category,
        page: newPage,
      })
      router.push(nextUrl, { scroll: false })
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  // 검색/필터 초기화
  const handleReset = () => {
    setSearchInput('')
    startTransition(() => {
      router.push('/demo')
    })
  }

  return (
    <div ref={listRef} className="space-y-6">
      <DemoIndexToolbar
        query={searchInput}
        onQueryChange={setSearchInput}
        selectedCategory={viewModel.query.category}
        onCategoryChange={handleCategoryChange}
        onCategorySelect={handleCategoryChange}
        categories={viewModel.categories}
        totalCount={viewModel.totalCount}
        totalResults={viewModel.totalCount}
        allCount={viewModel.allCount}
        currentPage={viewModel.currentPage}
        totalPages={viewModel.totalPages}
        onClearFilters={handleReset}
        isPending={isPending}
      />

      {viewModel.items.length === 0 ? (
        <DemoEmptyState
          query={viewModel.query.q}
          category={viewModel.query.category}
          onReset={handleReset}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {viewModel.items.map((item) => (
            <DemoIndexCard
              key={item.id}
              url={item.id}
              title={item.title}
              status={item.status}
              learningCompleted={item.status === 'done' ? isCompleted('demo', item.id) : undefined}
              doc={item.docTitle}
              docUrl={item.docUrl}
              category={item.category}
              onCardClick={() => saveContextOnCardClick(item.id)}
              onNavigate={() => saveContextOnCardClick(item.id)}
            />
          ))}
        </div>
      )}

      {viewModel.totalPages > 1 && (
        <DemoPagination
          currentPage={viewModel.currentPage}
          totalPages={viewModel.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
