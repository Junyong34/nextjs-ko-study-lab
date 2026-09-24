import { connection } from 'next/server'
import { getHoursSnapshot, getMaxSnapshot, getMinutesSnapshot, getSecondsSnapshot } from '../cached'
import { formatAge, formatDuration, formatServerTime, PRESET_SPECS, type RequestSnapshot } from '../types'
import { RefreshControls } from './RefreshControls'
import { SnapshotReporter } from './ObservationContext'

/**
 * 요청 시점에 네 개의 'use cache' 함수를 호출하고, 각 함수가 돌려준 cacheId·생성 시각과
 * 서버 기준 경과 시간을 나란히 보여 준다.
 * connection()으로 요청 시점 렌더링을 명시해 빌드 타임 프리렌더에 값이 굳지 않게 한다.
 */
export async function PresetBoard() {
  await connection()

  const [seconds, minutes, hours, max] = await Promise.all([
    getSecondsSnapshot(),
    getMinutesSnapshot(),
    getHoursSnapshot(),
    getMaxSnapshot(),
  ])
  const snapshot: RequestSnapshot = {
    requestId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    requestAt: Date.now(),
    mode: process.env.NODE_ENV ?? 'unknown',
    rows: { seconds, minutes, hours, max },
  }

  return (
    <div className="space-y-3">
      <RefreshControls requestAt={formatServerTime(snapshot.requestAt)} mode={snapshot.mode} />
      <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
        <table data-testid="preset-board" className="w-full min-w-[640px] text-left text-xs">
          <thead className="bg-zinc-50 text-[11px] text-zinc-500 dark:bg-zinc-900">
            <tr>
              <th className="px-3 py-2">호출</th>
              <th className="px-3 py-2">stale / revalidate / expire</th>
              <th className="px-3 py-2">cacheId</th>
              <th className="px-3 py-2">본문 실행 시각</th>
              <th className="px-3 py-2">경과 (서버 기준)</th>
              <th className="px-3 py-2">실행 횟수</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {PRESET_SPECS.map((spec) => {
              const row = snapshot.rows[spec.name]
              const ageMs = snapshot.requestAt - row.generatedAt
              const overRevalidate = ageMs >= spec.revalidate * 1000
              return (
                <tr key={spec.name} data-preset={spec.name} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100">cacheLife(&apos;{spec.name}&apos;)</td>
                  <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                    {formatDuration(spec.stale)} / {formatDuration(spec.revalidate)} / {formatDuration(spec.expire)}
                  </td>
                  <td data-testid={`cache-id-${spec.name}`} className="px-3 py-2 font-bold text-zinc-900 dark:text-zinc-100">
                    #{row.cacheId}
                  </td>
                  <td className="px-3 py-2">{formatServerTime(row.generatedAt)}</td>
                  <td data-testid={`age-${spec.name}`} className="px-3 py-2">
                    {formatAge(ageMs)}{' '}
                    <span className={overRevalidate ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                      {overRevalidate ? '(revalidate 경과)' : '(revalidate 이내)'}
                    </span>
                  </td>
                  <td className="px-3 py-2">{row.execNo}회</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] leading-relaxed text-zinc-500">
        프리셋 값 출처: <code>next/dist/server/config-shared.js</code>의 <code>defaultConfig.cacheLife</code>와 로컬 문서{' '}
        <code>cacheLife.md</code> 표 (next 16.3.2). 이 앱의 <code>next.config.ts</code>는 내장 프리셋을 재정의하지 않습니다.
      </p>
      <SnapshotReporter snapshot={snapshot} />
    </div>
  )
}
