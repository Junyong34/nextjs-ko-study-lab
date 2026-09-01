'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, PlayCircle, BookOpen } from 'lucide-react'
import type { TreeNode } from '../../types'
import { DocTreeNode } from './DocTreeNode'
import { DocTreeSearch } from './DocTreeSearch'
import { useTreeFilter } from './useTreeFilter'
import { useTreeScrollToActive } from './useTreeScrollToActive'

export interface DocTreeProps {
  tree: TreeNode[]
}

/**
 * 좌측 문서/데모 트리. 데스크톱에서는 sticky 사이드바, 모바일에서는 서랍입니다.
 *
 * 현재 경로가 `/demo`인지 문서 경로인지에 따라 자동으로 '실습 데모 목차' 또는 '문서 목차' 모드로 동작합니다.
 */
export function DocTree({ tree }: DocTreeProps) {
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const isDemoMode = pathname.startsWith('/demo')

  // 페이지를 옮기면 모바일 서랍을 닫는다
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // 활성 메뉴 항목으로 스크롤 이동 (상/하단 치우침 감지 시 중앙으로 정렬)
  useTreeScrollToActive(scrollContainerRef, [pathname, mobileOpen], {
    topThresholdRatio: 0.2, // 상단 20%
    bottomThresholdRatio: 0.75, // 하단 75%
  })

  const filteredTree = useTreeFilter(tree, query)

  return (
    <>
      {/* 모바일 토글 버튼 */}
      <div className="lg:hidden fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-xl hover:bg-zinc-800 transition active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          aria-label="목차 메뉴 열기"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* 모바일 배경 오버레이 */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-80 flex flex-col bg-white p-3 shadow-2xl transition-transform duration-200 ease-in-out dark:bg-zinc-950
          lg:sticky lg:top-24 lg:z-30 lg:h-[calc(100vh-6.5rem)] lg:w-80 lg:shrink-0 lg:translate-x-0 lg:bg-transparent lg:p-0 lg:pr-3 lg:shadow-none dark:lg:bg-transparent
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 pointer-events-none lg:pointer-events-auto'}
        `}
      >
        {/* 모바일 서랍 헤더 */}
        <div className="flex items-center justify-between pb-2 lg:hidden border-b border-zinc-100 dark:border-zinc-800 mb-2">
          <div className="flex items-center gap-1.5">
            {isDemoMode ? (
              <>
                <PlayCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">실습 예제 목차</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">학습 문서 목차</span>
              </>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 데스크톱 상단 타이틀 */}
        <div className="hidden lg:flex items-center gap-1.5 px-1 pb-2.5">
          {isDemoMode ? (
            <>
              <PlayCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                실습 예제 목차
              </span>
            </>
          ) : (
            <>
              <BookOpen className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                학습 문서 목차
              </span>
            </>
          )}
        </div>

        <DocTreeSearch value={query} onChange={setQuery} placeholder={isDemoMode ? '예제 및 메뉴 검색…' : '문서 검색…'} />

        {/* 트리 본문 — 검색창과 별개로 스크롤된다 */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto pr-0.5 space-y-0.5 pb-16 [scrollbar-width:thin]"
        >
          {filteredTree.map((rootNode, idx) => (
            <DocTreeNode
              key={rootNode.url + '-' + idx}
              node={rootNode}
              currentPath={pathname}
              level={0}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}

          {filteredTree.length === 0 && (
            <div className="py-8 text-center text-xs text-zinc-400">검색 결과가 없습니다.</div>
          )}
        </div>
      </aside>
    </>
  )
}
