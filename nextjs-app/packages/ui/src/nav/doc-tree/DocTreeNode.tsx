'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown, Play } from 'lucide-react'
import { cn } from '../../cn'
import { ACTIVE_ITEM, INACTIVE_ITEM } from '../../styles'
import { CountBadge } from '../../primitives/Badge'
import type { TreeNode } from '../../types'
import { formatNodeTitle } from './useTreeFilter'

export interface DocTreeNodeProps {
  node: TreeNode
  currentPath: string
  level?: number
  onNavigate?: () => void
}

/** 트리의 한 항목. 자식이 있으면 접히는 그룹, 없으면 링크. */
export function DocTreeNode({
  node,
  currentPath,
  level = 0,
  onNavigate,
}: DocTreeNodeProps) {
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

  // 최상위는 기본으로 펼치고, 활성 항목을 품고 있어도 펼친다
  const [isOpen, setIsOpen] = useState<boolean>(level === 0 || containsActive)

  const displayTitle = formatNodeTitle(node.title, node.order)

  if (!hasChildren) {
    return (
      <Link
        href={node.url}
        onClick={onNavigate}
        title={node.title}
        className={cn(
          'group flex items-center justify-between gap-1.5 rounded-md px-2 py-1 text-xs transition-colors',
          isSelected ? ACTIVE_ITEM : INACTIVE_ITEM,
        )}
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
        className={cn(
          'group flex items-center justify-between gap-1.5 rounded-md px-2 py-1 text-xs font-medium cursor-pointer select-none transition-colors',
          level === 0
            ? 'text-zinc-900 font-bold dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            : isSelected
              ? ACTIVE_ITEM
              : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100',
        )}
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
          <span className="break-keep leading-snug">{displayTitle}</span>
        </div>
        {node.children && <CountBadge>{node.children.length}</CountBadge>}
      </div>

      {isOpen && (
        <div className="space-y-0.5 border-l border-zinc-100 ml-2 pl-1 dark:border-zinc-800/80">
          {node.children!.map((child, idx) => {
            const prevSection = idx > 0 ? node.children![idx - 1].section : null
            const showSectionHeader = child.section && child.section !== prevSection

            return (
              <React.Fragment key={child.url + '-' + idx}>
                {showSectionHeader && (
                  <div className="pt-1.5 pb-0.5 px-2 text-[10px] font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                    {child.section}
                  </div>
                )}
                <DocTreeNode
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
