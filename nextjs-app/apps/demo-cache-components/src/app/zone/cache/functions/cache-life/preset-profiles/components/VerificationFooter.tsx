'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { formatAge, formatServerTime, PRESET_SPECS, type Observation, type PresetName } from '../types'
import { useObservations } from './ObservationContext'

const REVALIDATE_MS = Object.fromEntries(PRESET_SPECS.map((s) => [s.name, s.revalidate * 1000])) as Record<PresetName, number>

const age = (o: Observation, p: PresetName) => o.requestAt - o.rows[p].generatedAt

/** 연속된 두 관측 사이에 cacheId가 바뀐 지점 */
function changes(obs: Observation[], p: PresetName) {
  return obs.slice(1).flatMap((b, i) => (obs[i].rows[p].cacheId !== b.rows[p].cacheId ? [[obs[i], b] as const] : []))
}

function evaluate(obs: Observation[]) {
  const secondsChanges = changes(obs, 'seconds')
  const minutesChanges = changes(obs, 'minutes')
  const longChanges = [...changes(obs, 'hours'), ...changes(obs, 'max')]
  // revalidate가 지난 항목이 그대로 응답에 쓰인 횟수 (dev의 백그라운드 재생성 경로에서만 나타난다)
  const staleServed = obs.filter((o) => age(o, 'seconds') >= REVALIDATE_MS.seconds)
  const spanMs = obs.length > 1 ? obs[obs.length - 1].requestAt - obs[0].requestAt : 0
  const isMatched = longChanges.length > 0 ? false : secondsChanges.length > 0 ? true : undefined
  return { secondsChanges, minutesChanges, longChanges, staleServed, spanMs, isMatched }
}

export function VerificationFooter() {
  const { observations: obs } = useObservations()
  const { secondsChanges, minutesChanges, longChanges, staleServed, spanMs, isMatched } = evaluate(obs)
  const mode = obs.at(-1)?.mode
  const last = obs.at(-1)

  const expected = (
    <span>
      {"• cacheLife('seconds') (revalidate 1초): 1초 넘게 기다렸다 다시 요청하면 본문이 재실행되어 cacheId가 바뀜\n"}
      {"• cacheLife('minutes') (revalidate 1분): 1분 안에는 같은 cacheId, 1분이 지난 뒤 요청에서 바뀜\n"}
      {"• cacheLife('hours') / cacheLife('max'): 실습하는 동안 cacheId·실행 시각이 그대로 유지됨\n"}
      {mode === 'development'
        ? '• next dev: seconds는 캐시된 항목을 먼저 응답하고 요청마다 백그라운드에서 다시 만듦 → 매 요청 직전 요청 때 만든 cacheId가 보임 (경과 ≈ 요청 간격)'
        : '• next start: 기본 in-memory 핸들러가 revalidate 지난 항목을 버리므로 그 요청에서 바로 다시 실행됨 (seconds 행 경과가 항상 1초 미만)'}
    </span>
  )

  const actual = (
    <span>
      {obs.length === 0 && '• 관측 대기 중 (페이지 로드 후 첫 요청이 기록됩니다)\n'}
      {obs.length > 0 && `• ${obs.length}회 요청 관측, 첫 요청부터 ${formatAge(spanMs)} 경과 (서버 모드 ${mode})\n`}
      {secondsChanges.length > 0
        ? `• seconds: cacheId ${secondsChanges.length}회 교체 (예: 요청 #${secondsChanges[0][0].seq} #${secondsChanges[0][0].rows.seconds.cacheId} → #${secondsChanges[0][1].seq} #${secondsChanges[0][1].rows.seconds.cacheId})\n`
        : '• seconds: 아직 cacheId 교체가 관측되지 않았습니다. 1초 이상 간격을 두고 다시 요청해 보세요\n'}
      {minutesChanges.length > 0
        ? `• minutes: cacheId ${minutesChanges.length}회 교체 (요청 #${minutesChanges[0][1].seq}에서 #${minutesChanges[0][1].rows.minutes.cacheId})\n`
        : last
          ? `• minutes: 같은 cacheId 유지 중 (항목 경과 ${formatAge(age(last, 'minutes'))} / revalidate 1분)\n`
          : ''}
      {longChanges.length > 0
        ? `• 불일치: hours/max cacheId가 바뀜 (요청 #${longChanges[0][1].seq}). 서버 재시작·파일 수정(HMR)으로 캐시가 비워졌는지 확인하세요\n`
        : last
          ? `• hours/max: ${obs.length}회 요청 동안 #${last.rows.hours.cacheId} / #${last.rows.max.cacheId} 유지\n`
          : ''}
      {obs.length > 0 &&
        `• revalidate 지난 seconds 항목이 응답에 쓰인 횟수: ${staleServed.length}회${staleServed[0] ? ` (요청 #${staleServed[0].seq}, 경과 ${formatAge(age(staleServed[0], 'seconds'))})` : ''}`}
    </span>
  )

  return (
    <div className="space-y-3">
      <ExpectedActualPanel
        title="프리셋별 재계산 시점 검증"
        description="요청마다 서버가 보낸 cacheId와 경과 시간을 모아, seconds는 바뀌고 hours·max는 유지되는지 비교합니다."
        expected={expected}
        actual={actual}
        isMatched={isMatched}
      />
      {obs.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
          <table data-testid="observation-log" className="w-full min-w-[600px] text-left font-mono text-[11px]">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-2 py-1.5">요청</th>
                <th className="px-2 py-1.5">서버 시각</th>
                {PRESET_SPECS.map((s) => (
                  <th key={s.name} className="px-2 py-1.5">
                    {s.name} (경과)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {obs.map((o, i) => (
                <tr key={o.requestId} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-2 py-1">#{o.seq}</td>
                  <td className="px-2 py-1">{formatServerTime(o.requestAt)}</td>
                  {PRESET_SPECS.map((s) => {
                    const changed = i > 0 && obs[i - 1].rows[s.name].cacheId !== o.rows[s.name].cacheId
                    return (
                      <td key={s.name} className={`px-2 py-1 ${changed ? 'font-bold text-amber-600 dark:text-amber-400' : ''}`}>
                        #{o.rows[s.name].cacheId} ({formatAge(age(o, s.name))})
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
