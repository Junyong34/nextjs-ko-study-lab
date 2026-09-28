'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { readServerEnvAction, type ServerEnvReadResult } from '../actions'

interface EnvVariablesDemoProps {
  onResult: (result: ServerEnvReadResult) => void
  onReset: () => void
}

export function EnvVariablesDemo({ onResult, onReset }: EnvVariablesDemoProps) {
  const [isPending, startTransition] = useTransition()
  const [serverResult, setServerResult] = useState<ServerEnvReadResult | null>(null)
  // 'use client' 컴포넌트도 최초 렌더링 시 서버(Node.js)에서 한 번 실행된다.
  // 렌더 본문에서 바로 process.env를 읽으면 그 순간엔 서버 프로세스이므로 실제 값이
  // SSR HTML에 그대로 섞여 나갈 수 있다. 브라우저에서만 실행되는 useEffect 안에서
  // 읽어야 실제 클라이언트 번들이 보는 값을 정확히 관찰할 수 있다.
  const [clientEnv, setClientEnv] = useState<{ storeName?: string; adminEmail?: string } | null>(null)

  useEffect(() => {
    setClientEnv({
      storeName: process.env.NEXT_PUBLIC_STORE_NAME,
      adminEmail: process.env.INTERNAL_ADMIN_EMAIL,
    })
  }, [])

  const clientStoreName = clientEnv?.storeName
  const clientAdminEmail = clientEnv?.adminEmail

  const handleReadServer = () => {
    startTransition(async () => {
      const result = await readServerEnvAction()
      setServerResult(result)
      onResult(result)
    })
  }

  const handleReset = () => {
    setServerResult(null)
    onReset()
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 font-mono">
        <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-950 dark:bg-blue-950/20">
          <div className="mb-1 font-sans font-bold text-blue-900 dark:text-blue-300">브라우저(클라이언트)에서 읽은 값</div>
          {clientEnv ? (
            <>
              <div>NEXT_PUBLIC_STORE_NAME: <span className="font-bold">{clientStoreName ?? '(없음)'}</span></div>
              <div>
                INTERNAL_ADMIN_EMAIL:{' '}
                <span className={clientAdminEmail ? 'font-bold text-rose-600' : 'font-bold text-emerald-600 dark:text-emerald-400'}>
                  {clientAdminEmail ?? 'undefined (브라우저에 전달되지 않음)'}
                </span>
              </div>
            </>
          ) : (
            <div className="text-zinc-400">확인 중... (브라우저에서만 실행되는 useEffect 대기)</div>
          )}
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-1 font-sans font-bold text-zinc-900 dark:text-zinc-100">서버에서 읽은 값 (버튼으로 실측)</div>
          {serverResult ? (
            <>
              <div>NEXT_PUBLIC_STORE_NAME: <span className="font-bold">{serverResult.storeName ?? '(없음)'}</span></div>
              <div>INTERNAL_ADMIN_EMAIL: <span className="font-bold text-emerald-600 dark:text-emerald-400">{serverResult.adminEmail ?? '(없음)'}</span></div>
              <div className="text-zinc-400">{serverResult.readAt}</div>
            </>
          ) : (
            <div className="text-zinc-400">아직 읽지 않음</div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleReadServer}
        disabled={isPending}
        className="cursor-pointer rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
      >
        {isPending ? '서버에서 읽는 중...' : "Server Action으로 서버에서 다시 읽기"}
      </button>
      <p className="text-[11px] text-zinc-500">
        서버는 두 값을 모두 읽을 수 있지만, 브라우저(클라이언트) 쪽 코드는 <code>NEXT_PUBLIC_STORE_NAME</code>만 보이고 <code>INTERNAL_ADMIN_EMAIL</code>은 항상 <code>undefined</code>입니다.
      </p>

      <div className="flex justify-end pt-1">
        <DemoResetButton onReset={handleReset} label="예제 초기화" />
      </div>
    </div>
  )
}
