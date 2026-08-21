'use client'

import React, { useState, useEffect, useRef } from 'react'
import { RotateCw, ExternalLink, Maximize2 } from 'lucide-react'

interface DemoViewerProps {
  src: string
  title: string
}

export function DemoViewer({ src, title }: DemoViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState<number>(600)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Same-Origin check
      if (typeof window === 'undefined' || event.origin !== window.location.origin) {
        return
      }

      // Check iframe source window
      if (
        iframeRef.current &&
        iframeRef.current.contentWindow &&
        event.source !== iframeRef.current.contentWindow
      ) {
        return
      }

      // Handle DEMO_RESIZE
      if (
        event.data &&
        typeof event.data === 'object' &&
        event.data.type === 'DEMO_RESIZE' &&
        typeof event.data.height === 'number'
      ) {
        const nextHeight = Math.max(event.data.height, 400)
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
        iframeRef.current.src = src
      }
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Chrome Toolbar */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/90 px-4 py-2.5 backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <span className="truncate text-xs font-mono text-zinc-500 dark:text-zinc-400 ml-2">
            {src}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReload}
            title="데모 새로고침"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">새로고침</span>
          </button>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            title="Zone 직접 열기"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">새 탭</span>
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-zinc-900">
        {isLoading && (
          <div
            style={{ height: `${height}px` }}
            className="absolute inset-0 flex items-center justify-center bg-zinc-50/80 backdrop-blur-2xs dark:bg-zinc-900/80 z-10"
          >
            <div className="flex flex-col items-center gap-2 text-zinc-500">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
              <span className="text-xs font-medium">데모 앱을 로드하는 중...</span>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={src}
          style={{ height: `${height}px` }}
          className="w-full min-h-[500px] border-0 transition-[height] duration-200 ease-out"
          onLoad={() => setIsLoading(false)}
          title={title}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  )
}
