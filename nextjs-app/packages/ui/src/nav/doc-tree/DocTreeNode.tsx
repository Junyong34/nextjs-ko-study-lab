'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown, Play, FileText } from 'lucide-react'
import { cn } from '../../cn'
import { ACTIVE_ITEM, INACTIVE_ITEM } from '../../styles'
import { CountBadge } from '../../primitives/Badge'
import type { TreeNode } from '../../types'
import { formatNodeTitle } from './useTreeFilter'

/** '준비중' 뱃지의 툴팁을 판정 상태별로 다르게 보여줍니다. */
function getPendingTooltip(feasibility?: TreeNode['demoFeasibility']) {
  if (feasibility === 'possible') return '예제 제작 예정 (가능 판정, 아직 미구현)'
  if (feasibility === 'pending') return '예제 가능 여부 검토 중'
  return '예제 가능 여부 미판정'
}

export interface DocTreeNodeProps {
  node: TreeNode
  currentPath: string
  level?: number
  onNavigate?: () => void
}

/** 트리의 한 항목. 자식이 있으면 접히는 그룹(카테고리), 없으면 문서 링크. */
export function DocTreeNode({
  node,
  currentPath,
  level = 0,
  onNavigate,
}: DocTreeNodeProps) {
  const hasChildren = Boolean(node.children && node.children.length > 0)
  const isDemoMode = currentPath.startsWith('/demo')

  // 링크 대상 URL (데모 모드 시 /demo 접두사 추가)
  const targetUrl = isDemoMode
    ? `/demo${node.url === '/' ? '' : node.url}`
    : node.url

  const hasDemos = Boolean(node.hasDemo || (node.demos && node.demos.length > 0))
  const demoCount = node.demoCount || (node.demos ? node.demos.length : 0)

  // 현재 메뉴 선택(활성) 여부 판단
  const isSelected = useMemo(() => {
    if (isDemoMode) {
      if (currentPath === '/demo' && node.url === '/') return true
      if (node.url !== '/') {
        if (currentPath === targetUrl) return true
        const cleanPath = currentPath.split('?')[0]
        const cleanTarget = targetUrl.split('?')[0]
        if (cleanPath === cleanTarget) return true
      }
      return false
    }
    return currentPath === node.url
  }, [isDemoMode, currentPath, targetUrl, node.url])

  // 하위 자식 노드 중 활성 노드가 포함되어 있는지 판단
  const containsActive = useMemo(() => {
    if (!hasChildren || !node.children) return false
    const checkActive = (item: TreeNode): boolean => {
      if (isDemoMode) {
        if (item.url === '/' && currentPath === '/demo') return false
        const itemTarget = `/demo${item.url === '/' ? '' : item.url}`
        const cleanPath = currentPath.split('?')[0]
        const cleanTarget = itemTarget.split('?')[0]
        if (cleanPath === cleanTarget && item.url !== '/') return true
      } else {
        if (item.url !== '/' && (currentPath === item.url || currentPath.startsWith(item.url + '/'))) {
          return true
        }
      }
      return item.children ? item.children.some(checkActive) : false
    }
    return node.children.some(checkActive)
  }, [node.children, hasChildren, isDemoMode, currentPath])

  // 최상위 카테고리는 기본으로 펼치고, 활성 항목을 품고 있어도 펼친다
  const [isOpen, setIsOpen] = useState<boolean>(level === 0 || containsActive)

  // URL 경로 변경 시 하위에 활성 항목이 있으면 자동으로 펼침
  useEffect(() => {
    if (containsActive) {
      setIsOpen(true)
    }
  }, [containsActive])

  const displayTitle = formatNodeTitle(node.title, node.order)

  // 1. 단일 문서 노드 (클릭 시 이동하는 링크)
  if (!hasChildren) {
    return (
      <Link
        href={targetUrl}
        onClick={onNavigate}
        title={node.title}
        data-active={isSelected ? 'true' : undefined}
        className={cn(
          'group flex items-center justify-between gap-1.5 rounded-md px-2 py-1 text-xs transition-colors',
          isSelected ? ACTIVE_ITEM : INACTIVE_ITEM,
        )}
        style={{ paddingLeft: `${Math.max(8, level * 10)}px` }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {/* 데모 모드: 앞에 [DEMO] / [설명 대체] / [준비중] 3단계 뱃지 표시 */}
          {isDemoMode ? (
            hasDemos ? (
              <span
                className="inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold leading-none bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                title={`실습 예제 ${demoCount}개 보유`}
              >
                <Play className="h-2 w-2 fill-current shrink-0" />
                <span className="leading-none">예제</span>
                {demoCount > 1 && <span className="opacity-80 leading-none">({demoCount})</span>}
              </span>
            ) : node.demoFeasibility === 'not-applicable' ? (
              <span
                className="inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold leading-none bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                title="브라우저에서 시연할 수 없어 문서 설명으로 대체"
              >
                <FileText className="h-2 w-2 shrink-0" />
                <span className="leading-none">설명 대체</span>
              </span>
            ) : (
              <span
                className="inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-mono text-[9px] font-medium leading-none bg-zinc-100 text-zinc-400 dark:bg-zinc-800/60 dark:text-zinc-500"
                title={getPendingTooltip(node.demoFeasibility)}
              >
                준비 중
              </span>
            )
          ) : (
            /* 일반 문서 모드: 앞에 문서 번호 표시 */
            node.order && node.order !== '0' && (
              <span className="shrink-0 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                {node.order}
              </span>
            )
          )}

          <span className="truncate leading-snug">{displayTitle}</span>
        </div>

        {/* 일반 문서 모드: 우측에 실습 데모 포함 초록색 재생 아이콘 표시 */}
        {!isDemoMode && hasDemos && (
          <span
                title={`실습 예제 ${demoCount}개 포함`}
            className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          >
            <Play className="h-2 w-2 fill-current" />
          </span>
        )}
      </Link>
    )
  }

  // 2. 자식을 품은 카테고리 그룹 노드 (접고 펼치기 가능)
  return (
    <div className="space-y-0.5">
      <div
        data-active={isSelected ? 'true' : undefined}
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
        <div className="flex items-center gap-1.5 min-w-0">
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          )}

          {!isDemoMode && node.order && node.order !== '0' && (
            <span className="shrink-0 font-mono text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
              {node.order}
            </span>
          )}

          <span className="break-keep leading-snug">{displayTitle}</span>
        </div>

        {node.children && <CountBadge>{node.children.length}</CountBadge>}
      </div>

      {/* 아코디언 하위 노드 목록 */}
      {isOpen && (
        <div className="space-y-0.5 border-l border-zinc-100 ml-2 pl-1 dark:border-zinc-800/80">
          {node.children!.map((child, idx) => {
            const prevSection = idx > 0 ? node.children![idx - 1].section : null
            const showSectionHeader = child.section && child.section !== prevSection

            return (
              <React.Fragment key={(child.url || child.title) + '-' + idx}>
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
