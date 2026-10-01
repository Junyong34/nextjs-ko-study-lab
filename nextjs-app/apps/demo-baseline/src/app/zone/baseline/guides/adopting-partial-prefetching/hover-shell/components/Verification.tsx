'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { judge } from '../lib/judge'
import type { ProbeState } from '../types'
import { DeepDive } from './DeepDive'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const EXPECTED = IS_PRODUCTION ? (
  <ul className="list-disc space-y-1 pl-4">
    <li>뷰포트에 들어온 기본/<code>prefetch</code> 링크는 목적지 prefetch 요청(<code>Next-Router-Prefetch</code> 또는 segment prefetch 헤더)을 보낸다.</li>
    <li><code>prefetch=&#123;false&#125;</code> 링크의 목적지는 prefetch 요청이 없다.</li>
  </ul>
) : (
  <ul className="list-disc space-y-1 pl-4">
    <li>개발 모드에서는 <code>&lt;Link&gt;</code>가 viewport 진입·hover에도 prefetch 요청을 보내지 않는다 (0건).</li>
    <li>카드를 클릭하면 <code>_rsc</code> 쿼리가 붙은 RSC 요청이 한 번 발생하고, 헤더가 먼저 도착한 뒤 동적 재고가 body에 뒤따라 스트리밍된다.</li>
  </ul>
)

export function Verification({ probe }: { probe: ProbeState }) {
  const result = judge({ ...probe, isProduction: IS_PRODUCTION })
  const mark = (ok: boolean | null) => (ok === null ? '…' : ok ? '✅' : '❌')

  const actual = (
    <div className="space-y-1.5">
      <div>실행 환경: <strong>{IS_PRODUCTION ? 'production' : 'development (next dev)'}</strong></div>
      {result.checks.map((c) => (
        <div key={c.text}>{mark(c.ok)} {c.text}</div>
      ))}
      {result.info.map((t) => (
        <div key={t} className="text-zinc-500">{t}</div>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="링크 prefetch 네트워크 요청 검증"
        expected={EXPECTED}
        actual={actual}
        isMatched={result.isMatched}
        description={
          IS_PRODUCTION
            ? '실제 fetch 요청의 헤더와 경로로 판정합니다.'
            : 'next dev에서는 prefetch가 동작하지 않으므로 "발생하지 않음"과 클릭 이동의 스트리밍만 판정합니다. production prefetch(헤더·경로) 판정은 next build 후 같은 화면에서 확인해야 하며 이 환경에서는 검증하지 못했습니다.'
        }
      />
      <DeepDive />
    </div>
  )
}
