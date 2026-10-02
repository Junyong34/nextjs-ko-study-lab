'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { relativePath } from '../lib/products'

export interface NavigationState {
  pathname: string
  softNavigations: number
  /** 문서 요청(navigation 타입 Performance 항목) 개수. 문서를 다시 받으면 이 레이아웃도 새로 시작한다 */
  documentEntries: number
  timeOriginSame: boolean
  /** 탐색 전에 올려 둔 레이아웃 상태 값 */
  cartCount: number
}

/** usePathname 변화로 클라이언트 탐색을 세고, 그동안 같은 문서에 머물렀는지 Performance API로 확인한다. */
export function useNavigationState() {
  const pathname = usePathname()
  const prev = useRef<string | null>(null)
  const timeOrigin = useRef<number | null>(null)
  const [softNavigations, setSoftNavigations] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [doc, setDoc] = useState({ documentEntries: 0, timeOriginSame: true })

  useEffect(() => {
    timeOrigin.current ??= performance.timeOrigin
    if (prev.current !== null && prev.current !== pathname) setSoftNavigations((n) => n + 1)
    prev.current = pathname
    setDoc({
      documentEntries: performance.getEntriesByType('navigation').length,
      timeOriginSame: performance.timeOrigin === timeOrigin.current,
    })
  }, [pathname])

  const reset = useCallback(() => {
    setSoftNavigations(0)
    setCartCount(0)
  }, [])

  const state: NavigationState = { pathname: relativePath(pathname), softNavigations, cartCount, ...doc }
  return { state, addToCart: () => setCartCount((n) => n + 1), reset }
}
