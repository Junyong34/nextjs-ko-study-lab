'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { CASES } from '../lib/cases'
import type { Summary } from '../lib/judge'
import { RedirectsRegexDeepDive } from './RedirectsRegexDeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>정규식에 일치하는 경로는 308(permanent: true) 또는 307(permanent: false)과 치환된 Location을 받는다. 쿼리 문자열은 그대로 따라간다.</li>
    <li>\d&#123;4&#125;·\d+·(en|ko|ja)에 일치하지 않는 경로는 리다이렉트되지 않는다(이 데모에는 해당 경로에 page가 없으므로 404).</li>
    <li>:path* 는 0개 세그먼트에도 일치하고, \( \) 로 이스케이프한 괄호는 리터럴로 일치한다.</li>
    <li>선택한 예측이 있다면 실제 상태 코드와 같아야 한다.</li>
  </ul>
)

const mark = (ok: boolean) => (ok ? '✅' : '❌')

export function VerificationFooter({ summary: s }: { summary: Summary }) {
  const done = s.ran === s.total
  const failedLabels = s.failed.map((id) => CASES.find((c) => c.id === id)?.path ?? id)
  const wrongLabels = s.wrongPrediction.map((id) => CASES.find((c) => c.id === id)?.path ?? id)

  // 측정 불일치·틀린 예측이 하나라도 있으면 즉시 불일치. 모든 케이스를 실행해 전부 맞아야 검증 완료.
  let isMatched: boolean | undefined
  if (s.failed.length > 0 || s.wrongPrediction.length > 0) isMatched = false
  else if (done) isMatched = true

  const actual = s.ran === 0 ? (
    '• 대기 중: [요청] 또는 [전체 요청]을 실행하면 서버가 측정한 응답이 여기에 요약됩니다.'
  ) : (
    <ul className="space-y-1">
      <li>{mark(s.failed.length === 0)} 문서 기준과 일치한 측정 {s.measuredOk} / 실행 {s.ran} (전체 {s.total}){failedLabels.length > 0 && ` — 불일치: ${failedLabels.join(', ')}`}</li>
      <li>리다이렉트된 요청 {s.redirected}개 · 리다이렉트되지 않은 요청 {s.notRedirected}개</li>
      <li>{s.predicted === 0 ? '예측 없음' : `${mark(s.wrongPrediction.length === 0)} 예측 ${s.predicted}개 중 ${s.predicted - s.wrongPrediction.length}개 적중${wrongLabels.length > 0 ? ` — 빗나감: ${wrongLabels.join(', ')}` : ''}`}</li>
      {!done && <li>아직 실행하지 않은 케이스 {s.total - s.ran}개가 남아 있어 검증 완료로 판정하지 않습니다.</li>}
    </ul>
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="redirects() 정규식 매칭 실측 검증"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="서버가 fetch(redirect: 'manual')로 읽은 상태 코드와 Location으로만 판정합니다. next.config를 고쳤다면 dev 서버를 재시작해야 결과가 바뀝니다."
      />
      <RedirectsRegexDeepDive />
    </div>
  )
}
