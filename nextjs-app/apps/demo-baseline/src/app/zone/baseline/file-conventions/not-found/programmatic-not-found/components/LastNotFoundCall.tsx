'use client'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel } from '@study/demo-kit'
import { PNF_BASE_PATH, SITE_LABELS, type ProbeSite, type ProbeSnapshot } from '../types'

/**
 * not-found 경계가 마운트된 직후 서버 카운터를 읽어,
 * 방금 notFound()를 호출한 지점과 "notFound() 다음 줄" 실행 횟수를 보여준다.
 */
export function LastNotFoundCall() {
  const pathname = usePathname()
  const [probe, setProbe] = useState<ProbeSnapshot | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${PNF_BASE_PATH}/api/probe`, { cache: 'no-store' })
      .then((res) => res.json() as Promise<ProbeSnapshot>)
      .then((data) => {
        if (!cancelled) setProbe(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [pathname])

  const last = probe?.events.find((e) => e.kind === 'before-notFound')
  const site = last ? (last.site as ProbeSite) : null
  const counter = site && probe ? probe.sites[site] : null

  return (
    <ExpectedActualPanel
      title="방금 notFound()를 호출한 지점"
      description="이 경계가 화면에 붙은 직후 서버 카운터(api/probe)를 읽은 결과입니다. 여러 사람이 동시에 실습하면 다른 요청의 기록이 보일 수 있습니다."
      expected={<span>{'• notFound() 직전 줄: 도달 (reached ≥ 1)\n• notFound() 다음 줄: 실행 0회 (after = 0)'}</span>}
      actual={
        <span>
          {!probe
            ? '• 서버 카운터 읽는 중...'
            : !site || !counter
              ? '• 기록된 notFound() 호출이 없습니다.'
              : `• 호출 지점: ${SITE_LABELS[site].where}\n• 조건: ${SITE_LABELS[site].condition}\n• ${last?.detail}\n• 직전 줄 도달 ${counter.reached}회 / 다음 줄 실행 ${counter.after}회`}
        </span>
      }
      isMatched={counter ? counter.reached > 0 && counter.after === 0 : undefined}
    />
  )
}
