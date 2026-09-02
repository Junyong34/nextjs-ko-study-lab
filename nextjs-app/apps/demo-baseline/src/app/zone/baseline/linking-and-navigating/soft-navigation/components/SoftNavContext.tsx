'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export type NavType = 'soft-scroll-false' | 'soft-scroll-top' | 'hard' | 'initial'

interface SoftNavContextState {
  memo: string
  setMemo: (memo: string) => void
  seconds: number
  setSeconds: React.Dispatch<React.SetStateAction<number>>
  navCount: number
  lastNavType: NavType
  recordNav: (type: NavType) => void
  scrollY: number
  mountedAt: string
}

const SoftNavContext = createContext<SoftNavContextState | null>(null)

export function SoftNavProvider({ children }: { children: React.ReactNode }) {
  const [memo, setMemo] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [navCount, setNavCount] = useState(0)
  const [lastNavType, setLastNavType] = useState<NavType>('initial')
  const [scrollY, setScrollY] = useState(0)
  const [mountedAt, setMountedAt] = useState('')
  const pathname = usePathname()
  const savedScrollRef = useRef<number>(0)

  useEffect(() => {
    setMountedAt(new Date().toLocaleTimeString('ko-KR'))
    const timer = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)

    const updateScroll = () => {
      const container = document.getElementById('product-scroll-container')
      const containerTop = container ? Math.round(container.scrollTop) : 0
      const winTop = Math.round(window.scrollY)
      const currentY = containerTop > 0 ? containerTop : winTop
      setScrollY(currentY)
      if (currentY > 0) {
        savedScrollRef.current = currentY
      }
    }

    const container = document.getElementById('product-scroll-container')
    container?.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('scroll', updateScroll, { passive: true })
    const pollTimer = setInterval(updateScroll, 200)

    return () => {
      clearInterval(timer)
      clearInterval(pollTimer)
      container?.removeEventListener('scroll', updateScroll)
      window.removeEventListener('scroll', updateScroll)
    }
  }, [])

  // 경로 변경 감지 시 소프트 네비게이션 처리
  useEffect(() => {
    setNavCount((prev) => prev + 1)

    const container = document.getElementById('product-scroll-container')
    if (!container) return

    if (lastNavType === 'soft-scroll-top' || pathname.endsWith('/new')) {
      // 기본 Link: 상단으로 스크롤 이동
      container.scrollTo({ top: 0, behavior: 'smooth' })
      setScrollY(0)
    } else if (lastNavType === 'soft-scroll-false') {
      // scroll={false}: 기존 스크롤 위치 유지
      if (savedScrollRef.current > 0) {
        container.scrollTop = savedScrollRef.current
        setScrollY(savedScrollRef.current)
      }
    }
  }, [pathname, lastNavType])

  const recordNav = (type: NavType) => {
    setLastNavType(type)
  }

  return (
    <SoftNavContext.Provider
      value={{
        memo,
        setMemo,
        seconds,
        setSeconds,
        navCount,
        lastNavType,
        recordNav,
        scrollY,
        mountedAt,
      }}
    >
      {children}
    </SoftNavContext.Provider>
  )
}

export function useSoftNav() {
  const context = useContext(SoftNavContext)
  return context
}
