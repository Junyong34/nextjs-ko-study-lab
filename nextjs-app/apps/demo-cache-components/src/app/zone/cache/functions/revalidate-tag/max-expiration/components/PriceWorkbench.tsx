'use client'

import React from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useMeasureRun } from '../hooks/useMeasureRun'
import { PROFILE_IDS, PROFILES } from '../tags'
import type { MeasureRun, ProfileId, RowView } from '../types'
import { ProfileRowCard } from './ProfileRowCard'
import { MeasurementPanel } from './MeasurementPanel'

const DELAYS = [0, 6]

const PHASE_LABEL: Record<MeasureRun['phase'], string> = {
  before: '기준 요청(GET probe) 중...',
  invalidate: 'Route Handler에서 원본 변경 + revalidateTag 호출 중...',
  wait: '1회차 요청 전 대기 중...',
  first: '1회차 요청(GET probe) 중...',
  second: '백그라운드 재계산 시간(1초)을 둔 뒤 2회차 요청(GET probe) 중...',
  done: '',
}

/** 줄마다 가장 최근에 관측한 모습: 마지막 측정의 가장 늦은 응답, 없으면 페이지 렌더 값 */
function latestView(runs: MeasureRun[], id: ProfileId, initial: RowView): RowView {
  const run = runs.find((r) => r.profileId === id && (r.second ?? r.first ?? r.before))
  const probe = run?.second ?? run?.first ?? run?.before
  return probe ? { cached: probe.cached, source: probe.source } : initial
}

export function PriceWorkbench({ initial }: { initial: Record<ProfileId, RowView> }) {
  const { runs, busy, measure, clear } = useMeasureRun()
  const [delaySec, setDelaySec] = React.useState(0)
  const latest = runs[0]

  return (
    <>
      <DemoPlaygroundCard title="가격표 캐시 무효화: revalidateTag의 profile 인자별 비교">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <p className="text-[11px] text-zinc-500" aria-live="polite">
              {busy && latest
                ? `${PROFILES[latest.profileId].code} — ${PHASE_LABEL[latest.phase]}`
                : '버튼은 기준 요청 → 가격 변경 웹훅(POST Route Handler) → 1회차 요청 → 2회차 요청을 실제로 보냅니다.'}
            </p>
            <div className="flex items-center gap-1.5" role="group" aria-label="1회차 요청 전 대기 시간">
              <span className="text-zinc-600 dark:text-zinc-400">1회차 요청 전 대기</span>
              {DELAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  disabled={busy}
                  aria-pressed={delaySec === d}
                  onClick={() => setDelaySec(d)}
                  className={`cursor-pointer rounded px-2 py-0.5 font-mono text-[11px] disabled:opacity-50 ${
                    delaySec === d
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {d}초
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PROFILE_IDS.map((id) => (
              <ProfileRowCard
                key={id}
                profileId={id}
                view={latestView(runs, id, initial[id])}
                disabled={busy}
                onMeasure={() => measure(id, delaySec)}
              />
            ))}
          </div>

          {latest?.error && <p className="text-[11px] text-rose-600">요청 오류: {latest.error}</p>}
          <div className="flex justify-end">
            <DemoResetButton label="측정 기록 지우기" disabled={busy} onReset={clear} />
          </div>
        </div>
      </DemoPlaygroundCard>

      <MeasurementPanel runs={runs} />
    </>
  )
}
