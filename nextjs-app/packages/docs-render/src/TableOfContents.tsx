'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { slugify } from './MarkdownRenderer'
import { MapPin, ListTree, ArrowUp } from 'lucide-react'

export interface HeadingItem {
  id: string
  alias?: string
  text: string
  level: number
  isLetter?: boolean
  letter?: string
}

/**
 * ScrollSpy 위치 계산에 사용되는 설정 상수
 */
export const SCROLLSPY_CONFIG = {
  /** 페이지 최상단 감지 임계값 (px) */
  TOP_THRESHOLD: 50,
  /** 페이지 최하단(바닥) 감지 오차 임계값 (px) */
  BOTTOM_THRESHOLD: 60,
  /** scroll-mt-24 (96px)와 동기화된 상단 기준선 오프셋 (px) */
  HEADER_OFFSET: 100,
  /** 맵 클릭 시 스크롤 이동 중 감지 잠금 시간 (ms) */
  CLICK_LOCK_DURATION: 600,
} as const

export interface TableOfContentsProps {
  /** 마크다운 원문 텍스트 */
  content: string
  /** 현재 문서 경로 (예: '4-glossary/README.md') */
  docPath?: string
  className?: string
  /** 스크롤 감지 기준 오프셋 (기본값: SCROLLSPY_CONFIG.HEADER_OFFSET = 100) */
  offset?: number
}

const ALL_ALPHABETS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
]

/**
 * 마크다운 텍스트에서 헤딩 항목들을 파싱합니다.
 */
function parseHeadings(content: string): HeadingItem[] {
  const lines = content.split('\n')
  const headings: HeadingItem[] = []
  let inCodeBlock = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    let level = 0
    let text = ''

    if (trimmed.startsWith('#### ')) {
      level = 4
      text = trimmed.slice(5).trim()
    } else if (trimmed.startsWith('### ')) {
      level = 3
      text = trimmed.slice(4).trim()
    } else if (trimmed.startsWith('## ')) {
      level = 2
      text = trimmed.slice(3).trim()
    }

    if (level > 0 && text) {
      const { primary, alias } = slugify(text)
      const cleanText = text
        .replace(/<[^>]*>/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .trim()

      const isSingleLetter = level === 3 && /^[A-Z]$/i.test(cleanText)

      headings.push({
        id: primary,
        alias,
        text: cleanText,
        level,
        isLetter: isSingleLetter,
        letter: isSingleLetter ? cleanText.toUpperCase() : undefined,
      })
    }
  }

  return headings
}

