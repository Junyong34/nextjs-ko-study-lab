'use client'

import React, { useEffect, useState } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { EnvVariablesDemo } from './EnvVariablesDemo'
import { VerificationFooter } from './VerificationFooter'
import type { ServerEnvReadResult } from '../actions'

export function EnvPlayground() {
  const [serverResult, setServerResult] = useState<ServerEnvReadResult | null>(null)
  // EnvVariablesDemo.tsx와 동일한 이유로 useEffect 안에서만 읽는다 —
  // 렌더 본문에서 바로 읽으면 최초 SSR 실행(서버 프로세스) 시점의 실제 값이 섞여 나간다.
  const [clientEnv, setClientEnv] = useState<{ storeName?: string; adminEmail?: string } | null>(null)

  useEffect(() => {
    setClientEnv({
      storeName: process.env.NEXT_PUBLIC_STORE_NAME,
      adminEmail: process.env.INTERNAL_ADMIN_EMAIL,
    })
  }, [])

  const clientStoreName = clientEnv?.storeName
  const clientAdminEmail = clientEnv?.adminEmail

  const isMatched = serverResult && clientEnv
    ? Boolean(clientStoreName) && clientAdminEmail === undefined && Boolean(serverResult.adminEmail)
    : undefined

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="NEXT_PUBLIC_ vs 서버 환경변수 노출 범위 실습">
        <EnvVariablesDemo onResult={setServerResult} onReset={() => setServerResult(null)} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={isMatched}
        actual={
          serverResult
            ? `- 클라이언트에서 본 NEXT_PUBLIC_STORE_NAME: ${clientStoreName ?? '(없음)'}\n- 클라이언트에서 본 INTERNAL_ADMIN_EMAIL: ${clientAdminEmail ?? 'undefined'}\n- 서버에서 본 INTERNAL_ADMIN_EMAIL: ${serverResult.adminEmail ?? '(없음)'}`
            : undefined
        }
        expected="클라이언트는 NEXT_PUBLIC_STORE_NAME만 보고 INTERNAL_ADMIN_EMAIL은 undefined다. 서버는 Server Action으로 INTERNAL_ADMIN_EMAIL을 실제로 읽을 수 있다."
      />
    </div>
  )
}
