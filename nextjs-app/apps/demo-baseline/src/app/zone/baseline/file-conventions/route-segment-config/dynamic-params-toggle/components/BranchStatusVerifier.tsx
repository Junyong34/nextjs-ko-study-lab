'use client'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel } from '@study/demo-kit'

export function BranchStatusVerifier({
  title,
  targetPath,
  expectedStatus,
  expectedNote,
  description,
}: {
  title: string
  /** 생략 시 현재 페이지 자신의 경로(usePathname())를 fetch합니다. 다른 형제 경로를 실측하려면 명시적으로 넘깁니다. */
  targetPath?: string
  expectedStatus: number
  expectedNote: string
  description: string
}) {
  const pathname = usePathname()
  const urlToCheck = targetPath ?? pathname
  const [status, setStatus] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    setStatus(null)

    fetch(urlToCheck, { cache: 'no-store' })
      .then((res) => {
        if (!cancelled) setStatus(res.status)
      })
      .catch(() => {
        if (!cancelled) setStatus(null)
      })

    return () => {
      cancelled = true
    }
  }, [urlToCheck])

  return (
    <ExpectedActualPanel
      title={title}
      expected={`• 경로: ${urlToCheck}\n• ${expectedNote}\n• 예상 HTTP 상태 코드: ${expectedStatus}`}
      actual={
        status === null
          ? '• 이 경로를 실제로 fetch하여 상태 코드 측정 중...'
          : `• 실제 응답 상태 코드: ${status}`
      }
      isMatched={status === null ? undefined : status === expectedStatus}
      description={description}
    />
  )
}
