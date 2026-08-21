'use client'

import React, { useState } from 'react'
import { DemoFrame, DemoFrameProps } from './DemoFrame'
import { DocDemoList, DemoItem } from './DocDemoList'
import { Check, Copy, Info, AlertTriangle, Lightbulb, AlertCircle, ExternalLink } from 'lucide-react'

export interface MarkdownRendererProps {
  /** 렌더링할 마크다운 원문 텍스트 */
  content: string
  /** 문서와 연관된 데모 목록 (demos.yaml에서 로드된 목록) */
  demos?: DemoItem[]
  /** 현재 문서의 경로 (예: "1-getting-started/caching.md") */
  docPath?: string
  /** 문서 하단에 매핑된 데모 목록(DocDemoList) 자동 표시 여부 (기본값: true) */
  showDemoList?: boolean
  className?: string
}

interface DemoConfig {
  path: string
  mode?: 'inline' | 'fullscreen'
  height?: number
  caption?: string
  zone?: string
}

/**
 * 마크다운 내부의 상대 이미지 경로(예: ./assets/image.webp)를
 * Next.js API 엔드포인트(/docs-assets/...)로 변환합니다.
 */
function resolveAssetUrl(src: string, docPath?: string): string {
  if (!src) return ''
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('/docs-assets/')) {
    return src
  }

  const cleanSrc = src.replace(/^\.\//, '')
  if (!docPath) {
    return `/docs-assets/${cleanSrc}`
  }

  // docPath가 "1-getting-started/caching.md"인 경우 디렉토리 "1-getting-started" 추출
  const lastSlashIdx = docPath.lastIndexOf('/')
  const docDir = lastSlashIdx !== -1 ? docPath.slice(0, lastSlashIdx) : ''

  if (docDir) {
    return `/docs-assets/${docDir}/${cleanSrc}`
  }
  return `/docs-assets/${cleanSrc}`
}

/**
 * ` ```demo ... ``` ` 블록 텍스트를 key-value 설정 객체로 파싱합니다.
 */
function parseDemoBlock(blockText: string): DemoConfig {
  const lines = blockText.split('\n')
  const config: Partial<DemoConfig> = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue

    const key = trimmed.slice(0, colonIdx).trim()
    const value = trimmed.slice(colonIdx + 1).trim()

    if (key === 'path') {
      config.path = value
    } else if (key === 'mode') {
      if (value === 'fullscreen' || value === 'inline') {
        config.mode = value
      }
    } else if (key === 'height') {
      const parsed = parseInt(value, 10)
      if (!isNaN(parsed)) {
        config.height = parsed
      }
    } else if (key === 'caption') {
      config.caption = value
    } else if (key === 'zone') {
      config.zone = value
    }
  }

  return {
    path: config.path || '',
    mode: config.mode || 'inline',
    height: config.height,
    caption: config.caption,
    zone: config.zone,
  }
}

export interface SlugResult {
  primary: string
  alias?: string
}

/**
 * 마크다운 헤딩 텍스트를 HTML id (slug)로 변환합니다.
 */
