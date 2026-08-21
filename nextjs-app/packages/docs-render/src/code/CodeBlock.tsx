'use client'

import React, { useState, useEffect } from 'react'
import { Check, Copy, FileCode, Terminal } from 'lucide-react'
import { normalizeLang, cacheKeyFor, getCached, highlight } from './highlight'

export interface CodeBlockProps {
  code: string
  language: string
  filename?: string
}

/** 구문 강조 + 파일명 헤더 + 복사 버튼이 붙은 코드블록. */
export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const normLang = normalizeLang(language)
  const cacheKey = cacheKeyFor(normLang, code)

  // 캐시에 있으면 첫 렌더부터 강조된 상태로 나온다
  const [html, setHtml] = useState<string>(() => getCached(cacheKey) || '')

  useEffect(() => {
    let isMounted = true

    const cached = getCached(cacheKey)
    if (cached) {
      setHtml(cached)
      return
    }

    highlight(code, language)
      .then((result) => {
        if (isMounted) setHtml(result)
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [code, language, cacheKey])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 복사 실패는 무시한다 (권한 없는 환경)
    }
  }

  const isTerminal = normLang === 'bash' || normLang === 'shell' || normLang === 'sh' || normLang === 'terminal'

  return (
    <div className="not-prose group relative my-4 overflow-hidden rounded-xl border border-zinc-200/80 bg-[#24292e] text-zinc-100 shadow-xs dark:border-zinc-800 dark:bg-[#1f2428]">
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-[#1f2428]/95 px-4 py-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2 min-w-0">
          {filename ? (
            <>
              {isTerminal ? (
                <Terminal className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              ) : (
                <FileCode className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              )}
              <span className="font-mono text-xs font-semibold text-zinc-200 truncate">
                {filename}
              </span>
              <span className="rounded bg-zinc-800 px-1.5 py-0.2 font-mono text-[10px] text-zinc-400 uppercase">
                {language || 'code'}
              </span>
            </>
          ) : (
            <>
              {isTerminal && <Terminal className="h-3.5 w-3.5 shrink-0 text-zinc-400" />}
              <span className="font-mono text-[11px] font-medium text-zinc-400 uppercase">
                {language || 'text'}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition shrink-0 ml-2"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">복사됨</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>복사</span>
            </>
          )}
        </button>
      </div>

      {html ? (
        <div
          className="shiki-wrapper overflow-x-auto p-4 font-mono text-xs leading-relaxed [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
