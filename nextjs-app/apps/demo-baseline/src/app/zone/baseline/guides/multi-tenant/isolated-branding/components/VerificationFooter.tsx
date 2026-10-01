'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { useProbe } from './ProbeContext'
import { judge, overall } from '../lib/judge'

const EXPECTED = [
  '등록된 테넌트는 200, 미등록 테넌트는 404 (notFound())',
  '테넌트마다 --brand-primary·--brand-accent 와 로고 모양, document.title 이 서로 다르다',
  '한 테넌트의 응답 안에 다른 테넌트의 이름·색상이 섞이지 않는다',
  '렌더된 DOM 의 getComputedStyle 값과 document.title 이 해당 테넌트 설정과 같다',
].join('\n')

export function VerificationFooter() {
  const { probe, live, error } = useProbe()
  const checks = judge(probe, live)
  const matched = error ? false : overall(checks)
  const mark = (ok: boolean | undefined) => (ok === undefined ? '[ ]' : ok ? '[O]' : '[X]')
  const actual = error ? `측정 실패: ${error}` : checks.map((c) => `${mark(c.ok)} ${c.label}\n    ${c.detail}`).join('\n')

  // ReactNode 로 감싸 공용 패널의 문자열 자동 비교를 피하고 isMatched 만 판정에 쓴다.
  return (
    <ExpectedActualPanel
      title="테넌트별 브랜딩 주입·격리 검증"
      expected={<span className="whitespace-pre-line">{EXPECTED}</span>}
      actual={<span className="whitespace-pre-line">{actual}</span>}
      isMatched={matched}
      description="각 테넌트 URL 을 fetch 한 응답 HTML 과 지금 렌더된 DOM 의 계산된 스타일로 판정합니다. [ ]는 아직 측정하지 않은 항목입니다."
    />
  )
}
