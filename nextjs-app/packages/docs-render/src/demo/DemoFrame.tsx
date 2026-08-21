'use client'

import React from 'react'
import { ExternalLink, Play } from 'lucide-react'
import { DemoIframe } from './DemoIframe'

export interface DemoFrameProps {
  /** 데모 경로 식별자 (예: "caching/use-cache-basic") */
  path?: string
  /** 데모가 도는 zone 슬러그 (예: "cache", "baseline") */
  zone?: string
  /** 직접 지정할 iframe URL (주면 path/zone보다 우선) */
  src?: string
  /** 초기 iframe 높이 (px, CLS 방지용) */
  initialHeight?: number
  /** initialHeight의 별칭 */
  height?: number
  /** 관찰 포인트 안내 */
  caption?: string
  /** inline: iframe 임베드 / fullscreen: 독립 페이지로 보내는 카드 */
  mode?: 'inline' | 'fullscreen'
  className?: string
}

/**
 * 문서 본문의 ` ```demo ` 코드펜스가 그리는 프레임입니다.
 *
 * **이 컴포넌트의 iframe 모드는 [규칙 16](../../../../AGENTS.md)에 어긋납니다** —
 * 문서 본문에는 iframe이 없어야 하고 링크 카드가 있어야 합니다. Phase 7에서 정리합니다.
 */
export function DemoFrame({
  path,
  zone,
  src,
  initialHeight = 360,
  height: propHeight,
  caption,
  mode = 'inline',
  className = '',
}: DemoFrameProps) {
  const computedSrc =
    src ||
    (zone && path
      ? `/zone/${zone}/${path}`
      : path?.startsWith('/zone/')
        ? path
        : path
          ? `/zone/${zone || 'baseline'}/${path}`
          : '')

  const standaloneUrl = path ? `/demo/${path}` : undefined

  if (mode === 'fullscreen' && standaloneUrl) {
    return (
      <div
        className={`my-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              전체화면 독립 데모
            </span>
          </div>
          <a
            href={standaloneUrl}
            className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <span>데모 열기</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        {caption && <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{caption}</p>}
      </div>
    )
  }

  return (
    <div className={className}>
      <DemoIframe
        variant="inline"
        src={computedSrc}
        label={path || computedSrc}
        title={caption || `Interactive Demo: ${path}`}
        externalHref={standaloneUrl}
        initialHeight={propHeight || initialHeight}
        minHeight={80}
        footer={
          caption ? (
            <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-2 text-xs text-zinc-600 dark:border-zinc-800/60 dark:bg-zinc-900/30 dark:text-zinc-400">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">관찰 포인트: </span>
              {caption}
            </div>
          ) : undefined
        }
      />
    </div>
  )
}
