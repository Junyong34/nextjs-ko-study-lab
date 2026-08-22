'use client'
import React from 'react'
import Link from 'next/link'

export function OptionalCatchAllDemo() {
  const BASE_PATH = '/zone/baseline/file-conventions/dynamic-segments/optional-catch-all'

  const DEMO_LINKS = [
    {
      title: '0단계 (루트): 개발자 문서 인덱스',
      path: `${BASE_PATH}/docs`,
      paramDesc: 'slug: undefined (파라미터 없음)',
      badge: '루트 매칭',
    },
    {
      title: '1단계: 설치 가이드',
      path: `${BASE_PATH}/docs/installation`,
      paramDesc: "slug: ['installation']",
      badge: '1단계',
    },
    {
      title: '2단계: 동적 라우팅 가이드',
      path: `${BASE_PATH}/docs/routing/dynamic-routes`,
      paramDesc: "slug: ['routing', 'dynamic-routes']",
      badge: '2단계',
    },
    {
      title: '3단계: 특수 파일 page.tsx API',
      path: `${BASE_PATH}/docs/api-reference/file-conventions/page`,
      paramDesc: "slug: ['api-reference', 'file-conventions', 'page']",
      badge: '3단계',
    },
  ]

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">[[...slug]] 선택적 포괄 세그먼트 네비게이션</h4>
            <span className="rounded bg-purple-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              docs/[[...slug]] 온디스크 구축 완료
            </span>
          </div>
          <p className="text-xs text-zinc-500">이중 대괄호(<code>[[...slug]]</code>)는 파라미터가 없는 <code>/docs</code> 루트 경로까지 함께 포괄합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DEMO_LINKS.map((item) => (
          <div
            key={item.path}
            className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-all hover:border-purple-400 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">{item.title}</h5>
                <span className="rounded bg-purple-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {item.badge}
                </span>
              </div>
              <code className="block rounded bg-zinc-200/70 px-2 py-1 font-mono text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {item.paramDesc}
              </code>
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <Link
                href={item.path}
                className="rounded bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 transition-colors"
              >
                해당 문서로 이동 →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
