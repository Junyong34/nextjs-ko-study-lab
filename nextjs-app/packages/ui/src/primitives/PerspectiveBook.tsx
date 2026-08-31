import React from 'react'
import { cn } from '../cn'
import { BOOK_TONES } from '../styles'

export type BookTone = keyof typeof BOOK_TONES
export type BookTrigger = 'self' | 'group'

export interface PerspectiveBookProps {
  children: React.ReactNode
  className?: string
  tone?: BookTone
  width?: string
  depth?: string
  pages?: boolean
  trigger?: BookTrigger
  illustration?: React.ReactNode
  texture?: boolean
}

const SELF_TRIGGER =
  'transition-transform duration-300 hover:[transform:rotateY(-8deg)_rotateX(3deg)] focus-visible:[transform:rotateY(-8deg)_rotateX(3deg)] motion-reduce:transition-none'
const GROUP_TRIGGER =
  'transition-transform duration-300 group-hover:[transform:rotateY(-8deg)_rotateX(3deg)] group-focus-visible:[transform:rotateY(-8deg)_rotateX(3deg)] motion-reduce:transition-none'

/** Link, article, li 같은 기존 wrapper에 책 표면 상호작용만 붙일 때 사용한다. */
export function bookSurfaceClass({
  tone = 'sky',
  trigger = 'self',
  pages = true,
  className = '',
}: Pick<PerspectiveBookProps, 'tone' | 'trigger' | 'pages' | 'className'> = {}): string {
  return cn(
    'relative block [perspective:900px]',
    BOOK_TONES[tone].cover,
    pages && 'rounded-r-lg',
    trigger === 'group' ? GROUP_TRIGGER : SELF_TRIGGER,
    className,
  )
}

/** 앞·뒤 표지와 페이지 측면을 가진 장식용 3D 책 표면. */
export function PerspectiveBook({
  children,
  className = '',
  tone = 'sky',
  width = '12rem',
  depth = '1rem',
  pages = true,
  trigger = 'self',
  illustration,
  texture = true,
}: PerspectiveBookProps) {
  const colors = BOOK_TONES[tone]
  const style = { '--book-w': width, '--book-d': depth } as React.CSSProperties

  return (
    <div className={bookSurfaceClass({ tone, trigger, pages, className })} style={style}>
      <div className="relative w-[var(--book-w)] aspect-[49/60] [transform-style:preserve-3d]">
        <div
          className={cn(
            'absolute inset-0 overflow-hidden rounded-r-lg border shadow-lg [backface-visibility:hidden] [transform:translateZ(calc(var(--book-d)_/_2))]',
            colors.cover,
          )}
        >
          <span aria-hidden className={cn('absolute inset-y-0 left-0 w-1', colors.accent)} />
          {texture ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.22),transparent)]"
            />
          ) : null}
          {illustration ? <span aria-hidden className="absolute right-3 top-3">{illustration}</span> : null}
          <div className="relative h-full">{children}</div>
        </div>
        {pages ? (
          <span
            aria-hidden
            className="absolute left-0 top-1/2 h-[calc(100%-0.75rem)] w-[var(--book-d)] -translate-y-1/2 -translate-x-1/2 rounded-sm border-y border-zinc-300 bg-zinc-50 [transform:rotateY(90deg)] dark:border-zinc-700 dark:bg-zinc-800"
          />
        ) : null}
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 rounded-r-lg border [backface-visibility:hidden] [transform:translateZ(calc(var(--book-d)_/_-2))_rotateY(180deg)]',
            colors.cover,
          )}
        />
      </div>
    </div>
  )
}
