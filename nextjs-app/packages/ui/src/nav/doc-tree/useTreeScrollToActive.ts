'use client'

import { useEffect, useRef, type RefObject } from 'react'

export interface UseTreeScrollToActiveOptions {
  /** 활성 항목을 찾기 위한 CSS 셀렉터 (기본값: '[data-active="true"]') */
  selector?: string
  /** 부드러운 스크롤 여부 (기본값: 'smooth') */
  behavior?: ScrollBehavior
  /** 상단 안전 여백 비율 (0~1, 기본값: 0.2 -> 상단 20%) */
  topThresholdRatio?: number
  /** 하단 안전 여백 비율 (0~1, 기본값: 0.75 -> 하단 75%) */
  bottomThresholdRatio?: number
}

/**
 * 페이지 이동 시 좌측 트리 메뉴의 활성 항목을 감지하여,
 * 화면 상/하단 가장자리에 치우쳐 있거나 보이지 않을 때 중앙 부근으로 자동 스크롤하는 훅입니다.
 */
export function useTreeScrollToActive(
  containerRef: RefObject<HTMLElement | null>,
  dependencies: unknown[] = [],
  options: UseTreeScrollToActiveOptions = {},
) {
  const {
    selector = '[data-active="true"]',
    behavior = 'smooth',
    topThresholdRatio = 0.2,
    bottomThresholdRatio = 0.75,
  } = options

  const isInitialMount = useRef(true)

  useEffect(() => {
    const scrollToActive = (scrollBehavior: ScrollBehavior = behavior) => {
      const container = containerRef.current
      if (!container) return

      const activeEl = container.querySelector(selector) as HTMLElement | null
      if (!activeEl) return

      const containerRect = container.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()

      // 컨테이너 내 안전 가시 영역 (상단 20% ~ 하단 75% 사이)
      const safeTop = containerRect.top + containerRect.height * topThresholdRatio
      const safeBottom = containerRect.top + containerRect.height * bottomThresholdRatio

      // 활성 요소가 너무 위나 너무 아래에 있거나 컨테이너 바깥에 위치한 경우
      const isComfortablyVisible =
        activeRect.top >= safeTop && activeRect.bottom <= safeBottom

      if (!isComfortablyVisible) {
        const relativeTop = activeRect.top - containerRect.top + container.scrollTop
        const targetScrollTop = relativeTop - container.clientHeight / 2 + activeRect.height / 2

        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: scrollBehavior,
        })
      }
    }

    // 초기 마운트 시에는 즉시 스크롤, 이후 페이지 이동 시에는 부드럽게 스크롤
    const currentBehavior = isInitialMount.current ? 'auto' : behavior
    isInitialMount.current = false

    // 아코디언 애니메이션 및 렌더링 완료 타이밍을 고려한 단계별 스크롤 시도
    const rafId = requestAnimationFrame(() => {
      scrollToActive(currentBehavior)
    })
    const timer1 = setTimeout(() => scrollToActive(currentBehavior), 100)
    const timer2 = setTimeout(() => scrollToActive(currentBehavior), 250)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps
}
