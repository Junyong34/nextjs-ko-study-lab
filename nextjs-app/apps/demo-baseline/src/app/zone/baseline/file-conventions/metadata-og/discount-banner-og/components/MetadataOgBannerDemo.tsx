'use client'
import React from 'react'

export function MetadataOgBannerDemo() {
  const OG_URL = '/zone/baseline/file-conventions/metadata-og/discount-banner-og/opengraph-image'
  const TWITTER_URL = '/zone/baseline/file-conventions/metadata-og/discount-banner-og/twitter-image'

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">동적 OpenGraph / Twitter 이미지 생성</h4>
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              opengraph-image.tsx (1200x630)
            </span>
          </div>
          <p className="text-xs text-zinc-500">SNS 공유 시 노출될 대표 썸네일 이미지를 next/og의 ImageResponse로 동적 생성합니다.</p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-900 p-4 text-white shadow-xl space-y-3">
        <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-zinc-800 pb-2">
          <span>SNS 오픈그래프 미리보기 (1200x630 비율)</span>
          <span className="font-mono text-emerald-400">{OG_URL}</span>
        </div>
        <div className="h-44 w-full rounded-md bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 flex flex-col items-center justify-center p-4 text-center border border-indigo-700/50">
          <div className="text-[11px] font-mono text-sky-400 mb-1">NEXT.JS 16 APP ROUTER STUDY LAB</div>
          <div className="text-xl font-black text-amber-300">🔥 2026 시즌 오픈 특별 30% 타임 세일 🔥</div>
          <div className="text-xs text-zinc-300 mt-2">프리미엄 러닝화 & 테크 웨어 전 품목 즉시 할인 적용</div>
        </div>
        <div className="text-[11px] text-zinc-400 font-mono">
          • HTML 메타 태그: &lt;meta property="og:image" content="{OG_URL}" /&gt; 자동 주입 완료
        </div>
      </div>
    </div>
  )
}
