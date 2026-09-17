'use client'
import React, { useState } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { VerificationFooter } from './VerificationFooter'
import type { CrawlerMode } from '../types'

const PREVIEW_ENDPOINT =
  '/zone/baseline/file-conventions/metadata-robots/dynamic-crawler-rules/preview'

export function MetadataRobotsDemo() {
  const [mode, setMode] = useState<CrawlerMode | null>(null)
  const [requestedUrl, setRequestedUrl] = useState('')
  const [status, setStatus] = useState<number | null>(null)
  const [contentType, setContentType] = useState<string | null>(null)
  const [bodyText, setBodyText] = useState('대기 중: 아래 버튼을 눌러 실제 robots.txt 생성 요청을 보내세요.')
  const [isLoading, setIsLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

  const requestRobots = async (nextMode: CrawlerMode) => {
    const url = `${PREVIEW_ENDPOINT}?mode=${nextMode}`
    setIsLoading(true)
    setMode(nextMode)
    setRequestedUrl(url)
    try {
      const res = await fetch(url)
      const text = await res.text()
      setStatus(res.status)
      setContentType(res.headers.get('content-type'))
      setBodyText(text)
      setHasFetched(true)
    } catch (err: unknown) {
      setStatus(null)
      setContentType(null)
      setBodyText(String(err))
      setHasFetched(true)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setMode(null)
    setRequestedUrl('')
    setStatus(null)
    setContentType(null)
    setBodyText('대기 중: 아래 버튼을 눌러 실제 robots.txt 생성 요청을 보내세요.')
    setHasFetched(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => requestRobots('production')}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
            >
              <span className="font-mono text-[10px] font-bold">production</span>
              <span>모드로 요청</span>
            </button>
            <button
              type="button"
              onClick={() => requestRobots('staging')}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-amber-700 disabled:opacity-50 cursor-pointer"
            >
              <span className="font-mono text-[10px] font-bold">staging</span>
              <span>모드로 요청</span>
            </button>
          </div>
          <DemoResetButton onReset={reset} />
        </div>

        <div className="overflow-hidden rounded-md border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                GET
              </span>
              <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                {requestedUrl || PREVIEW_ENDPOINT}
              </span>
            </div>
            <span
              className={`font-mono text-xs font-bold ${
                status && status < 400 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'
              }`}
            >
              {isLoading ? '요청 전송 중...' : status ? `${status} · ${contentType}` : '대기 중'}
            </span>
          </div>

          <pre className="max-h-72 overflow-y-auto p-3.5 font-mono text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed bg-zinc-50/30 dark:bg-zinc-900/20">
            {bodyText}
          </pre>
        </div>
      </div>

      <VerificationFooter mode={mode} bodyText={bodyText} hasFetched={hasFetched} />
    </div>
  )
}
