'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { BINDING_SPECS, CUSTOM_PROFILE_NAME, formatAge, formatServerTime, type BindingMode, type Observation } from '../types'
import { useObservations } from './ObservationContext'

const REVALIDATE_MS = Object.fromEntries(BINDING_SPECS.map((s) => [s.mode, s.revalidate * 1000])) as Record<BindingMode, number>

const age = (o: Observation, m: BindingMode) => o.requestAt - o.rows[m].generatedAt

/** 연속된 두 관측 사이에 cacheId가 바뀐 지점 */
function changes(obs: Observation[], m: BindingMode) {
  return obs.slice(1).flatMap((b, i) => (obs[i].rows[m].cacheId !== b.rows[m].cacheId ? [[obs[i], b] as const] : []))
}

function evaluate(obs: Observation[]) {
  const customChanges = changes(obs, 'custom')
  const defaultChanges = changes(obs, 'default')
  const spanMs = obs.length > 1 ? obs[obs.length - 1].requestAt - obs[0].requestAt : 0
  // default가 짧은 실습 시간 안에 바뀌면 이상 신호(false). 안 바뀌었고 custom만 바뀌면 기대대로(true).
  const isMatched = defaultChanges.length > 0 ? false : customChanges.length > 0 ? true : undefined
  return { customChanges, defaultChanges, spanMs, isMatched }
}

export function VerificationFooter() {
  const { observations: obs } = useObservations()
  const { customChanges, defaultChanges, spanMs, isMatched } = evaluate(obs)
  const mode = obs.at(-1)?.mode
  const last = obs.at(-1)

  // expected/actual을 문자열이 아닌 ReactNode(<span>)로 감싼다: ExpectedActualPanel은 expected·actual이
  // 둘 다 순수 문자열일 때만 자동으로 isMatched를 재계산하는데(autoMatched), 그 경로를 타면 위에서 계산한
  // 실측 isMatched(undefined 포함)가 문자열 단순 비교 결과로 덮어써진다. <span>으로 감싸 그 경로를 우회한다.
  const expected = (
    <span>
      {`• cacheLife('${CUSTOM_PROFILE_NAME}') (revalidate 4초): 4초 넘게 기다렸다 다시 요청하면 본문이 재실행되어 cacheId가 바뀜\n`}
      {'• cacheLife() 호출 없음 (default, revalidate 15분): 실습하는 동안 cacheId·실행 시각이 그대로 유지됨\n'}
      {mode === 'development'
        ? '• next dev: custom 행은 expire(20초) 미만이라 요청마다 백그라운드에서 다시 만들어 두므로, 매 요청에 직전 요청 때 만든 cacheId가 보임 (경과 ≈ 요청 간격)'
        : '• next start: 기본 in-memory 핸들러가 revalidate 지난 항목을 버리므로 custom 행은 그 요청에서 바로 다시 실행됨 (경과가 항상 4초 미만)'}
    </span>
  )

  const actual = (
    <span>
      {obs.length === 0 && '• 관측 대기 중 (페이지 로드 후 첫 요청이 기록됩니다)\n'}
      {obs.length > 0 && `• ${obs.length}회 요청 관측, 첫 요청부터 ${formatAge(spanMs)} 경과 (서버 모드 ${mode})\n`}
      {customChanges.length > 0
        ? `• custom: cacheId ${customChanges.length}회 교체 (예: 요청 #${customChanges[0][0].seq} #${customChanges[0][0].rows.custom.cacheId} → #${customChanges[0][1].seq} #${customChanges[0][1].rows.custom.cacheId})\n`
        : '• custom: 아직 cacheId 교체가 관측되지 않았습니다. 4초 이상 간격을 두고 다시 요청해 보세요\n'}
      {defaultChanges.length > 0
        ? `• 불일치: default cacheId가 바뀜 (요청 #${defaultChanges[0][1].seq}). 서버 재시작·파일 수정(HMR)으로 캐시가 비워졌는지 확인하세요\n`
        : last
          ? `• default: ${obs.length}회 요청 동안 #${last.rows.default.cacheId} 유지 (항목 경과 ${formatAge(age(last, 'default'))} / revalidate 15분)\n`
          : ''}
      {last &&
        `• custom 항목 경과: ${formatAge(age(last, 'custom'))} (revalidate ${(REVALIDATE_MS.custom / 1000).toFixed(0)}초 대비 ${
          age(last, 'custom') >= REVALIDATE_MS.custom ? '경과' : '이내'
        })`}
    </span>
  )

  return (
    <div className="space-y-3">
      <ExpectedActualPanel
        title="커스텀 프로필 vs default 재계산 시점 검증"
        description="요청마다 서버가 보낸 cacheId와 경과 시간을 모아, custom(4초 revalidate)은 바뀌고 default(15분 revalidate)는 유지되는지 비교합니다."
        expected={expected}
        actual={actual}
        isMatched={isMatched}
      />
      {obs.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
          <table data-testid="observation-log" className="w-full min-w-[560px] text-left font-mono text-[11px]">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-2 py-1.5">요청</th>
                <th className="px-2 py-1.5">서버 시각</th>
                {BINDING_SPECS.map((s) => (
                  <th key={s.mode} className="px-2 py-1.5">
                    {s.mode} (경과)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {obs.map((o, i) => (
                <tr key={o.requestId} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-2 py-1">#{o.seq}</td>
                  <td className="px-2 py-1">{formatServerTime(o.requestAt)}</td>
                  {BINDING_SPECS.map((s) => {
                    const changedRow = i > 0 && obs[i - 1].rows[s.mode].cacheId !== o.rows[s.mode].cacheId
                    return (
                      <td key={s.mode} className={`px-2 py-1 ${changedRow ? 'font-bold text-amber-600 dark:text-amber-400' : ''}`}>
                        #{o.rows[s.mode].cacheId} ({formatAge(age(o, s.mode))})
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
