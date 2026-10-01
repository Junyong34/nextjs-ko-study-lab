'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { MeasureResult } from '../types'
import { EXPECTED_HEADERS, isInScope, judge } from '../lib/scope'
import { HeadersDeepDive } from './HeadersDeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>범위 안 경로(데모 페이지·probe)의 응답에는 headers()에 선언한 {EXPECTED_HEADERS.length}개 헤더가 선언한 값 그대로 붙는다.</li>
    <li>범위 밖 경로(다른 데모)의 응답에는 같은 값이 붙지 않는다 — source를 좁혔기 때문이다.</li>
    <li>어느 경로에도 X-Frame-Options가 없다 — 셸이 이 페이지를 iframe으로 임베딩하므로 넣지 않았다.</li>
    <li>대상(범위 안)과 대조(범위 밖)를 하나씩 골라야 판정한다. Strict-Transport-Security는 HTTP localhost에서 브라우저가 무시하지만 응답 헤더로는 보인다.</li>
  </ul>
)

const mark = (ok: boolean) => (ok ? '일치' : '불일치')

export function VerificationFooter({ result }: { result: MeasureResult | null }) {
  let isMatched: boolean | undefined
  let actual: React.ReactNode = '• 대기 중: 대상·대조 경로를 고르고 [응답 헤더 측정]을 실행하세요.'

  if (result && !result.ok) {
    isMatched = false
    actual = `• 측정 실패: ${result.error}`
  } else if (result?.ok) {
    const { target, control } = result
    const verdicts = judge(target, control)
    const contrast = isInScope(target.path) && !isInScope(control.path)
    const noXfo = target.headers['x-frame-options'] === null && control.headers['x-frame-options'] === null
    const allOk = verdicts.every((v) => v.targetOk && v.controlOk) && noXfo && target.status === 200
    isMatched = contrast ? allOk : undefined
    actual = (
      <ul className="space-y-1">
        {!contrast && <li>대상은 범위 안, 대조는 범위 밖 경로로 골라야 판정합니다. (아래 결과는 참고용)</li>}
        <li>대상 HTTP {target.status} / 대조 HTTP {control.status}</li>
        {verdicts.map((v) => (
          <li key={v.key}>
            {v.key}: 대상 {mark(v.targetOk)}({v.targetValue ?? '없음'}) · 대조 {mark(v.controlOk)}({v.controlValue ?? '없음'})
          </li>
        ))}
        <li>X-Frame-Options 미사용: {mark(noXfo)}</li>
      </ul>
    )
  }

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="보안 응답 헤더 주입 범위 검증 결과"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="서버가 실제로 받은 응답 헤더만으로 판정합니다. 설정(next.config)만 바꾸고 dev 서버를 재시작하지 않으면 실제 응답이 달라 불일치가 표시됩니다."
      />
      <HeadersDeepDive />
    </div>
  )
}
