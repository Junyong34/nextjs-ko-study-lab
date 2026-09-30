'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { FETCH_MODES, type FetchProbeResult } from '../types'
import { evaluateMode } from '../hooks/evaluate'
import { FetchCacheDeepDive } from './FetchCacheDeepDive'

export function VerificationFooter({ calls }: { calls: FetchProbeResult[] }) {
  const verdicts = FETCH_MODES.map((m) => evaluateMode(m.mode, calls))
  const tried = verdicts.filter((v) => v.calls > 0)
  const judged = verdicts.filter((v) => v.ok !== undefined)
  // 실제 관찰이 하나도 없으면 대기. 하나라도 위반이면 불일치. 핵심 두 모드가 모두 통과해야 완료.
  const core = verdicts.filter((v) => v.mode === 'force-cache' || v.mode === 'no-store')
  const isMatched =
    judged.some((v) => v.ok === false)
      ? false
      : core.every((v) => v.ok === true)
        ? true
        : undefined

  const mark = (ok: boolean | undefined) => (ok === undefined ? '대기' : ok ? '일치' : '불일치')
  const actual =
    tried.length === 0
      ? '• 요청 대기 중 (실습 영역에서 force-cache와 no-store를 각각 2회 이상 요청하세요.)'
      : verdicts
          .filter((v) => v.calls > 0)
          .map((v) => `• ${v.mode}: ${v.detail} → ${mark(v.ok)}`)
          .join('\n') +
        (judged.some((v) => v.ok === false)
          ? '\n※ 기대와 다른 값입니다. 다른 탭에서 캐시를 무효화했거나 서버가 재시작됐다면 [기록 초기화]로 다시 시작하세요.'
          : '')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="fetch 캐시 옵션별 원본 실행 횟수"
        description="서버 액션이 반환한 원본 sourceCount의 변화로 판정합니다. 같은 무효화 구간 안의 연속 호출만 비교합니다."
        // 문자열끼리 넘기면 패널이 자동 비교해 대기 상태가 불일치로 바뀌므로 요소로 감싼다.
        expected={
          <span>{'• force-cache: 무효화 전까지 sourceCount 고정 (원본 미실행)\n• no-store / 옵션 없음: 호출마다 sourceCount 증가\n• revalidate 10초: 10초 안에는 고정'}</span>
        }
        actual={<span>{actual}</span>}
        isMatched={isMatched}
      />
      <FetchCacheDeepDive />
    </div>
  )
}
