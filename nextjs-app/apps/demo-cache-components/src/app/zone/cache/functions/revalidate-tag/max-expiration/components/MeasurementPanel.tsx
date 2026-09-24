'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { evaluate, expectsStaleFirst, waitedForRecompute } from '../measure'
import { PROFILES } from '../tags'
import type { MeasureRun, ProbeResult } from '../types'
import { formatExpire } from './ProfileRowCard'

const TITLE = '무효화 후 1회차·2회차 요청이 받은 값'

function expectedText(run: MeasureRun) {
  const row = PROFILES[run.profileId]
  const window = `대기 ${run.delaySec}초 ${expectsStaleFirst(run) ? '<' : '≥'} expire ${formatExpire(row.expireSeconds)}`
  return expectsStaleFirst(run)
    ? `${row.code} · ${window} → stale-while-revalidate\n- 1회차: 무효화 이전 엔트리(같은 cacheId, 이전 버전)를 기다림 없이 받음\n- 재계산은 백그라운드에서 진행\n- 2회차: 새 버전 엔트리`
    : `${row.code} · ${window} → 만료(블로킹 재계산)\n- 1회차: 재계산을 기다려(원본 지연만큼 느림) 새 버전·새 cacheId를 받음\n- 2회차: 1회차가 만든 엔트리를 그대로 재사용`
}

function probeLine(label: string, p: ProbeResult | undefined, target?: number) {
  if (!p) return `${label}: -`
  const c = p.cached
  const verdict = target === undefined ? '' : c.version === target ? ' → 새 값' : ' → 이전 값(stale)'
  const timing = waitedForRecompute(p.durationMs) ? '재계산 대기' : '즉시'
  return `${label}: v${c.version} #${c.cacheId} (생성 ${c.generatedAt}) · 캐시 조회 ${p.durationMs}ms ${timing}${verdict}`
}

function actualText(run: MeasureRun) {
  const inv = run.invalidation!
  return [
    `원본: v${run.before!.source.version} → v${inv.sourceAfter.version} (${inv.sourceAfter.updatedAt}, Route Handler)`,
    probeLine('기준 요청', run.before),
    probeLine('1회차 요청', run.first, inv.sourceAfter.version),
    probeLine('2회차 요청', run.second, inv.sourceAfter.version),
  ].join('\n')
}

function Cell({ p, target }: { p?: ProbeResult; target: number }) {
  if (!p) return <>-</>
  const fresh = p.cached.version === target
  return (
    <span className={fresh ? 'text-emerald-600' : 'text-amber-600'}>
      v{p.cached.version} #{p.cached.cacheId} · {p.durationMs}ms
    </span>
  )
}

export function MeasurementPanel({ runs }: { runs: MeasureRun[] }) {
  const current = runs[0]
  const verdict = current ? evaluate(current) : null

  return (
    <div className="space-y-3">
      {!current || !verdict ? (
        // 문자열 expected/actual + isMatched undefined 조합은 demo-kit이 "불일치"로 오판하므로 JSX로 감싼다
        <ExpectedActualPanel
          title={TITLE}
          description={current && !current.error ? '측정 중입니다: 기준 → 무효화 → 1회차 → 2회차 순서로 응답을 기록합니다.' : "위 가격표에서 줄마다 버튼을 눌러 profile별로 비교해 주세요. 'max'와 { expire: 0 }부터 비교하면 차이가 가장 분명합니다."}
          expected={<span>무효화 후 expire 시간 안의 첫 요청은 이전 값을 즉시 받고(SWR) 2회차에 새 값을 받는다. expire가 지난 뒤(예: expire 0)의 첫 요청은 재계산을 기다려 바로 새 값을 받는다.</span>}
          actual={<span>{current?.error ? `요청 오류: ${current.error}` : current ? '측정 중...' : '아직 측정한 무효화가 없습니다.'}</span>}
          isMatched={undefined}
        />
      ) : (
        <ExpectedActualPanel
          title={TITLE}
          description={`${PROFILES[current.profileId].name}: 모든 값은 실제 GET 요청이 받은 'use cache' 엔트리(cacheId·생성 시각)와 캐시 함수 호출 시간입니다.`}
          expected={<span>{expectedText(current)}</span>}
          actual={<span>{actualText(current)}</span>}
          isMatched={verdict.matched}
        />
      )}

      {runs.some((r) => evaluate(r)) && (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-zinc-50 font-sans text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-2 py-1.5">profile</th>
                <th className="px-2 py-1.5">대기</th>
                <th className="px-2 py-1.5">원본</th>
                <th className="px-2 py-1.5">1회차 요청</th>
                <th className="px-2 py-1.5">2회차 요청</th>
                <th className="px-2 py-1.5">기대와 일치</th>
              </tr>
            </thead>
            <tbody className="text-zinc-800 dark:text-zinc-200">
              {runs.map((run) => {
                const v = evaluate(run)
                if (!v) return null
                return (
                  <tr key={run.id} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="px-2 py-1.5 whitespace-nowrap">{PROFILES[run.profileId].code.replace('revalidateTag(tag, ', '').slice(0, -1)}</td>
                    <td className="px-2 py-1.5">{run.delaySec}초</td>
                    <td className="px-2 py-1.5">v{v.target}</td>
                    <td className="px-2 py-1.5 whitespace-nowrap"><Cell p={run.first} target={v.target} /></td>
                    <td className="px-2 py-1.5 whitespace-nowrap"><Cell p={run.second} target={v.target} /></td>
                    <td className={`px-2 py-1.5 ${v.matched ? 'text-emerald-600' : 'text-rose-600'}`}>{v.matched ? '일치' : '불일치'}</td>
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
