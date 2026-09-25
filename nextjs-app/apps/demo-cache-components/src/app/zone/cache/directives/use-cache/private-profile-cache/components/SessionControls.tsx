'use client'

import { useTransition } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { checkServerExecCount, logoutUser, switchUser } from '../actions'
import { DEMO_USERS, viewerName } from '../types'
import { useObservations } from './ObservationContext'

const btn =
  'rounded border border-zinc-300 bg-white px-2.5 py-1 font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'

/** 로그인 사용자 전환(쿠키 발급 Server Action)과 서버 실행 횟수 조회 */
export function SessionControls() {
  const [isPending, startTransition] = useTransition()
  const { visits, execChecks, recordExecCheck, reset, pageLoadId } = useObservations()
  const current = visits.at(-1)?.viewer
  const lastCheck = execChecks.at(-1)

  return (
    <div className="space-y-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-semibold text-zinc-700 dark:text-zinc-300">로그인 사용자</span>
        {DEMO_USERS.map((u) => (
          <button
            key={u.id}
            type="button"
            data-testid={`login-${u.id}`}
            disabled={isPending || current === u.id}
            onClick={() => startTransition(() => switchUser(u.id))}
            className={current === u.id ? `${btn} !bg-zinc-900 !text-white dark:!bg-zinc-100 dark:!text-zinc-900` : btn}
          >
            {u.name}
          </button>
        ))}
        <button type="button" disabled={isPending} onClick={() => startTransition(() => logoutUser())} className={btn}>
          로그아웃
        </button>
        <span className="ml-auto font-mono text-[11px] text-zinc-500">문서 로드 ID {pageLoadId ?? '-'}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="check-exec"
          disabled={isPending}
          onClick={() => startTransition(async () => recordExecCheck(await checkServerExecCount()))}
          className="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-50"
        >
          서버 실행 횟수 조회
        </button>
        <span data-testid="exec-check" className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
          {lastCheck
            ? `${viewerName(lastCheck.viewer)}: 서버에서 본문 ${lastCheck.count}회 실행 (조회 ${lastCheck.checkedAt})`
            : '탭 이동 전후로 눌러 서버 실행 횟수가 늘었는지 비교하세요'}
        </span>
        <DemoResetButton label="관측 기록 초기화" onReset={reset} className="ml-auto" />
      </div>
    </div>
  )
}
