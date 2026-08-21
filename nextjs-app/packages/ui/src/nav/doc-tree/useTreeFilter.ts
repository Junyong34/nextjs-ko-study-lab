'use client'

import { useMemo } from 'react'
import type { TreeNode } from '../../types'

/**
 * 검색어로 트리를 걸러냅니다.
 * 자기 자신이 걸리거나 자손 중 하나라도 걸리면 그 가지를 남깁니다.
 */
export function useTreeFilter(tree: TreeNode[], query: string): TreeNode[] {
  return useMemo(() => {
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
        return { ...node, children: filteredChildren }
      }

      return null
    }

    return tree.map(filterNode).filter((n): n is TreeNode => n !== null)
  }, [tree, query])
}

/** 제목 앞에 붙은 번호(`1.2 `)를 떼어냅니다. 번호는 따로 표시하기 때문입니다. */
export function formatNodeTitle(title: string, order?: string): string {
  if (!order || order === '0') return title
  const escapedOrder = order.replace(/\./g, '\\.')
  const regex = new RegExp(`^${escapedOrder}\\.?\\s*`)
  return title.replace(regex, '')
}
