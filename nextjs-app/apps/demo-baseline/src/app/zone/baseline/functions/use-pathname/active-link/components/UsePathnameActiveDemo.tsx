'use client'
import React, { useState } from 'react'

export function UsePathnameActiveDemo() {
  const [pathname, setPathname] = useState('/shop/deals')
  const links = ['/shop/new', '/shop/deals', '/shop/best']

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2">
        {links.map(path => (
          <button key={path} type="button" onClick={() => setPathname(path)} className={`rounded px-3 py-1.5 text-xs font-bold transition-colors ${pathname === path ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'}`}>
            {path}
          </button>
        ))}
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 font-mono">
        usePathname() 리턴값: <strong className="text-blue-600 dark:text-blue-400">"{pathname}"</strong> (GNB 탭 활성화 매칭 완료)
      </div>
    </div>
  )
}