export function TableOfContents({
  content,
  docPath,
  className = '',
  offset = SCROLLSPY_CONFIG.HEADER_OFFSET,
}: TableOfContentsProps) {
  const headings = useMemo(() => parseHeadings(content), [content])
  const isGlossary = useMemo(() => {
    return Boolean(
      (docPath && docPath.includes('glossary')) ||
      headings.some((h) => h.isLetter) ||
      content.includes('용어집 (Glossary)')
    )
  }, [docPath, headings, content])

  // 용어집에 존재하는 알파벳 목록 추출
  const availableLetters = useMemo(() => {
    const set = new Set<string>()
    headings.forEach((h) => {
      if (h.isLetter && h.letter) {
        set.add(h.letter)
      }
    })
    return set
  }, [headings])

  // 용어 개수 계산 (level 4 항목 수)
  const termCount = useMemo(() => {
    return headings.filter((h) => h.level === 4).length
  }, [headings])

  // 주요 섹션 (level 2 헤딩)
  const majorSections = useMemo(() => {
    return headings.filter((h) => h.level === 2 && !h.isLetter)
  }, [headings])

  const [activeId, setActiveId] = useState<string>('')
  const [activeLetter, setActiveLetter] = useState<string>('')

  // 클릭으로 스크롤 중일 때 ScrollSpy 감지를 일시 잠금하는 Ref
  const isClickScrollingRef = React.useRef<boolean>(false)
  const clickLockTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // ScrollSpy: 스크롤 위치에 따라 활성화된 헤딩 및 알파벳 추적
  useEffect(() => {
    const handleScroll = () => {
      // 사용자가 맵 버튼을 클릭해 부드럽게 이동 중인 동안은 중간 단계 헤딩 덮어쓰기 방지
      if (isClickScrollingRef.current) return

      const scrollY = window.scrollY
      const headingElements: { id: string; top: number; letter?: string }[] = []

      for (const h of headings) {
        const el = document.getElementById(h.id) || (h.alias ? document.getElementById(h.alias) : null)
        if (el) {
          const rect = el.getBoundingClientRect()
          const top = rect.top + scrollY
          headingElements.push({ id: h.id, top, letter: h.letter })
        }
      }

      if (headingElements.length === 0) return

      // 1. 페이지 맨 위 도달 처리
      if (scrollY < SCROLLSPY_CONFIG.TOP_THRESHOLD) {
        setActiveId(headingElements[0].id)
        if (headingElements[0].letter) {
          setActiveLetter(headingElements[0].letter)
        } else {
          setActiveLetter('')
        }
        return
      }

      // 2. 페이지 맨 아래(바닥) 도달 처리 (Bottom-of-Page Clamp)
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight || document.documentElement.clientHeight
      const isAtBottom = scrollY + clientHeight >= scrollHeight - SCROLLSPY_CONFIG.BOTTOM_THRESHOLD

      if (isAtBottom) {
        const lastHeading = headingElements[headingElements.length - 1]
        setActiveId(lastHeading.id)

        // 마지막으로 등장한 알파벳 섹션 찾기
        const lastLetterHeading = [...headingElements].reverse().find((h) => h.letter)
        if (lastLetterHeading && lastLetterHeading.letter) {
          setActiveLetter(lastLetterHeading.letter)
        }
        return
      }

      // 3. 일반 스크롤 위치 판별 (scroll-mt-24와 일치된 상단 기준선)
      const currentPos = scrollY + offset
      let currentActiveId = headingElements[0].id
      let currentLetter = headingElements[0].letter || ''

      for (let i = 0; i < headingElements.length; i++) {
        if (headingElements[i].top <= currentPos) {
          currentActiveId = headingElements[i].id
          if (headingElements[i].letter) {
            currentLetter = headingElements[i].letter!
          }
        } else {
          break
        }
      }

      setActiveId(currentActiveId)
      if (currentLetter) {
        setActiveLetter(currentLetter)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (clickLockTimeoutRef.current) {
        clearTimeout(clickLockTimeoutRef.current)
      }
    }
  }, [headings, offset])

  const scrollToId = useCallback(
    (id: string) => {
      const el = document.getElementById(id)
      if (el) {
        // 1. 클릭 즉시 활성 상태를 클릭한 ID로 잠금 설정
        setActiveId(id)
        const matched = headings.find((h) => h.id === id || h.alias === id)
        if (matched?.letter) {
          setActiveLetter(matched.letter)
        }

        // 2. 스크롤 완료될 때까지 ScrollSpy 덮어쓰기 방지 잠금
        isClickScrollingRef.current = true
        if (clickLockTimeoutRef.current) {
          clearTimeout(clickLockTimeoutRef.current)
        }
        clickLockTimeoutRef.current = setTimeout(() => {
          isClickScrollingRef.current = false
        }, SCROLLSPY_CONFIG.CLICK_LOCK_DURATION)

        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        if (history.pushState) {
          history.pushState(null, '', `#${id}`)
        }
      }
    },
    [headings]
  )

  const scrollToTop = useCallback(() => {
    isClickScrollingRef.current = true
    if (clickLockTimeoutRef.current) {
      clearTimeout(clickLockTimeoutRef.current)
    }
    clickLockTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false
    }, SCROLLSPY_CONFIG.CLICK_LOCK_DURATION)

    if (headings.length > 0) {
      setActiveId(headings[0].id)
      if (headings[0].letter) {
        setActiveLetter(headings[0].letter)
      } else {
        setActiveLetter('')
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (history.pushState) {
      history.pushState(null, '', window.location.pathname)
    }
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <>
      {/* Mobile/Tablet Horizontal Alphabet Quick Jump Bar (Sticky on mobile for Glossary) */}
      {isGlossary && (
        <div className="xl:hidden fixed bottom-5 left-4 right-20 z-40 flex items-center gap-1 overflow-x-auto rounded-full border border-zinc-200/90 bg-white/95 px-3 py-1.5 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 [scrollbar-width:none]">
          <span className="text-[10px] font-bold text-zinc-500 shrink-0 mr-0.5">색인:</span>
          {ALL_ALPHABETS.filter((l) => availableLetters.has(l)).map((letter) => {
            const isActive = activeLetter === letter
            return (
              <button
                key={letter}
                type="button"
                onClick={() => scrollToId(letter.toLowerCase())}
                className={`
                  flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-950 scale-110'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                  }
                `}
              >
                {letter}
              </button>
            )
          })}
        </div>
      )}

      {/* Desktop Sticky Index / TOC Panel */}
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
        // 1. 용어집 전용 Sticky 색인 맵
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200/70 pb-2.5 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <MapPin className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
              <span>용어 색인 맵 (A-Z)</span>
            </div>
            {termCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {termCount}개 용어
              </span>
            )}
          </div>

          {/* Alphabet Quick Jump Grid */}
          <div>
            <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              <span>알파벳 바로가기</span>
              {activeLetter && (
                <span className="font-mono text-[10px] font-bold text-zinc-900 dark:text-zinc-100">
                  현재: {activeLetter}
                </span>
              )}
            </div>
            <div className="grid grid-cols-6 gap-1">
              {ALL_ALPHABETS.map((letter) => {
                const hasEntry = availableLetters.has(letter)
                const isActive = activeLetter === letter
                const targetId = letter.toLowerCase()

                if (!hasEntry) {
                  return (
                    <span
                      key={letter}
                      className="flex h-7 items-center justify-center rounded-md text-[11px] font-medium text-zinc-300 dark:text-zinc-700 cursor-not-allowed select-none"
                    >
                      {letter}
                    </span>
                  )
                }

                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => scrollToId(targetId)}
                    title={`알파벳 ${letter} 섹션으로 이동`}
                    className={`
                      flex h-7 items-center justify-center rounded-md text-xs font-semibold transition-all cursor-pointer
                      ${
                        isActive
                          ? 'bg-zinc-900 text-white shadow-xs scale-105 dark:bg-zinc-100 dark:text-zinc-950 font-bold'
                          : 'bg-zinc-100/90 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-950 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white'
                      }
                    `}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Major Sections */}
          {majorSections.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-zinc-200/70 dark:border-zinc-800">
              <span className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                주요 항목
              </span>
              <ul className="space-y-1 text-xs">
                {majorSections.map((sec) => {
                  const isActive = activeId === sec.id
                  return (
                    <li key={sec.id}>
                      <button
                        type="button"
                        onClick={() => scrollToId(sec.id)}
                        className={`
                          w-full text-left truncate rounded-md px-2 py-1 transition-colors cursor-pointer
                          ${
                            isActive
                              ? 'bg-[#14161a0f] font-bold text-zinc-950 dark:bg-white/10 dark:text-zinc-50'
                              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
                          }
                        `}
                      >
                        {sec.text}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Quick Jump to Top */}
          <div className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50/80 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition cursor-pointer"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>맨 위로 이동</span>
            </button>
          </div>
        </div>
      ) : (
        // 2. 일반 문서용 Table of Contents (TOC)
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200/70 pb-2.5 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <ListTree className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
              <span>이 페이지의 목차</span>
            </div>
          </div>

          {/* Headings List */}
          <ul className="space-y-1 text-xs">
            {headings
              .filter((h) => h.level === 2 || h.level === 3)
              .map((h) => {
                const isActive = activeId === h.id
                return (
                  <li
                    key={h.id}
                    style={{ paddingLeft: h.level === 3 ? '12px' : '0px' }}
                  >
                    <button
                      type="button"
                      onClick={() => scrollToId(h.id)}
                      className={`
                        w-full text-left truncate rounded-md px-2 py-1 transition-colors cursor-pointer
                        ${
                          isActive
                            ? 'bg-[#14161a0f] font-bold text-zinc-950 dark:bg-white/10 dark:text-zinc-50'
                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
                        }
                      `}
                    >
                      {h.text}
                    </button>
                  </li>
                )
              })}
          </ul>

          {/* Quick Jump to Top */}
          <div className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50/80 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition cursor-pointer"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>맨 위로 이동</span>
            </button>
          </div>
        </div>
      )}
    </aside>
    </>
  )
}
