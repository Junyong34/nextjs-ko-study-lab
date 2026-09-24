'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { Observation } from '../types'
import { useObservations } from './ObservationContext'

function evaluate(obs: Observation[]) {
  const pairs = obs.flatMap((a, i) => obs.slice(i + 1).map((b) => [a, b] as const))
  const hit = pairs.find(([a, b]) => a.category === b.category && a.renderId === b.renderId)
  const newEntry = pairs.find(([a, b]) => a.category !== b.category && a.renderId !== b.renderId)
  const keyViolation = pairs.find(([a, b]) => a.category !== b.category && a.renderId === b.renderId)
  const childrenStale = pairs.find(([a, b]) => a.requestId === b.requestId)
  // 다른 prop을 거쳐 이전 prop으로 돌아왔을 때 이전 렌더 ID가 다시 나타났는지
  const returned = pairs.find(
    ([a, b]) =>
      a.category === b.category &&
      a.renderId === b.renderId &&
      obs.some((m) => m.seq > a.seq && m.seq < b.seq && m.category !== a.category),
  )
  const isMatched =
    keyViolation || childrenStale ? false : hit && newEntry && returned ? true : undefined
  return { hit, newEntry, returned, keyViolation, childrenStale, isMatched }
}

export function VerificationFooter() {
  const { observations } = useObservations()
  const { hit, newEntry, returned, keyViolation, childrenStale, isMatched } = evaluate(observations)

  const expected = (
    <span>
      {'• 같은 category prop으로 다시 요청: 캐시된 JSX의 렌더 ID·시각·실행 횟수가 그대로 (본문 미실행)\n'}
      {'• 다른 category prop: 새 캐시 항목 생성 → 새 렌더 ID, 해당 prop 실행 횟수 1회\n'}
      {'• 이전 prop으로 복귀: 처음 렌더 ID가 다시 나타남 (prop별 항목 유지)\n'}
      {'• children 슬롯: 캐시 HIT 여부와 무관하게 매 요청 새 요청 ID·시각'}
    </span>
  )

  const actual = (
    <span>
      {observations.length === 0 && '• 관측 대기 중 (페이지 로드 후 첫 요청이 기록됩니다)\n'}
      {hit
        ? `• 캐시 HIT 확인: category="${hit[0].category}" 요청 #${hit[0].seq}·#${hit[1].seq} 모두 렌더 ID #${hit[0].renderId} (${hit[0].renderedAt}), children 요청 시각 ${hit[0].requestAt} → ${hit[1].requestAt}\n`
        : '• 캐시 HIT: 아직 같은 prop으로 두 번 요청하지 않았습니다\n'}
      {newEntry
        ? `• prop별 캐시 키 확인: "${newEntry[0].category}" #${newEntry[0].renderId} ≠ "${newEntry[1].category}" #${newEntry[1].renderId}\n`
        : '• prop별 캐시 키: 아직 다른 category로 요청하지 않았습니다\n'}
      {returned
        ? `• 이전 prop 복귀 확인: "${returned[0].category}"로 돌아오자 렌더 ID #${returned[1].renderId}가 다시 나타남 (요청 #${returned[1].seq})\n`
        : '• 이전 prop 복귀: 다른 category를 거쳐 처음 category로 돌아오면 확인합니다\n'}
      {keyViolation && `• 불일치: 서로 다른 prop이 같은 렌더 ID #${keyViolation[0].renderId}를 공유\n`}
      {childrenStale
        ? `• 불일치: children 요청 ID #${childrenStale[0].requestId}가 재사용됨`
        : observations.length > 1
          ? `• children 슬롯: ${observations.length}번의 요청 모두 서로 다른 요청 ID`
          : '• children 슬롯: 두 번 이상 요청하면 비교합니다'}
    </span>
  )

  return (
    <div className="space-y-3">
      <ExpectedActualPanel
        title="props 캐시 키와 children 인터리빙 검증"
        description="서버가 보낸 캐시된 JSX 안의 값과 children 슬롯의 값을 요청마다 짝지어 비교합니다."
        expected={expected}
        actual={actual}
        isMatched={isMatched}
      />
      {observations.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
          <table data-testid="observation-log" className="w-full text-left font-mono text-[11px]">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-2 py-1.5">요청</th>
                <th className="px-2 py-1.5">category</th>
                <th className="px-2 py-1.5">캐시 렌더 ID / 시각</th>
                <th className="px-2 py-1.5">prop 실행 횟수</th>
                <th className="px-2 py-1.5">children 요청 시각</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((o, i) => {
                const reused = observations.slice(0, i).some((p) => p.renderId === o.renderId)
                return (
                  <tr key={o.requestId} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="px-2 py-1">#{o.seq}</td>
                    <td className="px-2 py-1">{o.category}</td>
                    <td className="px-2 py-1">
                      #{o.renderId} {o.renderedAt}{' '}
                      <span className={reused ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}>
                        {reused ? '(재사용)' : '(이 화면에서 첫 관측)'}
                      </span>
                    </td>
                    <td className="px-2 py-1">{o.categoryExecNo}회</td>
                    <td className="px-2 py-1 text-emerald-700 dark:text-emerald-400">{o.requestAt}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
