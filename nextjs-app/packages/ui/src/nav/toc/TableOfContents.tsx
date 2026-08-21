'use client'

import React, { useMemo } from 'react'
import { SCROLLSPY_CONFIG, type HeadingItem } from './config'
import { useScrollSpy } from './useScrollSpy'
import { TocList } from './TocList'
import { GlossaryIndex } from './GlossaryIndex'
import { MobileAlphabetBar } from './MobileAlphabetBar'

export interface TableOfContentsProps {
  /** 파싱된 헤딩 목록. 마크다운 파싱은 `@study/docs-render`가 한다 */
  headings: HeadingItem[]
  /** 용어집 문서 여부. `isGlossaryDoc()`이 판정한 결과 */
  isGlossary?: boolean
  className?: string
  /** 스크롤 감지 기준 오프셋 */
  offset?: number
}

/**
 * 우측 목차 패널. 용어집이면 A~Z 색인 맵을, 아니면 일반 목차를 그립니다.
 *
 * 스크롤 추적은 `useScrollSpy`가, 두 화면은 각각 `GlossaryIndex`·`TocList`가 맡습니다.
 */
export function TableOfContents({
  headings,
  isGlossary = false,
  className = '',
  offset = SCROLLSPY_CONFIG.HEADER_OFFSET,
}: TableOfContentsProps) {
  const { activeId, activeLetter, scrollToId, scrollToTop } = useScrollSpy(headings, offset)

  const availableLetters = useMemo(() => {
    const set = new Set<string>()
    headings.forEach((h) => {
      if (h.isLetter && h.letter) set.add(h.letter)
    })
    return set
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <>
      {isGlossary && (
        <MobileAlphabetBar
          available={availableLetters}
          activeLetter={activeLetter}
          onJump={scrollToId}
        />
      )}

      <aside
        className={`
          hidden xl:block w-64 shrink-0
          sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto
          rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-xs backdrop-blur-md
          dark:border-zinc-800 dark:bg-zinc-900/70 [scrollbar-width:thin]
          ${className}
        `}
        aria-label="문서 색인 내비게이션"
      >
        {isGlossary ? (
          <GlossaryIndex
            headings={headings}
            available={availableLetters}
            activeId={activeId}
            activeLetter={activeLetter}
            onJump={scrollToId}
            onTop={scrollToTop}
          />
        ) : (
          <TocList
            headings={headings}
            activeId={activeId}
            onJump={scrollToId}
            onTop={scrollToTop}
          />
        )}
      </aside>
    </>
  )
}
