import React from 'react'

export type HeadingLevel = 1 | 2 | 3 | 4

/**
 * 레벨별 클래스. 원본에서 h1~h4가 네 벌로 복붙돼 있던 것을 표로 접었습니다.
 * 값은 원본 그대로입니다 — 통일하면 화면이 바뀝니다.
 */
const HEADING_STYLE: Record<HeadingLevel, { heading: string; anchor: string }> = {
  1: {
    heading:
      'group relative scroll-mt-24 mt-8 mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl',
    anchor: 'text-lg',
  },
  2: {
    heading:
      'group relative scroll-mt-24 mt-8 mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 pb-1.5 dark:border-zinc-800',
    anchor: 'text-base',
  },
  3: {
    heading:
      'group relative scroll-mt-24 mt-6 mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100',
    anchor: 'text-sm',
  },
  4: {
    heading:
      'group relative scroll-mt-24 mt-4 mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-200',
    anchor: 'text-xs',
  },
}

export interface HeadingProps {
  level: HeadingLevel
  /** 앵커 id */
  id: string
  /** 괄호 안 영문에서 만든 보조 id. 예전 링크를 살려두기 위한 숨은 앵커 */
  alias?: string
  children: React.ReactNode
}

export function Heading({ level, id, alias, children }: HeadingProps) {
  const style = HEADING_STYLE[level]
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4'

  return (
    <Tag id={id} className={style.heading}>
      {alias && alias !== id && (
        <span
          id={alias}
          className="absolute -top-24 block invisible pointer-events-none"
          aria-hidden="true"
        />
      )}
      {children}
      <a
        href={`#${id}`}
        className={`ml-2 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-zinc-600 dark:hover:text-zinc-200 transition-opacity font-normal ${style.anchor}`}
        aria-label="링크 복사"
      >
        #
      </a>
    </Tag>
  )
}
