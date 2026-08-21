import React from 'react'
import { resolveAssetUrl } from '../resolve/asset-url'
import { resolveDocLink } from '../resolve/doc-link'

/**
 * 한 줄 안의 인라인 마크다운을 React 노드로 바꿉니다.
 * 이미지 · 인라인 코드 · 링크 · 굵게 · 기울임을 앞에서부터 하나씩 떼어 먹습니다.
 */
export function renderInline(text: string, docPath?: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let remaining = text
  let keyIdx = 0

  while (remaining.length > 0) {
    // 1. 이미지: ![alt](url)
    const imgMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
    if (imgMatch) {
      const alt = imgMatch[1]
      const resolvedSrc = resolveAssetUrl(imgMatch[2], docPath)
      parts.push(
        <img
          key={`inline-img-${keyIdx++}`}
          src={resolvedSrc}
          alt={alt}
          className="inline-block my-2 max-h-96 rounded-lg border border-zinc-200 shadow-xs dark:border-zinc-800"
          loading="lazy"
        />,
      )
      remaining = remaining.slice(imgMatch[0].length)
      continue
    }

    // 2. 인라인 코드: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/)
    if (codeMatch) {
      parts.push(
        <code
          key={`c-${keyIdx++}`}
          className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 font-semibold"
        >
          {codeMatch[1]}
        </code>,
      )
      remaining = remaining.slice(codeMatch[0].length)
      continue
    }

    // 3. 링크: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch) {
      const resolvedHref = resolveDocLink(linkMatch[2], docPath)
      const isExternal =
        resolvedHref.startsWith('http://') || resolvedHref.startsWith('https://')

      parts.push(
        <a
          key={`l-${keyIdx++}`}
          href={resolvedHref}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
          className="text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:text-zinc-600 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:text-zinc-300 font-medium"
        >
          {linkMatch[1]}
        </a>,
      )
      remaining = remaining.slice(linkMatch[0].length)
      continue
    }

    // 4. 굵게: **bold**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/)
    if (boldMatch) {
      parts.push(
        <strong key={`b-${keyIdx++}`} className="font-semibold text-zinc-900 dark:text-zinc-100">
          {boldMatch[1]}
        </strong>,
      )
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    // 5. 기울임: *italic* 또는 _italic_
    const italicMatch = remaining.match(/^(\*|_)([^*_]+)\1/)
    if (italicMatch) {
      parts.push(
        <em key={`i-${keyIdx++}`} className="italic">
          {italicMatch[2]}
        </em>,
      )
      remaining = remaining.slice(italicMatch[0].length)
      continue
    }

    // 다음 특수문자까지는 평문
    const nextSpecial = remaining.search(/[!`[*_]/)
    if (nextSpecial === -1) {
      parts.push(remaining)
      break
    } else if (nextSpecial === 0) {
      // 어느 규칙에도 안 걸린 특수문자 하나는 그대로 흘려보낸다
      parts.push(remaining[0])
      remaining = remaining.slice(1)
    } else {
      parts.push(remaining.slice(0, nextSpecial))
      remaining = remaining.slice(nextSpecial)
    }
  }

  return parts
}
