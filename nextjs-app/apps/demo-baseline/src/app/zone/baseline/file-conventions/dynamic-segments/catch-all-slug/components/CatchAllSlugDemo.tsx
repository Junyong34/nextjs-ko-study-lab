'use client'
import React from 'react'
import Link from 'next/link'

export function CatchAllSlugDemo() {
  const BASE_PATH = '/zone/baseline/file-conventions/dynamic-segments/catch-all-slug'

  const DEMO_ROUTES = [
    {
      title: '1단계 대분류: 패션/의류',
      path: `${BASE_PATH}/shop/fashion`,
      desc: "slug: ['fashion']",
      badge: '1단계',
    },
    {
      title: '2단계 중분류: 패션 > 신발',
      path: `${BASE_PATH}/shop/fashion/shoes`,
      desc: "slug: ['fashion', 'shoes']",
      badge: '2단계',
    },
    {
      title: '3단계 소분류: 패션 > 신발 > 러닝화',
      path: `${BASE_PATH}/shop/fashion/shoes/running`,
      desc: "slug: ['fashion', 'shoes', 'running']",
      badge: '3단계',
    },
    {
      title: '3단계 복합: 가전 > 음향 > 무선 헤드폰',
      path: `${BASE_PATH}/shop/electronics/audio/wireless-headphones`,
      desc: "slug: ['electronics', 'audio', 'wireless-headphones']",
      badge: '3단계',
    },
  ]

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">[...slug] 계층형 쇼핑몰 카테고리</h4>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              shop/[...slug] 온디스크 생성 완료
            </span>
          </div>
          <p className="text-xs text-zinc-500">포괄적(Catch-all) 동적 세그먼트는 하위 경로의 모든 세그먼트를 <code>string[]</code> 배열로 포획합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DEMO_ROUTES.map((route) => (
          <div
            key={route.path}
            className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-all hover:border-blue-400 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">{route.title}</h5>
                <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {route.badge}
                </span>
              </div>
              <code className="block rounded bg-zinc-200/70 px-2 py-1 font-mono text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {route.desc}
              </code>
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <Link
                href={route.path}
                className="rounded bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 transition-colors"
              >
                해당 카테고리 진입 →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
