'use client'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel } from '@study/demo-kit'

export function StatusCodeVerifier({
  expectedStatus,
  title,
  expectedDescription,
}: {
  expectedStatus: number
  title: string
  expectedDescription: string
}) {
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
      title={title}
      expected={`• ${pathname}\n• ${expectedDescription}`}
      actual={
        status === null
          ? '• 현재 문서를 다시 요청해 상태 코드 측정 중...'
          : `• 실제 응답 상태 코드 ${status}`
      }
      isMatched={status === null ? undefined : status === expectedStatus}
      description="지금 렌더링된 이 화면의 URL을 그대로 다시 요청해, Next.js가 실제로 반환하는 HTTP 상태 코드를 눈으로 확인합니다."
    />
  )
}
