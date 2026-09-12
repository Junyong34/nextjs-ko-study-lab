'use client'
import React, { useState } from 'react'
import Link from 'next/link'

interface ZeroSegmentProbeResult {
  status: number
  ok: boolean
}

interface CatchAllSlugDemoProps {
  onProbeResult?: (result: ZeroSegmentProbeResult) => void
}

export function CatchAllSlugDemo({ onProbeResult }: CatchAllSlugDemoProps) {
  const BASE_PATH = '/zone/baseline/file-conventions/dynamic-segments/catch-all-slug'
  const ZERO_SEGMENT_PATH = `${BASE_PATH}/shop`

  const [probe, setProbe] = useState<ZeroSegmentProbeResult | null>(null)
  const [probing, setProbing] = useState(false)

  async function handleProbeZeroSegment() {
    setProbing(true)
    try {
      const res = await fetch(ZERO_SEGMENT_PATH, { cache: 'no-store' })
      const result: ZeroSegmentProbeResult = { status: res.status, ok: res.ok }
      setProbe(result)
      onProbeResult?.(result)
    } finally {
      setProbing(false)
    }
  }

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

      <div className="rounded-lg border border-amber-300 bg-amber-50/60 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">0단계: 세그먼트 없음 (/shop)</h5>
              <span className="rounded bg-amber-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                매칭 실패 예상
              </span>
            </div>
            <code className="block rounded bg-amber-100/70 px-2 py-1 font-mono text-[11px] text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              shop/[...slug]는 1개 이상 세그먼트가 있어야 매칭 — /shop 단독 경로에는 대응하는 page.tsx가 없음
            </code>
          </div>
          <button
            type="button"
            onClick={handleProbeZeroSegment}
            disabled={probing}
            className="rounded bg-amber-700 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
          >
            {probing ? '요청 중...' : '실제 요청으로 확인'}
          </button>
        </div>
        {probe && (
          <p className="mt-3 border-t border-amber-200 pt-2 font-mono text-[11px] text-amber-900 dark:border-amber-900/60 dark:text-amber-300">
            실제 HTTP 응답: {probe.status} {probe.ok ? '(라우트 매칭됨)' : '(Not Found — 매칭 실패 확인됨)'}
          </p>
        )}
      </div>
    </div>
  )
}
