'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useRouterCacheLab } from './RouterCacheProvider'
import { ROUTES, ROUTE_LABEL, routeFromPath, routeHref } from '../types'

const BUTTON =
  'rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900'

/**
 * layout에 있어 하위 page 이동 중에도 유지되는 조작부.
 * 기본 <Link>(prefetch 기본값)와 useRouter()의 back/forward/refresh를 그대로 호출한다.
 */
export function NavControls() {
  const pathname = usePathname()
  const router = useRouter()
  const { begin, beginHistory } = useRouterCacheLab()
  const currentRoute = routeFromPath(pathname)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-zinc-500">새 진입 (push)</span>
        {ROUTES.map((route) =>
          route === currentRoute ? (
            <span key={route} className={`${BUTTON} cursor-default bg-zinc-100 text-zinc-500 dark:bg-zinc-900`}>
              현재: {ROUTE_LABEL[route]}
            </span>
          ) : (
            <Link key={route} href={routeHref(route)} onClick={() => begin('link', route)} className={BUTTON}>
              {ROUTE_LABEL[route]} 페이지로 이동 →
            </Link>
          ),
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-zinc-500">히스토리 / 갱신</span>
        <button
          type="button"
          className={BUTTON}
          onClick={() => {
            beginHistory('back')
            router.back()
          }}
        >
          ← router.back()
        </button>
        <button
          type="button"
          className={BUTTON}
          onClick={() => {
            beginHistory('forward')
            router.forward()
          }}
        >
          router.forward() →
        </button>
        <button
          type="button"
          className={BUTTON}
          disabled={!currentRoute}
          onClick={() => {
            if (!currentRoute) return
            begin('refresh', currentRoute)
            router.refresh()
          }}
        >
          router.refresh()
        </button>
      </div>
      <p className="text-[11px] leading-relaxed text-zinc-500">
        브라우저의 뒤로/앞으로 버튼(Alt+←/→)으로 이동해도 popstate로 감지되어 &quot;브라우저 뒤로/앞으로&quot;로 기록됩니다.
        시작 화면으로 돌아가는 이동은 측정하지 않습니다.
      </p>
    </div>
  )
}
