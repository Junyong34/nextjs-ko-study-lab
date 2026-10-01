'use client'

import React, { useState, useTransition } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { probeServerHtmlAction } from '../actions'
import { judge } from '../lib/judge'
import { DEMO_BASE_PATH, type DomProbeResult, type ServerProbeResult } from '../types'
import { LivePanel } from './LivePanel'
import { RegistryProvider } from './RegistryProvider'
import { ServerProbePanel } from './ServerProbePanel'
import { useStyleRegistry } from './RegistryContext'
import { VerificationFooter } from './VerificationFooter'

/** [초기화]가 registry(클라이언트 주입 규칙)에 접근하려면 Provider 안쪽에 있어야 한다. */
function ResetControl({ onReset }: { onReset: () => void }) {
  const registry = useStyleRegistry()
  return (
    <DemoResetButton
      label="결과 초기화"
      onReset={() => {
        registry.resetClient(document)
        onReset()
      }}
    />
  )
}

export function StyleRegistryDemo() {
  const [server, setServer] = useState<ServerProbeResult | null>(null)
  const [dom, setDom] = useState<DomProbeResult | null>(null)
  const [hues, setHues] = useState<number[]>([])
  const [isPending, startTransition] = useTransition()

  const probeServer = () => startTransition(async () => setServer(await probeServerHtmlAction()))
  const addHue = () => setHues((prev) => [...prev, (prev.length * 47 + 20) % 360])
  const resetAll = () => {
    setServer(null)
    setDom(null)
    setHues([])
  }

  const { matched, actual } = judge(server, dom)

  return (
    <RegistryProvider>
      <DemoPlaygroundCard title="Style Registry: 수집 → flush → 클라이언트 재사용 (guides/css-in-js/style-registry)">
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="max-w-xl text-[11px] leading-relaxed text-zinc-500">
              외부 라이브러리 없이 직접 만든 <code>StyleRegistry</code>입니다. 아래 두 라우트(
              <code>{DEMO_BASE_PATH}/with-registry</code>, <code>/without-registry</code>)는 같은 컴포넌트 트리를 렌더하며
              <code>useServerInsertedHTML</code> 호출 여부만 다릅니다.
            </p>
            <ResetControl onReset={resetAll} />
          </div>

          <div className="space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">1. 서버 원본 HTML 대조 (FOUC 판정)</span>
              <button type="button" onClick={probeServer} disabled={isPending} className="cursor-pointer rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
                {isPending ? '두 라우트 요청 중...' : '두 라우트 원본 HTML 실측'}
              </button>
            </div>
            {server ? (
              <ServerProbePanel withRegistry={server.withRegistry} withoutRegistry={server.withoutRegistry} />
            ) : (
              <p className="text-[11px] text-zinc-500">서버가 Node fetch로 두 라우트를 직접 요청해, 하이드레이션 이전의 원본 HTML을 분석합니다.</p>
            )}
          </div>

          <LivePanel hues={hues} dom={dom} onAddHue={addHue} onMeasure={setDom} />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter matched={matched} actual={actual} />
    </RegistryProvider>
  )
}
