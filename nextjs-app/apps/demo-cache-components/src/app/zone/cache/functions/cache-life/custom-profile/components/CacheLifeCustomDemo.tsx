'use client'

import React, { useState } from 'react'

export function CacheLifeCustomDemo() {
  const [selectedPreset, setSelectedPreset] = useState<'flash-sale' | 'catalog' | 'reviews'>('flash-sale')

  const presets = {
    'flash-sale': {
      name: 'flashSale (타임세일 초단기 캐시)',
      stale: 5,
      revalidate: 15,
      expire: 60,
      description: '실시간 잔여 재고 및 특가 가격을 빠르게 갱신 (초 단위)',
    },
    catalog: {
      name: 'catalog (표준 상품 카탈로그)',
      stale: 300,
      revalidate: 900,
      expire: 3600,
      description: '기본 상품 정보, 스펙, 이미지 캐시 (분/시간 단위)',
    },
    reviews: {
      name: 'reviews (구매 후기 및 평점)',
      stale: 3600,
      revalidate: 86400,
      expire: 604800,
      description: '사용자 구매 후기 및 별점 집계 (일/주 단위)',
    },
  }[selectedPreset]

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. 프리셋 선택기 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
            Next.js 16 cacheLife 커스텀 프로필 설정 콘솔
          </h4>
          <p className="text-xs text-zinc-500">
            next.config.ts의 cacheLife 프로필과 연동하여 stale / revalidate / expire 주기를 선언적으로 제어합니다.
          </p>
        </div>

        <div className="flex gap-2">
          {(['flash-sale', 'catalog', 'reviews'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedPreset(key)}
              className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${
                selectedPreset === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 캐시 수명 주기 타임라인 */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            {presets.name}
          </span>
          <span className="text-[11px] text-zinc-500">{presets.description}</span>
        </div>

        {/* 3단계 타임라인 막대 */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="rounded bg-emerald-100 p-2.5 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900">
            <div className="font-bold text-emerald-900 dark:text-emerald-300">1. Stale ({presets.stale}초)</div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">클라이언트 즉시 반환</div>
          </div>
          <div className="rounded bg-blue-100 p-2.5 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-900">
            <div className="font-bold text-blue-900 dark:text-blue-300">2. Revalidate ({presets.revalidate}초)</div>
            <div className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">백그라운드 비동기 갱신</div>
          </div>
          <div className="rounded bg-purple-100 p-2.5 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-900">
            <div className="font-bold text-purple-900 dark:text-purple-300">3. Expire ({presets.expire}초)</div>
            <div className="text-[10px] text-purple-700 dark:text-purple-400 mt-0.5">캐시 완전 만료 & 재생성</div>
          </div>
        </div>
      </div>

      {/* 3. next.config.ts & cacheLife 호출부 인스펙터 */}
      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
          컴포넌트 내 cacheLife 호출:
        </div>
        <div className="space-y-1 text-[11px]">
          <div className="text-emerald-400">async function ProductHero() {'{'}</div>
          <div className="pl-4 text-blue-300 font-bold">'use cache';</div>
          <div className="pl-4 text-amber-300 font-bold">cacheLife('{selectedPreset}');</div>
          <div className="pl-4 text-zinc-400">// next.config.ts cacheLife profile: {'{'} stale: {presets.stale}, revalidate: {presets.revalidate}, expire: {presets.expire} {'}'}</div>
          <div className="text-emerald-400">{'}'}</div>
        </div>
      </div>
    </div>
  )
}
