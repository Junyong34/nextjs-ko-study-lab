'use client'
import React, { useEffect, useState, useTransition } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { probeRedirectAction } from '../actions'
import { LEGACY_PRODUCTS, type ProbeKind, type ProbeResult } from '../types'
import { VerificationFooter } from './VerificationFooter'

const DEMO_BASE = '/zone/baseline/functions/permanent-redirect/seo-308'

const CASES: { kind: ProbeKind; label: string; badge: string; path: string; accent: string }[] = [
  {
    kind: 'permanent',
    label: '영구 URL 개편 (permanentRedirect)',
    badge: '기대: 308',
    path: `${DEMO_BASE}/legacy/items`,
    accent: 'border-emerald-300 dark:border-emerald-800/70',
  },
  {
    kind: 'temporary',
    label: '주말 한정 프로모션 (redirect)',
    badge: '기대: 307',
    path: `${DEMO_BASE}/legacy/promo`,
    accent: 'border-amber-300 dark:border-amber-800/70',
  },
]

export function PermanentRedirectSeoDemo() {
  const [selectedLegacyId, setSelectedLegacyId] = useState(LEGACY_PRODUCTS[0].legacyId)
  const [probes, setProbes] = useState<Partial<Record<ProbeKind, ProbeResult>>>({})
  const [pendingKind, setPendingKind] = useState<ProbeKind | null>(null)
  const [isPending, startTransition] = useTransition()

  // curl 예시의 origin은 SSR 시점엔 알 수 없으므로, 마운트 이후에만 채워 서버/클라이언트 렌더 결과를 일치시킨다
  // (hydration mismatch 방지 — `typeof window !== 'undefined'`를 렌더 분기에 직접 쓰면 안 된다).
  const [origin, setOrigin] = useState('')
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const runProbe = (kind: ProbeKind) => {
    setPendingKind(kind)
    startTransition(async () => {
      const result = await probeRedirectAction(kind, selectedLegacyId)
      setProbes((prev) => ({ ...prev, [kind]: result }))
      setPendingKind(null)
    })
  }

  const handleReset = () => {
    setSelectedLegacyId(LEGACY_PRODUCTS[0].legacyId)
    setProbes({})
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">레거시 상품 URL 마이그레이션 콘솔</h4>
          <p className="text-xs text-zinc-500">구형 숫자 ID URL이 어떤 방식으로 신규 URL로 이전되는지 실제 HTTP 응답으로 확인합니다.</p>
        </div>
        <DemoResetButton onReset={handleReset} label="실습 초기화" />
      </div>

      <div className="flex gap-2">
        {LEGACY_PRODUCTS.map((item) => (
          <button
            key={item.legacyId}
            type="button"
            onClick={() => {
              setSelectedLegacyId(item.legacyId)
              setProbes({})
            }}
            className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              selectedLegacyId === item.legacyId
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            /legacy/items/{item.legacyId} ({item.name})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CASES.map((demoCase) => {
          const probe = probes[demoCase.kind]
          const requestUrl = `${demoCase.path}/${selectedLegacyId}`
          const isLoading = isPending && pendingKind === demoCase.kind

          return (
            <div
              key={demoCase.kind}
              className={`space-y-2.5 rounded border bg-zinc-50 p-3.5 dark:bg-zinc-900/50 ${demoCase.accent}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{demoCase.label}</span>
                <span className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] font-mono dark:bg-zinc-800">
                  {demoCase.badge}
                </span>
              </div>

              <div className="font-mono text-[11px] text-zinc-500 break-all">GET {requestUrl}</div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => runProbe(demoCase.kind)}
                  disabled={isLoading}
                  className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
                >
                  {isLoading ? '실제 상태 코드 측정 중...' : '실제 상태 코드 측정'}
                </button>
                <a
                  href={requestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  새 탭에서 직접 이동
                </a>
              </div>

              {probe && (
                <div className="rounded border border-zinc-300 bg-white p-2 font-mono text-[11px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                  HTTP {probe.status} {probe.statusText}
                  <br />
                  location: {probe.location ?? '(없음)'}
                </div>
              )}

              <div className="text-[10px] text-zinc-400">
                curl -I {origin}
                {requestUrl}
              </div>
            </div>
          )
        })}
      </div>

      <VerificationFooter probes={probes} />
    </div>
  )
}
