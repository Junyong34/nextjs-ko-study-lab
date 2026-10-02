'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { CASES } from '../lib/cases'
import { verdict, type Summary } from '../lib/judge'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>슬래시 없는 페이지·확장자 경로와 앱 루트 /는 리다이렉트 없이 200으로 응답한다.</li>
    <li>끝 슬래시가 붙은 경로는 308과 함께 슬래시를 뗀 Location을 받는다. 쿼리 문자열은 그대로 따라간다.</li>
    <li>고른 예측이 있다면 실제 상태 코드와 같아야 한다.</li>
  </ul>
)

const mark = (ok: boolean) => (ok ? '[일치]' : '[불일치]')
const labelOf = (id: string) => CASES.find((c) => c.id === id)?.label ?? id

export function VerificationFooter({ summary: s }: { summary: Summary }) {
  const actual = s.ran === 0 ? (
    '대기 중: [요청] 또는 [전체 요청]을 실행하면 서버가 읽은 응답이 여기에 요약됩니다.'
  ) : (
    <ul className="space-y-1">
      <li>
        {mark(s.failed.length === 0)} 문서 기준과 일치한 측정 {s.measuredOk} / 실행 {s.ran} (전체 {s.total})
        {s.failed.length > 0 && ` — 다름: ${s.failed.map(labelOf).join(', ')}`}
      </li>
      <li>308 리다이렉트 {s.redirected}개 · 그대로 응답(2xx) {s.direct}개</li>
      <li>
        {s.predicted === 0
          ? '예측 없음'
          : `${mark(s.wrongPrediction.length === 0)} 예측 ${s.predicted}개 중 ${s.predicted - s.wrongPrediction.length}개 적중${s.wrongPrediction.length > 0 ? ` — 빗나감: ${s.wrongPrediction.map(labelOf).join(', ')}` : ''}`}
      </li>
      {s.ran < s.total && <li>아직 실행하지 않은 케이스 {s.total - s.ran}개가 남아 있어 검증 완료로 판정하지 않습니다.</li>}
    </ul>
  )

  return (
    <ExpectedActualPanel
      title="기본값(trailingSlash: false) 실측 검증"
      expected={EXPECTED}
      actual={actual}
      isMatched={verdict(s)}
      description="서버가 fetch(redirect: 'manual')로 읽은 상태 코드와 Location으로만 판정합니다. trailingSlash: true의 동작은 실측하지 않으므로 이 판정에 들어가지 않습니다."
    />
  )
}
