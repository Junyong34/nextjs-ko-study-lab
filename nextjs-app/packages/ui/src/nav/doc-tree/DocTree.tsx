'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import type { TreeNode } from '../../types'
import { DocTreeNode } from './DocTreeNode'
import { DocTreeSearch } from './DocTreeSearch'
import { useTreeFilter } from './useTreeFilter'

export interface DocTreeProps {
  tree: TreeNode[]
}

/**
 * 좌측 문서 트리. 데스크톱에서는 sticky 사이드바, 모바일에서는 서랍입니다.
 *
 * 접힘 상태를 쿠키에 저장하지 않습니다 — shadcn의 `sidebar`를 쓰지 않는 이유와 같습니다
 * (06. 7-2). 저장하게 되면 키 이름에 `study_` 접두사를 붙여야 합니다 (규칙 18).
 */
export function DocTree({ tree }: DocTreeProps) {
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  // 페이지를 옮기면 모바일 서랍을 닫는다
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

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
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">문서 목차</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <DocTreeSearch value={query} onChange={setQuery} />

        {/* 트리 본문 — 검색창과 별개로 스크롤된다 */}
        <div className="flex-1 overflow-y-auto pr-0.5 space-y-0.5 pb-16 [scrollbar-width:thin]">
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
