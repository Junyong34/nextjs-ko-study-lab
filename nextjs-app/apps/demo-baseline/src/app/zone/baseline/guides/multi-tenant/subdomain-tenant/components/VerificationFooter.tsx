'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { overall, type Verdict } from '../lib/judge'
import { ConceptCard } from './ConceptCard'

const EXPECTED = [
  'Host 헤더의 첫 라벨이 등록된 테넌트(acme·globex·initech)면 그 테넌트로 판별된다',
  '미등록 라벨과 루트 도메인(localhost)은 테넌트 없음',
  'node:http 로 보낸 Host 는 서버에 그대로 도착하고, fetch 로 보낸 Host 는 무시된다',
  'fetch 로도 x-forwarded-host 는 전달되어 테넌트 판별에 쓰인다',
].join('\n')

export function VerificationFooter({ verdicts }: { verdicts: Verdict[] }) {
  const ran = verdicts.filter((v) => v.ok !== undefined).length
  const matched = overall(verdicts)
  const mark = (ok: boolean | undefined) => (ok === undefined ? '[ ]' : ok ? '[O]' : '[X]')
  const actual = verdicts.map((v) => `${mark(v.ok)} ${v.scenario.title}\n    ${v.detail}`).join('\n')

  // ReactNode 로 감싸 공용 패널의 문자열 자동 비교를 피하고 isMatched 만 판정에 쓴다.
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Host 기반 테넌트 판별 검증"
        expected={<span className="whitespace-pre-line">{EXPECTED}</span>}
        actual={<span className="whitespace-pre-line">{actual}</span>}
        isMatched={matched}
        description={`Route Handler 가 실제로 받아 되돌려 준 헤더로 판정합니다. 실행한 시나리오 ${ran}/${verdicts.length}. [ ]는 아직 실행하지 않은 항목입니다.`}
      />
      <ConceptCard />
    </div>
  )
}
