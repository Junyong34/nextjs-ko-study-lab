'use client'
import React from 'react'

export interface RuntimeEnvCall {
  pid: number
  nodeEnv: string | null
  hostname: string
  evaluatedAt: string
}

interface RuntimeEnvDemoProps {
  calls: RuntimeEnvCall[]
  isPending: boolean
  onCall: () => void
}

export function RuntimeEnvDemo({ calls, isPending, onCall }: RuntimeEnvDemoProps) {
  const latest = calls[0]
  const previous = calls[1]
  const pidStable = previous ? latest.pid === previous.pid : null

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">process.env 런타임 참조 실습 콘솔</h4>
          <p className="text-xs text-zinc-500">Route Handler(api/status)를 호출해 요청 시점마다 서버 프로세스 값을 실제로 읽습니다.</p>
        </div>
        <button
          onClick={onCall}
          disabled={isPending}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          {isPending ? '요청 중...' : 'api/status 호출'}
        </button>
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1.5">
        {latest ? (
          <>
            <div>pid (서버 프로세스 ID): <span className="text-emerald-400 font-bold">{latest.pid}</span></div>
            <div>NODE_ENV: {latest.nodeEnv}</div>
            <div>hostname: {latest.hostname}</div>
            <div>evaluatedAt: {latest.evaluatedAt}</div>
            {previous && (
              <div className="pt-1 border-t border-zinc-800">
                pid 동일(같은 서버 프로세스)?{' '}
                <span className={pidStable ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{String(pidStable)}</span>
                {' · '}evaluatedAt 갱신됨?{' '}
                <span className="text-emerald-400 font-bold">{String(latest.evaluatedAt !== previous.evaluatedAt)}</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-zinc-500">호출 전</div>
        )}
      </div>
    </div>
  )
}
