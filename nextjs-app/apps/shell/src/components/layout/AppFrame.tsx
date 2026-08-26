'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { DocTree, type TreeNode } from '@study/ui'

export function AppFrame({ children, tree }: { children: React.ReactNode; tree: TreeNode[] }) {
  const pathname = usePathname()
  const isSystemScreen = pathname === '/study-progress'

  return (
    <div
      className={`mx-auto flex w-full flex-1 items-start px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 ${
        isSystemScreen ? 'max-w-6xl' : 'max-w-[90rem]'
      }`}
    >
      {!isSystemScreen && <DocTree tree={tree} />}
      <main className={`min-w-0 flex-1 pb-16 ${isSystemScreen ? '' : 'lg:pl-8 lg:pr-4'}`}>
        {children}
      </main>
    </div>
  )
}
