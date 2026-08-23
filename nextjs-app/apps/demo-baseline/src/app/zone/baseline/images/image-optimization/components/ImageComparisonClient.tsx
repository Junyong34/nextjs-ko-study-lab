'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export function ImageComparisonClient() {
  const [quality, setQuality] = useState<number>(75)
  const [priority, setPriority] = useState<boolean>(false)

  return (
    <div className="space-y-4">
      {/* 1. 최적화 옵션 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            압축 퀄리티: {quality}%
          </span>
          <input
            type="range"
            min={30}
            max={100}
            step={5}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-28 cursor-pointer"
          />
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={priority}
            onChange={(e) => setPriority(e.target.checked)}
            className="rounded border-zinc-300"
          />
          <span>priority (LCP 사전 로드)</span>
        </label>
      </div>

      {/* 2. 일반 <img> vs Next.js <Image> 2단 비교 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
        {/* A. 일반 <img> 엘리먼트 */}
        <div className="rounded-md border border-rose-200 bg-rose-50/20 p-3.5 dark:border-rose-900/40 dark:bg-rose-950/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-950 dark:text-rose-200">
              전통적인 HTML {'<'}img{'>'}
            </span>
            <span className="rounded bg-rose-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              최적화 없음
            </span>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded border border-rose-200 bg-rose-100/50 dark:border-rose-900/40 dark:bg-rose-950/40 flex items-center justify-center">
            {/* SVG 목업 이미지 */}
            <svg
              className="h-16 w-16 text-rose-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <ul className="space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400 list-disc list-inside">
            <li>원본 대용량 포맷(PNG/JPEG 그대로 다운로드)</li>
            <li>종횡비 미지정 시 로딩 중 <strong>CLS (Layout Shift)</strong> 발생</li>
            <li>기기 해상도(DPR)와 무관한 단일 해상도 요청</li>
          </ul>
        </div>

        {/* B. Next.js <Image> 컴포넌트 */}
        <div className="rounded-md border border-emerald-200 bg-emerald-50/20 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 dark:text-emerald-200">
              Next.js {'<'}Image{'>'}
            </span>
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              WebP/AVIF + Zero CLS
            </span>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded border border-emerald-200 bg-emerald-100/50 dark:border-emerald-900/40 dark:bg-emerald-950/40 flex items-center justify-center">
            {/* SVG 목업 이미지 */}
            <svg
              className="h-16 w-16 text-emerald-500 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          <ul className="space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400 list-disc list-inside">
            <li>브라우저 지원 포맷(WebP / AVIF)으로 자동 압축 (~70% 용량 절감)</li>
            <li>고유 intrinsic 비율 자동 계산으로 <strong>CLS 0 달성</strong></li>
            <li>srcset 자동 생성으로 Retina 2x, 3x 디스플레이 최적 해상도 분기</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
