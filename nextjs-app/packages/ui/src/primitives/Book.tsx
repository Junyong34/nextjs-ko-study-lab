import React from 'react'
import { cn } from '../cn'

interface StackProps extends React.ComponentProps<'div'> {
  children: React.ReactNode
  direction?: 'column' | 'row'
  align?: 'stretch' | 'start' | 'end' | 'center'
  grow?: boolean
  className?: string
}

/** Book 내부에서만 쓰는 비공개 flex 레이아웃 헬퍼입니다. */
function Stack(props: StackProps) {
  const { children, grow = false, align = 'start', direction = 'column', className, ...etc } = props
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems: align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align,
        flexGrow: grow ? 1 : 0,
      }}
      {...etc}
    >
      {children}
    </div>
  )
}

const DEFAULT_COVER = 'bg-zinc-900 dark:bg-zinc-100'

export interface BookProps {
  children: React.ReactNode
  /** 표지·책등 배경 Tailwind 클래스 (라이트/다크 모드 포함). 기본값은 디자인 시스템의 Primary 표면입니다. */
  coverClassName?: string
  /** 책등 두께(px). cqw가 아닌 px 값으로 취급합니다 (컨테이너 쿼리 조상이 없어도 항상 렌더됩니다). */
  depth?: number
  width?: number
}

/**
 * 마우스오버 시 3D로 살짝 펼쳐지는 책 표지 카드입니다.
 * 인터랙션은 순수 CSS(group-hover)라 서버 컴포넌트로도 동작합니다.
 */
export function Book({ children, coverClassName = DEFAULT_COVER, depth, width }: BookProps) {
  return (
    <div
      className="w-fit [perspective:900px] inline-block group"
      style={
        {
          '--book-depth': (depth || 4) + 'px',
          '--book-width': (width || 196) + 'px',
        } as React.CSSProperties
      }
    >
      <div className="contain-inline-size aspect-[49/60] w-fit relative [transform-style:preserve-3d] min-w-[calc(var(--book-width))] transition-transform duration-500 ease-out group-hover:[transform:rotateY(-20deg)_scale(1.066)translateX(-8px)] group-active:[transform:rotateY(-20deg)_scale(1.066)translateX(-8px)]">
        <Stack
          align="stretch"
          className={cn(
            'rounded-l rounded-r border border-zinc-200 dark:border-zinc-800 shadow-book size-full absolute overflow-hidden',
            coverClassName,
          )}
        >
          <Stack grow align="stretch" direction="row" className="h-full relative overflow-hidden">
            <div className="absolute inset-y-0 mix-blend-overlay opacity-100 min-w-[8.2%] bg-book-bind-bg" />
            <div className="contain-inline-size w-full">{children}</div>
          </Stack>
        </Stack>
        <div
          aria-hidden={true}
          className="absolute bg-book-pages w-[calc(var(--book-depth)-2px)] h-[calc(100%-2*6px)] top-[3px]"
          style={{
            transform:
              'translateX(calc(var(--book-width) - var(--book-depth) / 2 - 3px)) rotateY(90deg) translateX(calc(var(--book-depth) / 2))',
          }}
        />
        <div
          aria-hidden={true}
          className={cn('rounded-l-md rounded-r absolute left-0 w-full h-full', coverClassName)}
          style={{ transform: 'translateZ(calc(-1 * var(--book-depth)))' }}
        />
      </div>
    </div>
  )
}
