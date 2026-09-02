'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
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
  const [memo, setMemo] = useState('장바구니 담을 상품 검토 중 (Soft Nav 메모)')
  const [seconds, setSeconds] = useState(0)
  const [navCount, setNavCount] = useState(0)
  const [lastNavType, setLastNavType] = useState<NavType>('initial')
  const [scrollY, setScrollY] = useState(0)
  const [mountedAt, setMountedAt] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    setMountedAt(new Date().toLocaleTimeString('ko-KR'))
    const timer = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)

    const updateScroll = () => {
      const container = document.getElementById('product-scroll-container')
      const containerTop = container ? Math.round(container.scrollTop) : 0
      const winTop = Math.round(window.scrollY)
      setScrollY(containerTop > 0 ? containerTop : winTop)
    }

    const container = document.getElementById('product-scroll-container')
    container?.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('scroll', updateScroll, { passive: true })
    const pollTimer = setInterval(updateScroll, 250)

    return () => {
      clearInterval(timer)
      clearInterval(pollTimer)
      container?.removeEventListener('scroll', updateScroll)
      window.removeEventListener('scroll', updateScroll)
    }
  }, [])

  // 경로 변경 감지 시 소프트 네비게이션 카운트 증가
  useEffect(() => {
    setNavCount((prev) => prev + 1)
  }, [pathname])

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
