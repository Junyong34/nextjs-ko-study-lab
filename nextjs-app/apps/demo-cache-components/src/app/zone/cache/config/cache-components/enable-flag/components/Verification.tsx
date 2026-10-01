'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import type { CheckResult } from '../types'

const MARK: Record<'pass' | 'fail' | 'wait', string> = { pass: '[일치]', fail: '[불일치]', wait: '[대기]' }

function mark(pass: boolean | undefined) {
  return pass === undefined ? MARK.wait : pass ? MARK.pass : MARK.fail
}

/** 측정한 항목 중 하나라도 어긋나면 불일치, 전부 측정·통과하면 일치, 그 외에는 대기 */
function overall(checks: CheckResult[]): boolean | undefined {
  if (checks.some((c) => c.pass === false)) return false
  if (checks.every((c) => c.pass === true)) return true
  return undefined
}

export function Verification({ checks }: { checks: CheckResult[] }) {
  const expected = [
    '1) 플래그 값: 서버·클라이언트 번들 모두 true (이 zone은 항상 켜짐)',
    "2) probe: ①정적 ②'use cache' ③fallback이 앞쪽에, 요청 데이터는 뒤쪽 S:n 세그먼트로 도착",
    "3) probe 2회: 'use cache' ID는 같고 요청 ID는 매번 다름",
    '4) blocking: fallback 없이, 요청 지연이 끝난 뒤에야 헤더 도착',
    '5) away에서 이전 라우트 DOM이 display: none으로 남아 있고, 돌아오면 같은 인스턴스·같은 입력값',
  ].join('\n')

  const actual = checks.map((c, i) => `${i + 1}) ${mark(c.pass)} ${c.label}: ${c.detail}`).join('\n')

  return (
    <ExpectedActualPanel
      title="cacheComponents: true 동작 검증 결과"
      expected={<span className="whitespace-pre-line">{expected}</span>}
      actual={<span className="whitespace-pre-line">{actual}</span>}
      isMatched={overall(checks)}
      description="모든 실제 값은 이 브라우저가 받은 응답 HTML·헤더 도착 시각·DOM·React state에서 읽은 실측값입니다."
    />
  )
}
