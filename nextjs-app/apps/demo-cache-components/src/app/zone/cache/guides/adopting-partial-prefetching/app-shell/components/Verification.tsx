'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { IS_PROD, judge, kindOf } from '../lib/judge'
import { useProbe } from './ProbeContext'

export function Verification() {
  const { requests } = useProbe()
  const prefetches = requests.filter((r) => r.kind === 'prefetch')
  const checks = judge(requests)
  const isMatched = IS_PROD && prefetches.length === 0 ? undefined : checks.every((c) => c.ok)

  const kinds = new Map<string, number>()
  for (const r of prefetches) kinds.set(kindOf(r), (kinds.get(kindOf(r)) ?? 0) + 1)

  const expected = checks.map((c) => `• ${c.label}: ${c.expected}`).join('\n')
  const actual =
    (IS_PROD && prefetches.length === 0
      ? '• 아직 prefetch 요청이 없습니다. 링크가 보이도록 두고 잠시 기다리세요.\n'
      : checks.map((c) => `• ${c.label}: ${c.actual} → ${c.ok ? '일치' : '불일치'}`).join('\n') + '\n') +
    `• 관찰된 prefetch ${prefetches.length}건 — ${[...kinds].map(([k, n]) => `${k} ${n}`).join(', ') || '없음'}`

  return (
    <ExpectedActualPanel
      title={`App Shell 공유와 링크별 prefetch (현재 ${IS_PROD ? 'production' : 'development'})`}
      expected={<>{expected}</>}
      actual={<>{actual}</>}
      isMatched={isMatched}
      description="판정은 라우터가 실제로 보낸 요청 헤더로만 합니다. legacy 라우트의 URL별 요청 건수는 관찰 시점마다 달라 판정에서 제외하고 로그에만 표시합니다."
    />
  )
}
