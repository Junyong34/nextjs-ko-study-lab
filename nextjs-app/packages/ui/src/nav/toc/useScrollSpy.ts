'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SCROLLSPY_CONFIG, type HeadingItem } from './config'

export interface ScrollSpy {
  activeId: string
  activeLetter: string
  scrollToId: (id: string) => void
  scrollToTop: () => void
}

/**
 * 스크롤 위치로 현재 헤딩을 추적하고, 목차 클릭 시 부드럽게 이동시킵니다.
 *
 * `TableOfContents` 안에 150줄 가까이 섞여 있던 로직입니다. 화면과 분리해 두면
 * 스크롤 규칙(맨 위·맨 아래 처리, 클릭 잠금)을 따로 읽고 고칠 수 있습니다.
 */
export function useScrollSpy(
  headings: HeadingItem[],
  offset: number = SCROLLSPY_CONFIG.HEADER_OFFSET,
): ScrollSpy {
  const [activeId, setActiveId] = useState<string>('')
  const [activeLetter, setActiveLetter] = useState<string>('')

  // 클릭으로 이동하는 동안은 중간 헤딩이 활성 표시를 덮어쓰지 않도록 잠근다
  const isClickScrollingRef = useRef<boolean>(false)
  const clickLockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const lockDuringClickScroll = useCallback(() => {
    isClickScrollingRef.current = true
    if (clickLockTimeoutRef.current) {
      clearTimeout(clickLockTimeoutRef.current)
    }
    clickLockTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false
    }, SCROLLSPY_CONFIG.CLICK_LOCK_DURATION)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrollingRef.current) return

      const scrollY = window.scrollY
      const headingElements: { id: string; top: number; letter?: string }[] = []

      for (const h of headings) {
        const el =
          document.getElementById(h.id) || (h.alias ? document.getElementById(h.alias) : null)
        if (el) {
          const rect = el.getBoundingClientRect()
          headingElements.push({ id: h.id, top: rect.top + scrollY, letter: h.letter })
        }
      }

      if (headingElements.length === 0) return

      // 1. 맨 위
      if (scrollY < SCROLLSPY_CONFIG.TOP_THRESHOLD) {
        setActiveId(headingElements[0].id)
        setActiveLetter(headingElements[0].letter ?? '')
        return
      }

      // 2. 맨 아래 — 마지막 헤딩에 고정한다. 안 그러면 바닥 근처 항목이 영영 활성화되지 않는다
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight || document.documentElement.clientHeight
      const isAtBottom =
        scrollY + clientHeight >= scrollHeight - SCROLLSPY_CONFIG.BOTTOM_THRESHOLD

      if (isAtBottom) {
        const lastHeading = headingElements[headingElements.length - 1]
        setActiveId(lastHeading.id)

        const lastLetterHeading = [...headingElements].reverse().find((h) => h.letter)
        if (lastLetterHeading?.letter) {
          setActiveLetter(lastLetterHeading.letter)
        }
        return
      }

      // 3. 일반 위치 — 기준선을 넘어선 마지막 헤딩
      const currentPos = scrollY + offset
      let currentActiveId = headingElements[0].id
      let currentLetter = headingElements[0].letter || ''

      for (const el of headingElements) {
        if (el.top <= currentPos) {
          currentActiveId = el.id
          if (el.letter) currentLetter = el.letter
        } else {
          break
        }
      }

      setActiveId(currentActiveId)
      if (currentLetter) setActiveLetter(currentLetter)
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
      if (!el) return

      setActiveId(id)
      const matched = headings.find((h) => h.id === id || h.alias === id)
      if (matched?.letter) {
        setActiveLetter(matched.letter)
      }

      lockDuringClickScroll()

      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (history.pushState) {
        history.pushState(null, '', `#${id}`)
      }
    },
    [headings, lockDuringClickScroll],
  )

  const scrollToTop = useCallback(() => {
    lockDuringClickScroll()

    if (headings.length > 0) {
      setActiveId(headings[0].id)
      setActiveLetter(headings[0].letter ?? '')
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (history.pushState) {
      history.pushState(null, '', window.location.pathname)
    }
  }, [headings, lockDuringClickScroll])

  return { activeId, activeLetter, scrollToId, scrollToTop }
}
