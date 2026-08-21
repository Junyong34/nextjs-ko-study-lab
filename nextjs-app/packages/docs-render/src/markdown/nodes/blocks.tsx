import React from 'react'
import { ExternalLink } from 'lucide-react'

/** 일반 인용문. `[!NOTE]` 같은 표기가 붙으면 Alert가 대신 그린다. */
export function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-4 border-l-4 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
      {children}
    </blockquote>
  )
}

/** 목록 항목. 순서 있는 목록과 없는 목록은 마커만 다르다. */
export function ListItem({
  ordered = false,
  children,
}: {
  ordered?: boolean
  children: React.ReactNode
}) {
  return (
    <li
      className={`ml-6 ${ordered ? 'list-decimal' : 'list-disc'} text-sm leading-relaxed text-zinc-700 dark:text-zinc-300`}
    >
      {children}
    </li>
  )
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="my-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</p>
  )
}

export function HorizontalRule() {
  return <hr className="my-6 border-zinc-200 dark:border-zinc-800" />
}

/**
 * `- 공식 문서: [제목](url)` 줄을 배지 링크로 바꿉니다.
 * 목록 항목으로 그냥 두면 본문 흐름에 묻힙니다.
 */
export function OfficialDocLink({ href }: { href: string }) {
  return (
    <div className="my-2.5 flex items-center gap-2">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200/80 bg-zinc-50/80 px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-xs hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-zinc-700 transition"
      >
        <span>Next.js 공식 문서 원문 보기</span>
        <ExternalLink className="h-3 w-3 text-zinc-400" />
      </a>
    </div>
  )
}
