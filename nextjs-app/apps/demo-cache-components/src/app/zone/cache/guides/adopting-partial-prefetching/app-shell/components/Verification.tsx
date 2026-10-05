'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { b2Note, arrivalChecks } from '../lib/arrival'
import { IS_PROD, judge, kindOf } from '../lib/judge'
import { useProbe } from './ProbeContext'

export function Verification() {
  const { requests, runs } = useProbe()
  const prefetches = requests.filter((r) => r.kind === 'prefetch')
  const reqChecks = judge(requests)
  const arr = IS_PROD ? arrivalChecks(runs) : { checks: [], ready: true }
  const checks = [...reqChecks, ...arr.checks]
  const failed = checks.some((c) => !c.skipped && !c.ok)
  const waiting = IS_PROD && (prefetches.length === 0 || !arr.ready)
  const isMatched = failed ? false : waiting ? undefined : true

  const kinds = new Map<string, number>()
  for (const r of prefetches) kinds.set(kindOf(r), (kinds.get(kindOf(r)) ?? 0) + 1)

  const expected = [...checks.map((c) => `• ${c.label}: ${c.expected}`), IS_PROD ? '• 클릭 측정: partial 기본 링크와 cold 링크를 각각 1회 이상 클릭' : ''].filter(Boolean).join('\n')
  const status = (c: (typeof checks)[number]) => (c.skipped ? '비교 생략' : c.ok ? '일치' : '불일치')
  const lines = checks.map((c) => `• ${c.label}: ${c.actual} → ${status(c)}`)
  if (IS_PROD && prefetches.length === 0) lines.unshift('• 아직 prefetch 요청이 없습니다. 링크가 보이도록 두고 잠시 기다리세요.')
  if (IS_PROD && !arr.ready) lines.push('• 아직 partial 기본 링크와 cold 링크를 모두 클릭하지 않았습니다.')
  const note = b2Note(runs)
  if (note) lines.push(`• (참고, 판정 아님) ${note}`)
  lines.push(`• 관찰된 prefetch ${prefetches.length}건 — ${[...kinds].map(([k, n]) => `${k} ${n}`).join(', ') || '없음'}`)

  return (
    <ExpectedActualPanel
      title={`App Shell 공유와 클릭 후 도착 시각 (현재 ${IS_PROD ? 'production' : 'development'})`}
      expected={<>{expected}</>}
      actual={<>{lines.join('\n')}</>}
      isMatched={isMatched}
      description="판정은 라우터가 실제로 보낸 요청 헤더와, 클릭한 뒤 각 영역이 화면에 마운트된 시각으로만 합니다. 네트워크가 빠른 환경에서는 prefetch 유무의 시간 차이가 보이지 않아 그 비교는 생략합니다."
    />
  )
}
