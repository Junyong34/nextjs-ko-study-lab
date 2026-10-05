'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { READ_DELAY_MS } from '../lib/constants'
import { arrivalGap, judgeRun } from '../lib/judge'
import type { StreamRun } from '../types'

const EXPECTED =
  `• inside: fallback 마커가 먼저 오고, 쿠키 영역은 스트리밍 세그먼트로 ${READ_DELAY_MS}ms 안팎 뒤에 도착 (간격 ≥ ${READ_DELAY_MS * 0.5}ms)\n` +
  `• outside: fallback 없음. 정적 마크업과 쿠키 영역이 함께 도착 (간격 < ${READ_DELAY_MS * 0.3}ms)\n` +
  '• 쿠키 없음/있음 두 상태 모두에서 서버가 읽은 값이 보낸 쿠키와 일치\n' +
  '• 위 조건을 inside에서 쿠키 없음·있음 각 1회 이상, outside에서 1회 이상 측정하면 검증 완료'

export function Verification({ runs }: { runs: StreamRun[] }) {
  const inside = runs.filter((r) => r.target === 'inside')
  const outside = runs.filter((r) => r.target === 'outside')
  const covered =
    inside.some((r) => r.cookieSent === null) && inside.some((r) => r.cookieSent !== null) && outside.length > 0
  const isMatched = runs.length === 0 ? undefined : runs.some((r) => !judgeRun(r)) ? false : covered ? true : undefined

  const actual =
    runs.length === 0
      ? '• 아직 측정하지 않았습니다. [inside 측정]과 [outside 측정]을 쿠키 없음/발급 상태에서 각각 눌러 보세요.'
      : runs
          .slice(-6)
          .map(
            (r) =>
              `#${r.runNo} ${r.target} · 쿠키 ${r.cookieSent ?? '없음'} → 읽은 값 ${r.sessionUser ?? '-'} · 간격 ${arrivalGap(r) ?? '-'}ms · fallback ${r.fallbackAt ? '있음' : '없음'} · ${judgeRun(r) ? '일치' : '불일치'}`,
          )
          .join('\n') + (covered ? '' : '\n(아직 측정하지 않은 조합이 있습니다)')

  return (
    <ExpectedActualPanel
      title="cookies()를 Suspense 안/밖에서 읽을 때 정적 마크업 도착 시점"
      expected={<>{EXPECTED}</>}
      actual={<>{actual}</>}
      isMatched={isMatched}
      description="판정은 같은 응답 안에서 정적 마커와 쿠키 마커가 도착한 시각 차이로 합니다. dev 서버의 컴파일 시간은 두 마커에 똑같이 섞이므로 영향이 작습니다."
    />
  )
}
