'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { PresetProbeState } from '../hooks/usePresetProbe'
import { findDivergence, isFaultMatched, judgePreset } from '../lib/judge'
import { FAULTS, PRESETS } from '../types'
import { PresetsDeepDive } from './PresetsDeepDive'

const [SHORT, MEDIUM] = PRESETS

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>세 프리셋 모두 엔트리가 revalidate(20/50/120초) 이전에는 교체되지 않고, expire(300/300/900초)를 넘긴 엔트리는 응답되지 않는다.</li>
    <li>짧은 수명 엔트리가 교체되는 회차에 중간 수명 엔트리는 아직 재사용된다 — 함수 본문이 같아도 프리셋 이름만으로 수명이 갈린다.</li>
    <li>revalidate &gt; expire 인라인 호출과 선언하지 않은 프리셋 이름은 Next.js 오류(HTTP 500)로 거부된다.</li>
  </ul>
)

export function VerificationFooter({ state }: { state: PresetProbeState }) {
  const { readings, faults, error } = state
  const verdicts = PRESETS.map((spec) => judgePreset(spec, readings[spec.key]))
  const violations = verdicts.flatMap((v) => v.violations.map((msg) => `${v.spec.label} ${msg}`))
  const divergenceSeq = findDivergence(readings.short, readings.medium, SHORT, MEDIUM)
  const faultStates = FAULTS.map((f) => ({ f, matched: isFaultMatched(f.key, faults[f.key]) }))
  const rounds = readings.short.length

  let isMatched: boolean | undefined
  if (error || violations.length > 0 || faultStates.some((s) => s.matched === false)) isMatched = false
  else if (divergenceSeq !== null && faultStates.every((s) => s.matched === true)) isMatched = true

  const actual =
    rounds === 0 && faultStates.every((s) => s.matched === undefined) ? (
      '• 대기 중: [자동 측정 시작]을 누르고 30초 이상 기다린 뒤, 잘못된 값 실행 버튼 두 개도 눌러 보세요.'
    ) : (
      <ul className="space-y-1">
        {error && <li>측정 실패: {error}</li>}
        <li>측정 {rounds}회</li>
        {verdicts.map((v) => (
          <li key={v.spec.key}>
            {v.spec.label}: 교체 {v.refreshes.length}회
            {v.refreshes.length > 0 && ` (교체 직전 나이 ${v.refreshes.map((r) => `${r.oldAgeSec.toFixed(1)}초`).join(', ')})`}
            {v.violations.length === 0 ? ' — 설정과 일치' : ' — 설정과 불일치'}
          </li>
        ))}
        {violations.map((msg) => (
          <li key={msg}>불일치: {msg}</li>
        ))}
        <li>
          수명 분기:{' '}
          {divergenceSeq !== null
            ? `${divergenceSeq}회차에 짧은 수명만 새로 계산되고 중간 수명은 재사용됨`
            : '아직 관측되지 않음 (짧은 수명 엔트리가 20초를 넘겨 교체될 때까지 측정을 이어 가세요)'}
        </li>
        {faultStates.map(({ f, matched }) => (
          <li key={f.key}>
            {f.label}: {matched === undefined ? '미실행' : matched ? 'Next.js 오류로 거부됨' : '예상한 오류가 아님'}
          </li>
        ))}
      </ul>
    )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="cacheLife 커스텀 프리셋 수명 검증 결과"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="probe Route Handler가 돌려준 캐시 ID와 서버 시각만으로 판정합니다. 초기화는 측정 기록만 지우며 서버 캐시 엔트리는 각자의 수명대로 남습니다."
      />
      <PresetsDeepDive />
    </div>
  )
}
