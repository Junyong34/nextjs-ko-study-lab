'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from './VerificationFooter'
import keyboardImage from '../assets/keyboard.webp'

const SAMPLE_IMAGE_URL = keyboardImage.src

export function ImageComparisonClient() {
  const [quality, setQuality] = useState<number>(75)
  const [priority, setPriority] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<'both' | 'next-image' | 'html-img'>('both')
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)

  const handleQualityChange = (q: number) => {
    setQuality(q)
    setHasInteracted(true)
  }

  const handlePriorityChange = (p: boolean) => {
    setPriority(p)
    setHasInteracted(true)
  }

  const handleViewModeChange = (mode: 'both' | 'next-image' | 'html-img') => {
    setViewMode(mode)
    setHasInteracted(true)
  }

  const nextImageQuery = `/_next/image?url=${encodeURIComponent(SAMPLE_IMAGE_URL)}&w=828&q=${quality}`

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="Next.js 이미지 최적화 파이프라인 시뮬레이터" className="space-y-4">
        {/* 1. 최적화 옵션 툴바 & 뷰 모드 셀렉터 */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          {/* 뷰 모드 탭 */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">보기 모드:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleViewModeChange('both')}
                className={`rounded px-2.5 py-1 text-[11px] font-medium cursor-pointer transition ${
                  viewMode === 'both'
                    ? 'bg-zinc-900 text-white font-bold dark:bg-zinc-100 dark:text-zinc-900'
                    : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                동시 비교
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange('next-image')}
                className={`rounded px-2.5 py-1 text-[11px] font-medium cursor-pointer transition ${
                  viewMode === 'next-image'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                1. next/image
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange('html-img')}
                className={`rounded px-2.5 py-1 text-[11px] font-medium cursor-pointer transition ${
                  viewMode === 'html-img'
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                2. 일반 &lt;img&gt;
              </button>
            </div>
          </div>

          {/* 파라미터 조작부 */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                퀄리티: <strong className="font-mono text-zinc-900 dark:text-zinc-100">{quality}%</strong>
              </span>
              <input
                type="range"
                min={30}
                max={100}
                step={5}
                value={quality}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
                className="w-24 cursor-pointer"
              />
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer text-zinc-700 dark:text-zinc-300 font-medium">
              <input
                type="checkbox"
                checked={priority}
                onChange={(e) => handlePriorityChange(e.target.checked)}
                className="rounded border-zinc-300"
              />
              <span>priority (LCP 프리로드)</span>
            </label>
          </div>
        </div>

        {/* 2. 일반 <img> vs Next.js <Image> 비교 카드 그리드 */}
        <div
          className={`grid gap-4 text-xs ${
            viewMode === 'both' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {/* B. Next.js <Image> 컴포넌트 카드 */}
          {(viewMode === 'both' || viewMode === 'next-image') && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50/20 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/10 space-y-2.5">
                <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 dark:text-emerald-200">
                  1. Next.js &lt;Image&gt; 컴포넌트
                </span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  WebP/AVIF + Zero CLS
                </span>
                </div>

                {/* 실제 next/image 렌더링 */}
                <div className="relative aspect-video w-full overflow-hidden rounded border border-emerald-200 bg-zinc-900 flex items-center justify-center">
                  <Image
                      src={keyboardImage}
                      alt="Next.js Image Optimized"
                      width={400}
                      height={225}
                      quality={quality}
                      priority={priority}
                      className="rounded object-cover w-full h-full"
                  />
                </div>

                <div className="rounded bg-emerald-50 p-2.5 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 space-y-0.5">
                  <div className="font-sans font-semibold text-amber-700 dark:text-amber-400">
                    ⚠ 이 zone은 unoptimized 설정이라 실제 이미지는 바뀌지 않습니다. 아래는 옵션을 이렇게 설정했을 때 프로덕션(최적화 활성) 환경이라면 어떤 값으로 요청되는지 보여주는 참고용 표시입니다.
                  </div>
                  <div className="break-all">• 설정 시 요청될 URL: {nextImageQuery}</div>
                  <div>• 설정값 quality={quality} | 포맷: WebP/AVIF 자동 협상 (프로덕션 기준)</div>
                  <div>• 설정값 priority={priority ? 'true (<link rel="preload"> 주입)' : 'false (loading="lazy")'}</div>
                </div>
              </div>
          )}
          {/* A. 일반 <img> 태그 카드 */}
          {(viewMode === 'both' || viewMode === 'html-img') && (
            <div className="rounded-md border border-rose-200 bg-rose-50/20 p-3.5 dark:border-rose-900/40 dark:bg-rose-950/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-950 dark:text-rose-200">
                  2. 전통적인 HTML &lt;img&gt; 태그
                </span>
                <span className="rounded bg-rose-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  최적화 미적용 (원본 로드)
                </span>
              </div>

              {/* 실제 img 태그 렌더링 */}
              <div className="relative aspect-video w-full overflow-hidden rounded border border-rose-200 bg-zinc-900 flex items-center justify-center">
                <img
                  src={SAMPLE_IMAGE_URL}
                  alt="Standard HTML Img"
                  width="400"
                  height="225"
                  className="rounded object-cover w-full h-full"
                />
              </div>

              <div className="rounded bg-rose-50 p-2.5 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 font-mono text-[10px] text-zinc-600 dark:text-zinc-400 space-y-0.5">
                <div>• 요청 URL: {SAMPLE_IMAGE_URL}</div>
                <div>• 변환 포맷: 미지원 (원본 파일 그대로 서빙)</div>
                <div>• 지연 로딩: 기본값 eager (브라우저 기본 처리)</div>
              </div>
            </div>
          )}


        </div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter
        hasInteracted={hasInteracted}
        quality={quality}
        priority={priority}
        viewMode={viewMode}
      />
    </div>
  )
}
