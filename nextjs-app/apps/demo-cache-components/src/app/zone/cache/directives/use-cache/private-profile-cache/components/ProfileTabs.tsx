'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { VIEWS } from '../types'

/**
 * 실제 서브 라우트 두 개(page.tsx, shipping/page.tsx) 사이를 <Link>로 이동한다.
 * 기본 prefetch를 그대로 둔다: 각 라우트가 prefetch = 'partial'이라 App Shell에
 * 'use cache: private' 결과가 담겨 브라우저 메모리에 보관된다.
 */
export function ProfileTabs() {
  const pathname = usePathname()
  return (
    <nav aria-label="마이페이지 탭" className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
      {VIEWS.map((v) => {
        const active = pathname === v.href
        return (
          <Link
            key={v.id}
            href={v.href}
            data-testid={`tab-${v.id}`}
            className={`-mb-px border-b-2 px-3 py-1.5 text-xs font-medium transition ${
              active
                ? 'border-purple-600 text-purple-700 dark:border-purple-400 dark:text-purple-300'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {v.label}
          </Link>
        )
      })}
    </nav>
  )
}
