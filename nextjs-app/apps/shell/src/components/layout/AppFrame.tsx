'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { DocTree, type TreeNode } from '@study/ui'

export function AppFrame({ children, tree }: { children: React.ReactNode; tree: TreeNode[] }) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'
  const isSystemScreen = pathname === '/study-progress'
  const hideSidebar = isLandingPage || isSystemScreen

  return (
    <div
      className={`mx-auto flex w-full flex-1 items-start ${
        isLandingPage
          ? 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10'
          : isSystemScreen
            ? 'max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8'
            : 'max-w-[90rem] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10'
      }`}
    >
      {!hideSidebar && <DocTree tree={tree} />}
      <main className={`min-w-0 flex-1 pb-16 ${hideSidebar ? '' : 'lg:pl-8 lg:pr-4'}`}>
        {children}
      </main>
    </div>
  )
}
