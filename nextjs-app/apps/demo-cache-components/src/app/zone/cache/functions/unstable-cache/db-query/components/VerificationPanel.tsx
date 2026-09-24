'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { evaluate, type CheckState } from '../checks'
import type { TimelineEvent } from '../types'

const MARK: Record<CheckState, string> = { pass: '[관측됨]', fail: '[불일치]', pending: '[대기]' }

export function VerificationPanel({ events, isPending }: { events: TimelineEvent[]; isPending: boolean }) {
  const checks = evaluate(events)
  const passed = checks.filter((c) => c.state === 'pass').length
  const failed = checks.some((c) => c.state === 'fail')
  const isMatched = failed ? false : passed === checks.length ? true : undefined

  return (
    <ExpectedActualPanel
      title="unstable_cache 키·tags·revalidate 실측"
      description={
        isPending
          ? 'Server Action 실행 중입니다.'
          : `이번 세션에서 관측한 기록만으로 판정합니다. ${passed}/${checks.length}개 항목 관측됨${failed ? ', 불일치 항목 있음' : ''}.`
      }
      // 문자열 expected/actual + isMatched undefined 조합은 demo-kit이 "불일치"로 오판하므로 JSX로 감싼다
      expected={
        <span>{checks.map((c, i) => `${i + 1}. ${c.title}\n   ${c.expected}`).join('\n')}</span>
      }
      actual={
        <span>{checks.map((c, i) => `${i + 1}. ${MARK[c.state]} ${c.evidence}`).join('\n')}</span>
      }
      isMatched={isMatched}
    />
  )
}
