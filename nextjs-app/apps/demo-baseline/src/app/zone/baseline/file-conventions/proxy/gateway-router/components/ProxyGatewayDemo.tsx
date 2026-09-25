'use client'

import React, { useState } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { GATEWAY_ROUTES, UNROUTED_REQUEST_PATH, GatewayProbeResult } from '../types'
import { VerificationFooter } from './VerificationFooter'

type SelectableTarget = (typeof GATEWAY_ROUTES)[number] | { prefix: 'legacy-billing'; requestPath: string; label: string }

const TARGETS: SelectableTarget[] = [
  ...GATEWAY_ROUTES,
  { prefix: 'legacy-billing', requestPath: UNROUTED_REQUEST_PATH, label: '알 수 없는 서비스 (미매핑)' },
]

export function ProxyGatewayDemo() {
  const [selected, setSelected] = useState<SelectableTarget>(TARGETS[0])
  const [results, setResults] = useState<GatewayProbeResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const requestGateway = async (target: SelectableTarget) => {
    setSelected(target)
    setIsLoading(true)
    try {
      const res = await fetch(target.requestPath, { cache: 'no-store' })
      let body: unknown = null
      try {
        body = await res.json()
      } catch {
        body = null
      }
      const result: GatewayProbeResult = {
        requestedPath: target.requestPath,
        prefix: target.prefix,
        status: res.status,
        ok: res.ok,
        targetService: res.headers.get('x-gateway-target-service'),
        matchedPrefix: res.headers.get('x-gateway-matched-prefix'),
        upstreamPort: res.headers.get('x-gateway-upstream-port'),
        requestId: res.headers.get('x-gateway-request-id'),
        body,
        timestamp: new Date().toLocaleTimeString('ko-KR'),
      }
      setResults((prev) => [result, ...prev].slice(0, 5))
    } catch (err) {
      console.error('Gateway proxy request failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const latest = results[0] ?? null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">API 게이트웨이 콘솔</h4>
          <p className="text-xs text-zinc-500">
            경로 접두사를 선택해 실제 <code className="font-mono">proxy.ts</code>를 거쳐 서로 다른 내부 서비스로 라우팅되는지 확인합니다.
          </p>
        </div>
        <DemoResetButton
          onReset={() => {
            setResults([])
            setSelected(TARGETS[0])
          }}
          label="결과 초기화"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
        {TARGETS.map((target) => (
          <button
            key={target.prefix}
            type="button"
            onClick={() => requestGateway(target)}
            disabled={isLoading}
            className={`rounded border px-3 py-2.5 text-left text-xs transition cursor-pointer disabled:opacity-50 ${
              selected.prefix === target.prefix
                ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30'
                : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900'
            }`}
          >
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">{target.label}</div>
            <div className="mt-0.5 font-mono text-[10px] text-zinc-500">
              GET {target.requestPath.replace('/zone/baseline/file-conventions/proxy/gateway-router', '')}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-[11px] text-zinc-300 dark:border-zinc-800 space-y-1.5">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">proxy.ts 응답 헤더 / 본문:</div>
        {isLoading && <div className="text-amber-400">요청 처리 중...</div>}
        {!isLoading && !latest && <div className="text-zinc-500">아직 요청을 보내지 않았습니다. 위 버튼을 눌러 실행하세요.</div>}
        {!isLoading && latest && (
          <div className="space-y-1">
            <div>
              HTTP <span className={latest.ok ? 'text-emerald-400' : 'text-rose-400'}>{latest.status}</span>{' '}
              <span className="text-zinc-500">({latest.requestedPath})</span>
            </div>
            <div>x-gateway-target-service: &quot;{latest.targetService ?? 'null'}&quot;</div>
            <div>x-gateway-matched-prefix: &quot;{latest.matchedPrefix ?? 'null'}&quot;</div>
            <div>x-gateway-upstream-port: &quot;{latest.upstreamPort ?? 'null'}&quot;</div>
            {latest.body != null && (
              <div className="pt-1 text-zinc-400 whitespace-pre-wrap break-all">
                body: {JSON.stringify(latest.body)}
              </div>
            )}
          </div>
        )}
      </div>

      {results.length > 1 && (
        <div className="space-y-1 rounded border border-zinc-200 bg-zinc-50 p-3 text-[11px] dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="font-bold text-zinc-600 dark:text-zinc-400">최근 요청 로그</div>
          {results.slice(1).map((r, i) => (
            <div key={i} className="font-mono text-zinc-500">
              [{r.timestamp}] GET /api/{r.prefix} → {r.status} ({r.targetService ?? 'unrouted'})
            </div>
          ))}
        </div>
      )}

      <VerificationFooter latest={latest} />
    </div>
  )
}
