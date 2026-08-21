'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, ChevronDown, Search, Menu, X, Play } from 'lucide-react'
import type { TreeNode } from '@/lib/docs'

interface SidebarProps {
  tree: TreeNode[]
}

function formatNodeTitle(title: string, order?: string) {
  if (!order || order === '0') return title
  const escapedOrder = order.replace(/\./g, '\\.')
  const regex = new RegExp(`^${escapedOrder}\\.?\\s*`)
  return title.replace(regex, '')
}

function NavItem({
  node,
  currentPath,
  level = 0,
  onNavigate,
}: {
  node: TreeNode
  currentPath: string
  level?: number
  onNavigate?: () => void
}) {
  const hasChildren = Boolean(node.children && node.children.length > 0)
  const isSelected = currentPath === node.url
  const containsActive = useMemo(() => {
    if (!hasChildren) return false
    const checkActive = (item: TreeNode): boolean => {
      if (item.url === currentPath) return true
      return item.children ? item.children.some(checkActive) : false
    }
    return checkActive(node)
  }, [node, currentPath, hasChildren])

  // Top-level categories default to open, or opened if active item inside
  const [isOpen, setIsOpen] = useState<boolean>(level === 0 || containsActive)

  // Group children by section if available
  const groupedChildren = useMemo(() => {
    if (!node.children) return []
    return node.children
  }, [node.children])

  const displayTitle = formatNodeTitle(node.title, node.order)

  if (!hasChildren) {
    return (
      <Link
        href={node.url}
        onClick={onNavigate}
        title={node.title}
        className={`group flex items-center justify-between gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${
          isSelected
            ? 'bg-[#14161a0f] font-bold text-zinc-950 dark:bg-white/10 dark:text-zinc-50'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
        }`}
        style={{ paddingLeft: `${Math.max(8, level * 10)}px` }}
      >
        <div className="flex items-baseline gap-1.5 min-w-0">
          {node.order && node.order !== '0' && (
            <span className="shrink-0 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
              {node.order}
            </span>
          )}
          <span className="break-keep leading-snug">{displayTitle}</span>
        </div>
        {node.demos && node.demos.length > 0 && (
          <span
            title="실습 데모 포함"
            className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          >
            <Play className="h-2 w-2 fill-current" />
          </span>
        )}
      </Link>
    )
  }

  return (
    <div className="space-y-0.5">
      <div
        className={`group flex items-center justify-between gap-1.5 rounded-md px-2 py-1 text-xs font-medium cursor-pointer select-none transition-colors ${
          level === 0
            ? 'text-zinc-900 font-bold dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            : isSelected
            ? 'bg-[#14161a0f] font-bold text-zinc-950 dark:bg-white/10 dark:text-zinc-50'
            : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
        }`}
        style={{ paddingLeft: `${Math.max(6, level * 10)}px` }}
        onClick={() => setIsOpen((prev) => !prev)}
        title={node.title}
      >
        <div className="flex items-start gap-1.5 min-w-0">
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 mt-0.5 text-zinc-400" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-zinc-400" />
          )}
          {node.order && node.order !== '0' && (
            <span className="shrink-0 font-mono text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
              {node.order}
            </span>
          )}
          <span className="break-keep leading-snug">
            {displayTitle}
          </span>
        </div>
        {node.children && (
          <span className="shrink-0 inline-flex items-center justify-center rounded-full border border-zinc-200/80 bg-zinc-100/90 px-1.5 py-0.2 font-mono text-[9px] font-medium text-zinc-500 transition-colors group-hover:border-zinc-300 group-hover:bg-zinc-200/70 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400 dark:group-hover:border-zinc-700">
            {node.children.length}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="space-y-0.5 border-l border-zinc-100 ml-2 pl-1 dark:border-zinc-800/80">
          {groupedChildren.map((child, idx) => {
            const prevSection = idx > 0 ? groupedChildren[idx - 1].section : null
            const showSectionHeader = child.section && child.section !== prevSection

            return (
              <React.Fragment key={child.url + '-' + idx}>
                {showSectionHeader && (
                  <div className="pt-1.5 pb-0.5 px-2 text-[10px] font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                    {child.section}
                  </div>
                )}
                <NavItem
                  node={child}
                  currentPath={currentPath}
                  level={level + 1}
                  onNavigate={onNavigate}
                />
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ tree }: SidebarProps) {
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  // 페이지 이동 시 모바일 드로어 자동 닫기
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Search filter
  const filteredTree = useMemo(() => {
    if (!query.trim()) return tree

    const q = query.toLowerCase()

    const filterNode = (node: TreeNode): TreeNode | null => {
      const matchSelf =
        node.title.toLowerCase().includes(q) ||
        (node.order && node.order.includes(q)) ||
        (node.section && node.section.toLowerCase().includes(q))

      let filteredChildren: TreeNode[] | undefined
      if (node.children) {
        filteredChildren = node.children
          .map(filterNode)
          .filter((n): n is TreeNode => n !== null)
      }

      if (matchSelf || (filteredChildren && filteredChildren.length > 0)) {
        return {
          ...node,
          children: filteredChildren,
        }
      }

      return null
    }

    return tree
      .map(filterNode)
      .filter((n): n is TreeNode => n !== null)
  }, [tree, query])

  return (
    <>
      {/* Mobile Floating Toggle Button */}
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

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Drawer / Container (w-80: 320px for comfortable reading) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-80 flex flex-col bg-white p-3 shadow-2xl transition-transform duration-200 ease-in-out dark:bg-zinc-950
          lg:sticky lg:top-24 lg:z-30 lg:h-[calc(100vh-6.5rem)] lg:w-80 lg:shrink-0 lg:translate-x-0 lg:bg-transparent lg:p-0 lg:pr-3 lg:shadow-none dark:lg:bg-transparent
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 pointer-events-none lg:pointer-events-auto'}
        `}
      >
        {/* Mobile Drawer Header */}
        <div className="flex items-center justify-between pb-2 lg:hidden border-b border-zinc-100 dark:border-zinc-800 mb-2">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            문서 목차
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search input (Fixed at top of sidebar, does not scroll) */}
        <div className="shrink-0 pb-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="문서 목차 검색..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50/80 py-1.5 pl-8 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Tree navigation (Independent scrollable area) */}
        <div className="flex-1 overflow-y-auto pr-0.5 space-y-0.5 pb-16 [scrollbar-width:thin]">
          {filteredTree.map((rootNode, idx) => (
            <NavItem
              key={rootNode.url + '-' + idx}
              node={rootNode}
              currentPath={pathname}
              level={0}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}

          {filteredTree.length === 0 && (
            <div className="py-8 text-center text-xs text-zinc-400">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