export function slugify(text: string): SlugResult {
  const clean = text
    .replace(/<[^>]*>/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()

  const primary = clean
    .toLowerCase()
    .replace(/["'“”‘’]/g, '')
    .replace(/[^\w\s\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  let alias: string | undefined
  const parenMatch = clean.match(/^([^(]+)\s*\(([^)]+)\)$/)
  if (parenMatch) {
    const englishPart = parenMatch[1].trim()
    const aliasCandidate = englishPart
      .toLowerCase()
      .replace(/["'“”‘’]/g, '')
      .replace(/[^\w\s-]/g, ' ')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    if (aliasCandidate && aliasCandidate !== primary) {
      alias = aliasCandidate
    }
  }

  return { primary, alias }
}

import { codeToHtml } from 'shiki'

// 언어 정규화 맵
const LANG_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  html: 'html',
  css: 'css',
  json: 'json',
  sh: 'bash',
  bash: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  markdown: 'markdown',
  sql: 'sql',
  env: 'dotenv',
}

// 하이라이팅 결과 메모리 캐시
const highlightCache = new Map<string, string>()

/**
 * 코드 블록 컴포넌트 (Shiki 구문 강조, 복사 버튼 및 언어 태그 지원)
 */
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)
  const normLang = LANG_MAP[language.toLowerCase()] || language.toLowerCase() || 'text'
  const cacheKey = `${normLang}:${code}`

  const [html, setHtml] = useState<string>(() => {
    return highlightCache.get(cacheKey) || ''
  })

  React.useEffect(() => {
    let isMounted = true

    if (highlightCache.has(cacheKey)) {
      setHtml(highlightCache.get(cacheKey)!)
      return
    }

    codeToHtml(code, {
      lang: normLang,
      theme: 'github-dark',
    })
      .then((highlighted) => {
        highlightCache.set(cacheKey, highlighted)
        if (isMounted) {
          setHtml(highlighted)
        }
      })
      .catch(() => {
        // 지원하지 않는 언어인 경우 text로 폴백
        codeToHtml(code, { lang: 'text', theme: 'github-dark' })
          .then((fallback) => {
            highlightCache.set(cacheKey, fallback)
            if (isMounted) {
              setHtml(fallback)
            }
          })
          .catch(() => {})
      })

    return () => {
      isMounted = false
    }
  }, [code, normLang, cacheKey])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 복사 실패 무시
    }
  }

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-zinc-200/80 bg-[#24292e] text-zinc-100 shadow-xs dark:border-zinc-800 dark:bg-[#1f2428]">
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-[#1f2428]/90 px-4 py-1.5 text-xs text-zinc-400">
        <span className="font-mono text-[11px] font-medium text-zinc-400">{language || 'text'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition"
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

/**
 * 마크다운 내부의 상대 문서 링크(예: ../README.md, ./installation.md, ../2-guides/2.14-server-actions.md)를
 * Next.js 정규화 라우트 URL(예: /getting-started/installation, /guides/server-actions)로 자동 변환합니다.
 */
function cleanSegment(segment: string): string {
  return segment.replace(/^\d+(\.\d+)*-/, '')
}

function resolveDocLink(href: string, docPath?: string): string {
  if (!href) return ''
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('#') ||
    href.startsWith('tel:')
  ) {
    return href
  }

  // 앵커(#) 분리
  const hashIdx = href.indexOf('#')
  const rawTarget = hashIdx !== -1 ? href.slice(0, hashIdx) : href
  const hash = hashIdx !== -1 ? href.slice(hashIdx) : ''

  if (!rawTarget) {
    return hash || '#'
  }

  // docPath 기준 상대 경로 결합
  let combined = rawTarget
  if (docPath) {
    const lastSlash = docPath.lastIndexOf('/')
    const baseDir = lastSlash !== -1 ? docPath.slice(0, lastSlash) : ''
    const baseParts = baseDir ? baseDir.split('/') : []
    const targetParts = rawTarget.split('/')
    const mergedParts = [...baseParts, ...targetParts]

    const normalizedParts: string[] = []
    for (const p of mergedParts) {
      if (!p || p === '.') continue
      if (p === '..') {
        normalizedParts.pop()
      } else {
        normalizedParts.push(p)
      }
    }
    combined = normalizedParts.join('/')
  }

  // 최상위 README.md ➡️ 홈(/)
  if (combined === 'README.md' || combined === '') {
    return '/' + hash
  }

  const parts = combined.split('/')
  const filename = parts.pop() || ''
  const cleanedDirs = parts.map(cleanSegment)

  if (filename === 'README.md') {
    return '/' + cleanedDirs.join('/') + hash
  }

  const cleanFilename = cleanSegment(filename.replace(/\.md$/, ''))
  const fullSlug = [...cleanedDirs, cleanFilename].filter(Boolean)
  return '/' + fullSlug.join('/') + hash
}

/**
 * 인라인 마크다운 (이미지, 굵게, 기울임, 링크, 인라인 코드 등) 렌더링 헬퍼
 */
function renderInline(text: string, docPath?: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let remaining = text
  let keyIdx = 0

  while (remaining.length > 0) {
    // 1. Inline Image: ![alt](url)
    const imgMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
    if (imgMatch) {
      const alt = imgMatch[1]
      const rawSrc = imgMatch[2]
      const resolvedSrc = resolveAssetUrl(rawSrc, docPath)
      parts.push(
        <img
          key={`inline-img-${keyIdx++}`}
          src={resolvedSrc}
          alt={alt}
          className="inline-block my-2 max-h-96 rounded-lg border border-zinc-200 shadow-xs dark:border-zinc-800"
          loading="lazy"
        />
      )
      remaining = remaining.slice(imgMatch[0].length)
      continue
    }

    // 2. Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/)
    if (codeMatch) {
      parts.push(
        <code
          key={`c-${keyIdx++}`}
          className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 font-semibold"
        >
          {codeMatch[1]}
        </code>
      )
      remaining = remaining.slice(codeMatch[0].length)
      continue
    }

    // 3. Link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch) {
      const rawHref = linkMatch[2]
      const resolvedHref = resolveDocLink(rawHref, docPath)
      const isExternal = resolvedHref.startsWith('http://') || resolvedHref.startsWith('https://')

      parts.push(
        <a
          key={`l-${keyIdx++}`}
          href={resolvedHref}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
          className="text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:text-zinc-600 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:text-zinc-300 font-medium"
        >
          {linkMatch[1]}
        </a>
      )
      remaining = remaining.slice(linkMatch[0].length)
      continue
    }

    // 4. Bold: **bold**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/)
    if (boldMatch) {
      parts.push(
        <strong key={`b-${keyIdx++}`} className="font-semibold text-zinc-900 dark:text-zinc-100">
          {boldMatch[1]}
        </strong>
      )
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    // 5. Italic: *italic* or _italic_
    const italicMatch = remaining.match(/^(\*|_)([^*_]+)\1/)
    if (italicMatch) {
      parts.push(
        <em key={`i-${keyIdx++}`} className="italic">
          {italicMatch[2]}
        </em>
      )
      remaining = remaining.slice(italicMatch[0].length)
      continue
    }

    // Plain text chunk up to the next special char (! ` [ * _)
    const nextSpecial = remaining.search(/[!`[*_]/)
    if (nextSpecial === -1) {
      parts.push(remaining)
      break
    } else if (nextSpecial === 0) {
      // Single unrecognized special char, push it and move 1 char forward
      parts.push(remaining[0])
      remaining = remaining.slice(1)
    } else {
      parts.push(remaining.slice(0, nextSpecial))
      remaining = remaining.slice(nextSpecial)
    }
  }

  return parts
}

/**
 * 테이블 렌더링 헬퍼
 */
function renderTable(tableLines: string[], key: string, docPath?: string) {
  const headerLine = tableLines[0]
  const rows = tableLines.slice(2) // separator 라인 제외

  const parseCells = (line: string) =>
    line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim())

  const headers = parseCells(headerLine)

  return (
    <div key={key} className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            {headers.map((h, idx) => (
              <th key={idx} className="px-4 py-2 font-semibold text-zinc-800 dark:text-zinc-200">
                {renderInline(h, docPath)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {rows.map((r, rIdx) => {
            const cells = parseCells(r)
            return (
              <tr key={rIdx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                {cells.map((c, cIdx) => (
                  <td key={cIdx} className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
                    {renderInline(c, docPath)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/**
 * 경량 마크다운 렌더러 컴포넌트입니다.
 * 마크다운 본문의 이미지 및 ` ```demo ... ``` ` 코드펜스를 렌더링하고,
 * 문서 하단에 관련된 데모 목록(`DocDemoList`)을 표시합니다.
 */
export function MarkdownRenderer({
  content,
  demos = [],
  docPath,
  showDemoList = true,
  className = '',
}: MarkdownRendererProps) {
  // 문서와 관련된 데모 필터링
  const relatedDemos = docPath
    ? demos.filter((d) => d.doc === docPath)
    : demos

  // 블록 분할 및 렌더링
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let idx = 0

  let inCodeBlock = false
  let codeBlockLang = ''
  let codeBlockLines: string[] = []

  let inTable = false
  let tableLines: string[] = []

  const flushTable = () => {
    if (tableLines.length >= 2) {
      elements.push(renderTable(tableLines, `table-${idx++}`, docPath))
    }
    tableLines = []
    inTable = false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // 1. Code Block Fence 처리
    if (trimmed.startsWith('```')) {
      if (inTable) flushTable()

      if (!inCodeBlock) {
        // 코드 블록 시작
        inCodeBlock = true
        codeBlockLang = trimmed.slice(3).trim()
        codeBlockLines = []
        continue
      } else {
        // 코드 블록 종료
        inCodeBlock = false
        const fullCode = codeBlockLines.join('\n')

        if (codeBlockLang === 'demo') {
          // ```demo 블록 파싱 -> DemoFrame 렌더링
          const demoConfig = parseDemoBlock(fullCode)
          const matchedDemo = demos.find((d) => d.url === demoConfig.path)
          const zone = demoConfig.zone || matchedDemo?.zone

          elements.push(
            <DemoFrame
              key={`demo-${demoConfig.path || idx++}`}
              path={demoConfig.path}
              zone={zone}
              mode={demoConfig.mode}
              height={demoConfig.height}
              caption={demoConfig.caption}
            />
          )
        } else {
          elements.push(
            <CodeBlock
              key={`code-${idx++}`}
              code={fullCode}
              language={codeBlockLang}
            />
          )
        }
        continue
      }
    }

    if (inCodeBlock) {
      codeBlockLines.push(line)
      continue
    }

    // 2. Standalone Image Block: ![alt](url)
    const imgBlockMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgBlockMatch) {
      if (inTable) flushTable()
      const alt = imgBlockMatch[1]
      const rawSrc = imgBlockMatch[2]
      const resolvedSrc = resolveAssetUrl(rawSrc, docPath)

      elements.push(
        <figure key={`fig-${idx++}`} className="my-6">
          <img
            src={resolvedSrc}
            alt={alt}
            className="w-full max-w-3xl mx-auto rounded-xl border border-zinc-200/80 shadow-xs dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
            loading="lazy"
          />
          {alt && (
            <figcaption className="mt-2.5 text-center text-xs text-zinc-500 dark:text-zinc-400">
              {alt}
            </figcaption>
          )}
        </figure>
      )
      continue
    }

    // 3. Table 처리
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true
      tableLines.push(trimmed)
      continue
    } else if (inTable) {
      flushTable()
    }

    // 4. Headings
    if (trimmed.startsWith('# ')) {
      const headingText = trimmed.slice(2).trim()
      const { primary, alias } = slugify(headingText)
      elements.push(
        <h1
          key={`h1-${idx++}`}
          id={primary}
          className="group relative scroll-mt-24 mt-8 mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl"
        >
          {alias && alias !== primary && (
            <span id={alias} className="absolute -top-24 block invisible pointer-events-none" aria-hidden="true" />
          )}
          {renderInline(headingText, docPath)}
          <a
            href={`#${primary}`}
            className="ml-2 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity font-normal text-lg"
            aria-label="링크 복사"
          >
            #
          </a>
        </h1>
      )
      continue
    }
    if (trimmed.startsWith('## ')) {
      const headingText = trimmed.slice(3).trim()
      const { primary, alias } = slugify(headingText)
      elements.push(
        <h2
          key={`h2-${idx++}`}
          id={primary}
          className="group relative scroll-mt-24 mt-8 mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 pb-1.5 dark:border-zinc-800"
        >
          {alias && alias !== primary && (
            <span id={alias} className="absolute -top-24 block invisible pointer-events-none" aria-hidden="true" />
          )}
          {renderInline(headingText, docPath)}
          <a
            href={`#${primary}`}
            className="ml-2 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity font-normal text-base"
            aria-label="링크 복사"
          >
            #
          </a>
        </h2>
      )
      continue
    }
    if (trimmed.startsWith('### ')) {
      const headingText = trimmed.slice(4).trim()
      const { primary, alias } = slugify(headingText)
      elements.push(
        <h3
          key={`h3-${idx++}`}
          id={primary}
          className="group relative scroll-mt-24 mt-6 mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100"
        >
          {alias && alias !== primary && (
            <span id={alias} className="absolute -top-24 block invisible pointer-events-none" aria-hidden="true" />
          )}
          {renderInline(headingText, docPath)}
          <a
            href={`#${primary}`}
            className="ml-2 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity font-normal text-sm"
            aria-label="링크 복사"
          >
            #
          </a>
        </h3>
      )
      continue
    }
    if (trimmed.startsWith('#### ')) {
      const headingText = trimmed.slice(5).trim()
      const { primary, alias } = slugify(headingText)
      elements.push(
        <h4
          key={`h4-${idx++}`}
          id={primary}
          className="group relative scroll-mt-24 mt-4 mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-200"
        >
          {alias && alias !== primary && (
            <span id={alias} className="absolute -top-24 block invisible pointer-events-none" aria-hidden="true" />
          )}
          {renderInline(headingText, docPath)}
          <a
            href={`#${primary}`}
            className="ml-2 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity font-normal text-xs"
            aria-label="링크 복사"
          >
            #
          </a>
        </h4>
      )
      continue
    }

    // 5. Blockquotes & Alerts (> [!NOTE], etc.)
    if (trimmed.startsWith('>')) {
      const bqContent = trimmed.replace(/^>\s?/, '')

      // Alert 체크
      if (bqContent.startsWith('[!NOTE]') || bqContent.startsWith('[!TIP]')) {
        const text = bqContent.replace(/^\[!(NOTE|TIP)\]\s?/, '')
        elements.push(
          <div
            key={`alert-note-${idx++}`}
            className="my-4 flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50/60 p-3.5 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200"
          >
            <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <div className="leading-relaxed">{renderInline(text, docPath)}</div>
          </div>
        )
        continue
      }
      if (bqContent.startsWith('[!IMPORTANT]') || bqContent.startsWith('[!WARNING]')) {
        const text = bqContent.replace(/^\[!(IMPORTANT|WARNING)\]\s?/, '')
        elements.push(
          <div
            key={`alert-warn-${idx++}`}
            className="my-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/60 p-3.5 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="leading-relaxed">{renderInline(text, docPath)}</div>
          </div>
        )
        continue
      }
      if (bqContent.startsWith('[!CAUTION]')) {
        const text = bqContent.replace(/^\[!CAUTION\]\s?/, '')
        elements.push(
          <div
            key={`alert-caution-${idx++}`}
            className="my-4 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/60 p-3.5 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div className="leading-relaxed">{renderInline(text, docPath)}</div>
          </div>
        )
        continue
      }

      // 일반 인용문
      elements.push(
        <blockquote
          key={`bq-${idx++}`}
          className="my-4 border-l-4 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
        >
          {renderInline(bqContent, docPath)}
        </blockquote>
      )
      continue
    }

    // 6. Unordered List Items (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const listContent = trimmed.slice(2).trim()

      // 상위 메뉴 / 상위 목차 / 전체 목차 불필요한 메타 링크는 화면에서 자동 제외
      if (
        listContent.startsWith('상위 메뉴:') ||
        listContent.startsWith('상위 목차:') ||
        listContent.startsWith('전체 목차:')
      ) {
        continue
      }

      // 공식 문서 원문 링크는 전용 깔끔한 배지/링크로 렌더링
      const officialDocMatch = listContent.match(/^공식\s*문서:\s*\[([^\]]+)\]\(([^)]+)\)/)
      if (officialDocMatch) {
        elements.push(
          <div key={`official-doc-${idx++}`} className="my-2.5 flex items-center gap-2">
            <a
              href={officialDocMatch[2]}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200/80 bg-zinc-50/80 px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-xs hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-zinc-700 transition"
            >
              <span>Next.js 공식 문서 원문 보기</span>
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </a>
          </div>
        )
        continue
      }

      elements.push(
        <li
          key={`li-${idx++}`}
          className="ml-6 list-disc text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
        >
          {renderInline(listContent, docPath)}
        </li>
      )
      continue
    }

    // 7. Ordered List Items (1. )
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/)
    if (olMatch) {
      elements.push(
        <li
          key={`ol-${idx++}`}
          className="ml-6 list-decimal text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
        >
          {renderInline(olMatch[2], docPath)}
        </li>
      )
      continue
    }

    // 8. Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(
        <hr
          key={`hr-${idx++}`}
          className="my-6 border-zinc-200 dark:border-zinc-800"
        />
      )
      continue
    }

    // 9. Blank line
    if (!trimmed) {
      continue
    }

    // 10. Normal Paragraph
    elements.push(
      <p
        key={`p-${idx++}`}
        className="my-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
      >
        {renderInline(line, docPath)}
      </p>
    )
  }

  if (inTable) {
    flushTable()
  }

  return (
    <article className={`space-y-1 font-sans ${className}`}>
      {elements}

      {/* 문서 하단 관련 데모 카드 목록 */}
      {showDemoList && relatedDemos.length > 0 && (
        <DocDemoList demos={relatedDemos} />
      )}
    </article>
  )
}
