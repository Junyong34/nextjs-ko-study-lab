'use client'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel } from '@study/demo-kit'

export function StatusCodeVerifier() {
  const pathname = usePathname()
  const [status, setStatus] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    setStatus(null)

    fetch(pathname, { cache: 'no-store' })
      .then((res) => {
        if (!cancelled) setStatus(res.status)
      })
      .catch(() => {
        if (!cancelled) setStatus(null)
      })

    return () => {
      cancelled = true
    }
  }, [pathname])

  return (
    <ExpectedActualPanel
      title="layout.tsx notFound() 실시간 응답 검증"
      expected={`• ${pathname}\n• layout.tsx에서 notFound() 호출 -> 실제 HTTP 404 응답`}
      actual={
        status === null
          ? '• 현재 문서를 다시 요청해 상태 코드 측정 중...'
          : `• 실제 응답 상태 코드 ${status}`
      }
      isMatched={status === null ? undefined : status === 404}
      description="지금 렌더링된 이 not-found.tsx 화면의 URL을 그대로 다시 요청해, Next.js가 실제로 404 상태 코드를 돌려주는지 눈으로 확인합니다."
    />
  )
}
