'use client'
import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { parseFilters } from '../filters'

/**
 * useSearchParams()로 현재 URL 쿼리를 읽어 파싱하고,
 * router.push()로 새 쿼리를 반영하는 공통 로직.
 * FilterParsingDemo(실습 화면)와 VerificationFooter(검증)가 각자 이 훅을 호출해
 * 동일한 실제 URL을 독립적으로 관찰한다.
 */
export function useParsedFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { filters, hasInvalidRaw } = parseFilters(searchParams)

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      const query = params.toString()
      router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const reset = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [pathname, router])

  return {
    filters,
    hasInvalidRaw,
    rawQueryString: searchParams.toString(),
    updateParam,
    reset,
  }
}
