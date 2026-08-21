'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ExternalLink, RotateCw, Play } from 'lucide-react'

export interface DemoFrameProps {
  /** 데모 경로 식별자 (예: "caching/use-cache-basic") */
  path?: string
  /** 데모가 위치한 zone 슬러그 (예: "cache", "baseline") */
  zone?: string
  /** 직접 지정할 iframe URL (지정 시 path/zone 대신 우선 적용) */
  src?: string
  /** 초기 iframe 높이 (px, CLS 방지용, 기본값: 360) */
  initialHeight?: number
  /** iframe 높이 별칭 */
  height?: number
  /** 데모 관찰 지시 또는 설명 캡션 */
  caption?: string
  /** 렌더링 모드: 'inline' (iframe 임베드) 또는 'fullscreen' (독립 페이지 이동 카드) */
  mode?: 'inline' | 'fullscreen'
  className?: string
}

/**
 * 마크다운 문서 내에 데모를 인라인 임베드하거나 독립 열람을 안내하는 프레임 컴포넌트입니다.
 * 내부 데모 앱으로부터 `DEMO_RESIZE` postMessage를 받아 iframe 높이를 실시간 동기화합니다.
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
  // 실제 iframe에 전달할 목적지 URL 계산
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

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState<number>(propHeight || initialHeight)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 1. Same-Origin 검증
      if (typeof window === 'undefined' || event.origin !== window.location.origin) {
        return
      }

      // 2. 메시지를 보낸 송신자가 현재 iframe의 contentWindow인지 검증
      if (
        iframeRef.current &&
        iframeRef.current.contentWindow &&
        event.source !== iframeRef.current.contentWindow
      ) {
        return
      }

      // 3. DEMO_RESIZE 이벤트 처리
      if (
        event.data &&
        typeof event.data === 'object' &&
        event.data.type === 'DEMO_RESIZE' &&
        typeof event.data.height === 'number'
      ) {
        const nextHeight = Math.max(event.data.height, 80)
        setHeight((prev) => (Math.abs(prev - nextHeight) > 2 ? nextHeight : prev))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const handleReload = () => {
    if (iframeRef.current) {
      setIsLoading(true)
      try {
        iframeRef.current.contentWindow?.location.reload()
      } catch {
        iframeRef.current.src = computedSrc
      }
    }
  }

  // fullscreen 모드인 경우 독립 열람 카드 렌더링
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
        {caption && (
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            {caption}
          </p>
        )}
      </div>
    )
  }

  return (
    <div
      className={`my-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-950 ${className}`}
    >
      {/* 프레임 상단 툴바 */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-4 py-2.5 backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="truncate text-xs font-mono text-zinc-500 dark:text-zinc-400 ml-2">
            {path || computedSrc}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleReload}
            title="데모 새로고침"
            className="rounded p-1 text-zinc-500 transition hover:bg-zinc-200/60 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <RotateCw
              className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
            />
          </button>
          {standaloneUrl && (
            <a
              href={standaloneUrl}
              target="_blank"
              rel="noreferrer"
              title="독립 페이지로 열기"
              className="rounded p-1 text-zinc-500 transition hover:bg-zinc-200/60 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* 프레임 콘텐츠 (iframe + 로딩 상태) */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-zinc-900">
        {isLoading && (
          <div
            style={{ height: `${height}px` }}
            className="absolute inset-0 flex items-center justify-center bg-zinc-50/70 backdrop-blur-2xs dark:bg-zinc-900/70 z-10"
          >
            <div className="flex flex-col items-center gap-2 text-zinc-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300" />
              <span className="text-xs">데모 불러오는 중...</span>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={computedSrc}
          style={{ height: `${height}px` }}
          className="w-full border-0 transition-[height] duration-200 ease-out"
          onLoad={() => setIsLoading(false)}
          title={caption || `Interactive Demo: ${path}`}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>

      {/* 하단 캡션 바 */}
      {caption && (
        <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-2 text-xs text-zinc-600 dark:border-zinc-800/60 dark:bg-zinc-900/30 dark:text-zinc-400">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            관찰 포인트:{' '}
          </span>
          {caption}
        </div>
      )}
    </div>
  )
}
