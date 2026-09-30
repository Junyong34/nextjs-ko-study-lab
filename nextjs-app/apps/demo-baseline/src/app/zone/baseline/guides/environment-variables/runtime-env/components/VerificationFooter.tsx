'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { EnvReadResult, EnvSnapshot, Prediction } from '../types'
import { RuntimeEnvDeepDive } from './RuntimeEnvDeepDive'

interface Props {
  reads: EnvReadResult[]
  prediction: Prediction | null
  serverSnapshot: EnvSnapshot
  renderCount: number
}

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>[변수 읽기]를 두 번 누르면 요청 번호가 증가하고 evaluatedAt이 달라진다 (요청마다 process.env를 새로 읽음).</li>
    <li>Route Handler가 읽은 값과 서버 렌더(page.tsx)가 읽은 값이 같다 (같은 프로세스 환경).</li>
    <li>브라우저 동적 조회 process.env[name]는 값을 못 찾고, 리터럴 참조는 빌드 때 인라인된 경우(NEXT_PUBLIC_·NODE_ENV)에만 서버와 같다 — 당신의 예측과 일치해야 한다.</li>
  </ul>
)

export function VerificationFooter({ reads, prediction, serverSnapshot, renderCount }: Props) {
  const [latest, prev] = reads
  const ready = reads.length >= 2 && prediction !== null && reads[0].name === reads[1].name

  let isMatched: boolean | undefined
  let actual: React.ReactNode = '• 대기 중: 변수를 고르고 예측한 뒤, 같은 변수로 [변수 읽기]를 두 번 실행하세요.'

  if (ready) {
    const perRequest = latest.server.requestCount > prev.server.requestCount && latest.server.evaluatedAt !== prev.server.evaluatedAt
    const sameAsRender = latest.server.values[latest.name] === serverSnapshot.values[latest.name]
    const literalSame = latest.browserLiteral === latest.server.values[latest.name]
    const predictionOk = (prediction === 'same') === literalSame
    const dynamicMissing = latest.browserDynamic === null
    isMatched = perRequest && sameAsRender && predictionOk && dynamicMissing
    const mark = (ok: boolean) => (ok ? '✅' : '❌')
    actual = (
      <ul className="space-y-1">
        <li>{mark(perRequest)} 요청 #{prev.server.requestCount} → #{latest.server.requestCount}, evaluatedAt {perRequest ? '갱신됨' : '변화 없음'}</li>
        <li>{mark(sameAsRender)} Route Handler 값 {String(latest.server.values[latest.name])} / 서버 렌더 값 {String(serverSnapshot.values[latest.name])}</li>
        <li>{mark(predictionOk)} 브라우저 리터럴은 서버와 {literalSame ? '같음' : '다름'} — 예측 &quot;{prediction === 'same' ? '같다' : '다르다'}&quot;</li>
        <li>{mark(dynamicMissing)} 브라우저 동적 조회 결과: {String(latest.browserDynamic)}</li>
        <li>서버 렌더 실행 횟수: {renderCount}회</li>
      </ul>
    )
  }

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="process.env 요청 시점 참조 검증 결과"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="화면에 표시된 서버·브라우저 측정값으로만 판정합니다. 예측이 틀리면 실패로 표시됩니다."
      />
      <RuntimeEnvDeepDive />
    </div>
  )
}
