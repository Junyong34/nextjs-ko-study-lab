'use client'

import React, { useRef, useState } from 'react'
import { RotateCw, ExternalLink } from 'lucide-react'
import { useDemoResizeBridge } from './useDemoResizeBridge'

/**
 * 두 자리에서 쓰던 프레임 모양입니다.
 *
 * - `standalone` — 데모 독립 열람 페이지. 툴바 버튼에 글자가 붙고 프레임이 크다
 * - `inline`     — 문서 본문에 끼워 넣는 프레임. 아이콘만 있고 작다
 *
 * 같은 모양으로 통일하면 화면이 바뀌므로 두 벌을 표로 보존합니다.
 * Phase 7에서 문서 본문의 iframe이 링크 카드로 바뀌면 `inline`은 쓰이지 않게 됩니다.
 */
export type DemoFrameVariant = 'standalone' | 'inline'

const VARIANT = {
  standalone: {
    container:
      'overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950',
    toolbar:
      'flex items-center justify-between border-b border-zinc-200 bg-zinc-50/90 px-4 py-2.5 backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900/90',
    dot: 'h-3 w-3',
    dotTone: ['bg-rose-400', 'bg-amber-400', 'bg-emerald-400'],
    actions: 'flex items-center gap-2',
    // NOTE: backdrop-blur-2xs는 Tailwind v4에 없는 클래스라 블러가 실제로 걸리지 않는다.
    // 원본 그대로 둔다 — 고치면 화면이 바뀐다. 계획서 4-2의 F1 참고.
    overlay:
      'absolute inset-0 flex items-center justify-center bg-zinc-50/80 backdrop-blur-2xs dark:bg-zinc-900/80 z-10',
    spinner:
      'h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100',
    spinnerWrap: 'flex flex-col items-center gap-2 text-zinc-500',
    spinnerText: 'text-xs font-medium',
    loadingText: '데모 앱을 로드하는 중...',
    iframe: 'w-full min-h-[500px] border-0 transition-[height] duration-200 ease-out',
  },
  inline: {
    container:
      'my-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-950',
    toolbar:
      'flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-4 py-2.5 backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900/80',
    dot: 'h-2.5 w-2.5',
    dotTone: ['bg-rose-400/80', 'bg-amber-400/80', 'bg-emerald-400/80'],
    actions: 'flex items-center gap-1',
    overlay:
      'absolute inset-0 flex items-center justify-center bg-zinc-50/70 backdrop-blur-2xs dark:bg-zinc-900/70 z-10',
    spinner:
      'h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300',
    spinnerWrap: 'flex flex-col items-center gap-2 text-zinc-400',
    spinnerText: 'text-xs',
    loadingText: '데모 불러오는 중...',
    iframe: 'w-full border-0 transition-[height] duration-200 ease-out',
  },
} as const

export interface DemoIframeProps {
  variant: DemoFrameVariant
  /** iframe이 열 주소 */
  src: string
  /** 툴바에 보여줄 라벨 (보통 데모 경로) */
  label: string
  /** iframe의 title 속성 */
  title: string
  /** 새 탭/독립 페이지로 여는 주소. 없으면 버튼을 그리지 않는다 */
  externalHref?: string
  initialHeight: number
  minHeight: number
  /** 프레임 아래에 붙는 관찰 포인트 안내 */
  footer?: React.ReactNode
}

export function DemoIframe({
  variant,
  src,
  label,
  title,
  externalHref,
  initialHeight,
  minHeight,
  footer,
}: DemoIframeProps) {
  const style = VARIANT[variant]
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const height = useDemoResizeBridge(iframeRef, { initialHeight, minHeight })

  const handleReload = () => {
    if (!iframeRef.current) return
    setIsLoading(true)
    try {
      iframeRef.current.contentWindow?.location.reload()
    } catch {
      // 크로스 오리진이면 접근할 수 없으니 src를 다시 매겨 새로 띄운다
      iframeRef.current.src = src
    }
  }

  const withLabels = variant === 'standalone'

  return (
    <div className={style.container}>
      <div className={style.toolbar}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5">
            {style.dotTone.map((tone) => (
              <div key={tone} className={`${style.dot} rounded-full ${tone}`} />
            ))}
          </div>
          <span className="truncate text-xs font-mono text-zinc-500 dark:text-zinc-400 ml-2">
            {label}
          </span>
        </div>

        <div className={style.actions}>
          <button
            type="button"
            onClick={handleReload}
            title="데모 새로고침"
            className={
              withLabels
                ? 'flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                : 'rounded p-1 text-zinc-500 transition hover:bg-zinc-200/60 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
            }
          >
            <RotateCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {withLabels && <span className="hidden sm:inline">새로고침</span>}
          </button>

          {externalHref && (
            <a
              href={externalHref}
              target="_blank"
              rel="noreferrer"
              title={withLabels ? 'Zone 직접 열기' : '독립 페이지로 열기'}
              className={
                withLabels
                  ? 'flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                  : 'rounded p-1 text-zinc-500 transition hover:bg-zinc-200/60 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
              }
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {withLabels && <span className="hidden sm:inline">새 탭</span>}
            </a>
          )}
        </div>
      </div>

      <div className="relative w-full overflow-hidden bg-white dark:bg-zinc-900">
        {isLoading && (
          <div style={{ height: `${height}px` }} className={style.overlay}>
            <div className={style.spinnerWrap}>
              <div className={style.spinner} />
              <span className={style.spinnerText}>{style.loadingText}</span>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={src}
          style={{ height: `${height}px` }}
          className={style.iframe}
          onLoad={() => setIsLoading(false)}
          title={title}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>

      {footer}
    </div>
  )
}
