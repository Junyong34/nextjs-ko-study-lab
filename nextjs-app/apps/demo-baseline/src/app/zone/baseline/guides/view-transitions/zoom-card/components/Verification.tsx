'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { judge } from '../lib/judge'
import type { ProbeState } from '../types'
import { DeepDive } from './DeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>목록 → 상세 이동마다 React가 <code>document.startViewTransition</code>을 호출하고 ready가 resolved 된다.</li>
    <li>전환 중 같은 name(<code>zoom-card-N</code>)의 <code>::view-transition-old/new/group</code> pseudo 애니메이션이 <code>document.getAnimations()</code>에 잡힌다 (공유 요소 morph 쌍).</li>
    <li>미지원 브라우저에서는 전환 없이 이동만 정상 완료된다 (폴백).</li>
  </ul>
)

export function Verification({ probe }: { probe: ProbeState }) {
  const result = judge({ env: probe.env, transitions: probe.transitions, navigationCount: probe.navigations.length })
  const mark = (ok: boolean | null) => (ok === null ? '…' : ok ? '✅' : '❌')

  const actual =
    result.checks.length === 0 ? (
      <div>대기 중: 썸네일을 클릭해 상세로 이동하면 실측값으로 판정합니다. (이동 {probe.navigations.length}회)</div>
    ) : (
      <div className="space-y-1.5">
        {result.checks.map((c) => (
          <div key={c.text}>{mark(c.ok)} {c.text}</div>
        ))}
      </div>
    )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="View Transition 공유 요소 morph 검증"
        expected={EXPECTED}
        actual={actual}
        isMatched={result.isMatched}
        description="startViewTransition 호출, ready 상태, 전환 중 pseudo-element 애니메이션을 직접 측정해 판정합니다. 애니메이션의 시각적 품질(부드러움)은 측정 대상이 아니라 눈으로 확인해야 합니다."
      />
      <DeepDive />
    </div>
  )
}
