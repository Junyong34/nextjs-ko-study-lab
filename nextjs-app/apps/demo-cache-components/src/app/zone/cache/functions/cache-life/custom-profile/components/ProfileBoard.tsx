import { connection } from 'next/server'
import { getBreakingNewsCustom, getBreakingNewsDefault } from '../cached'
import { BINDING_SPECS, formatAge, formatDuration, formatServerTime, type RequestSnapshot } from '../types'
import { RefreshControls } from './RefreshControls'
import { SnapshotReporter } from './ObservationContext'

/**
 * 요청 시점에 커스텀 프로필 바인딩 함수와 default 대조군 함수를 호출하고,
 * 각 함수가 돌려준 cacheId·생성 시각과 서버 기준 경과 시간을 나란히 보여 준다.
 * connection()으로 요청 시점 렌더링을 명시해 빌드 타임 프리렌더에 값이 굳지 않게 한다.
 */
export async function ProfileBoard() {
  await connection()

  const [custom, def] = await Promise.all([getBreakingNewsCustom(), getBreakingNewsDefault()])
  const snapshot: RequestSnapshot = {
    requestId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    requestAt: Date.now(),
    mode: process.env.NODE_ENV ?? 'unknown',
    rows: { custom, default: def },
  }

  return (
    <div className="space-y-3">
      <RefreshControls requestAt={formatServerTime(snapshot.requestAt)} mode={snapshot.mode} />
      <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
        <table data-testid="profile-board" className="w-full min-w-[680px] text-left text-xs">
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
            {BINDING_SPECS.map((spec) => {
              const row = snapshot.rows[spec.mode]
              const ageMs = snapshot.requestAt - row.generatedAt
              const overRevalidate = ageMs >= spec.revalidate * 1000
              return (
                <tr key={spec.mode} data-binding={spec.mode} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100">{spec.callArg}</td>
                  <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                    {formatDuration(spec.stale)} / {formatDuration(spec.revalidate)} / {formatDuration(spec.expire)}
                  </td>
                  <td data-testid={`cache-id-${spec.mode}`} className="px-3 py-2 font-bold text-zinc-900 dark:text-zinc-100">
                    #{row.cacheId}
                  </td>
                  <td className="px-3 py-2">{formatServerTime(row.generatedAt)}</td>
                  <td data-testid={`age-${spec.mode}`} className="px-3 py-2">
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
        custom 행의 stale/revalidate/expire 값은 이 앱 <code>next.config.ts</code>의 <code>cacheLife</code> 커스텀 프로필 정의값이고,
        default 행은 <code>cacheLife()</code> 호출이 없을 때 적용되는 내장 default 프로필입니다 (출처: <code>next/dist/server/config-shared.js</code>{' '}
        <code>defaultConfig.cacheLife.default</code>, next 16.3.2).
      </p>
      <SnapshotReporter snapshot={snapshot} />
    </div>
  )
}
