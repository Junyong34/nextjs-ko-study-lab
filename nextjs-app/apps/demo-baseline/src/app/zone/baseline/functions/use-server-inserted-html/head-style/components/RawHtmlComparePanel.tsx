'use client'

import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import type { RegistryComparisonResult, RegistryProbeResult } from '../types'

const WITH_HOOK_PATH = '/zone/baseline/functions/use-server-inserted-html/head-style/with-hook'
const WITHOUT_HOOK_PATH = '/zone/baseline/functions/use-server-inserted-html/head-style/without-hook'

function ProbeColumn({ result, label }: { result: RegistryProbeResult; label: string }) {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{label}</span>
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
            result.headInjectionFound
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          head 삽입 {result.headInjectionFound ? 'O' : 'X'}
        </span>
      </div>
      <div className="text-[11px] font-mono text-zinc-500">
        HTTP {result.status} · data-demo-registry 태그 {result.styleTagCount}개 · body 인라인 삽입{' '}
        {result.bodyInjectionFound ? 'O (스트리밍 2차 플러시)' : 'X'}
      </div>
      <pre className="whitespace-pre-wrap break-all rounded bg-zinc-950 p-2 text-[10px] leading-relaxed text-zinc-300">
        {result.headSnippet}
      </pre>
      <div className="text-[10px] font-semibold text-zinc-500">두 번째 플러시(body 인라인) 구간</div>
      <pre className="whitespace-pre-wrap break-all rounded bg-zinc-950 p-2 text-[10px] leading-relaxed text-zinc-300">
        {result.bodySnippet}
      </pre>
    </div>
  )
}

export interface RawHtmlComparePanelProps {
  result: RegistryComparisonResult | null
  isPending: boolean
  onCompare: () => void
  onReset: () => void
}

export function RawHtmlComparePanel({ result, isPending, onCompare, onReset }: RawHtmlComparePanelProps) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">실제 SSR 원본 응답 대조</h4>
          <p className="text-xs text-zinc-500">
            아래 두 라우트는 동일한 컴포넌트 트리를 렌더링하되, 훅 호출 여부만 다릅니다.
          </p>
        </div>
        <DemoResetButton onReset={onReset} label="결과 초기화" loadingLabel="초기화 중..." />
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <a
          href={WITH_HOOK_PATH}
          target="_blank"
          rel="noreferrer"
          className="rounded bg-blue-600 px-3 py-1.5 font-bold text-white hover:bg-blue-700"
        >
          with-hook 라우트 새 탭에서 열기
        </a>
        <a
          href={WITHOUT_HOOK_PATH}
          target="_blank"
          rel="noreferrer"
          className="rounded bg-zinc-700 px-3 py-1.5 font-bold text-white hover:bg-zinc-800"
        >
          without-hook 라우트 새 탭에서 열기
        </a>
        <button
          type="button"
          onClick={onCompare}
          disabled={isPending}
          className="ml-auto rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isPending ? '두 라우트 실제 요청 중... (약 0.7초 지연 포함)' : '두 라우트 실제 SSR 응답 비교'}
        </button>
      </div>

      {result ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ProbeColumn result={result.withHook} label="with-hook (훅 사용)" />
          <ProbeColumn result={result.withoutHook} label="without-hook (훅 미사용)" />
        </div>
      ) : (
        <p className="text-xs text-zinc-500">
          버튼을 누르면 Node http 클라이언트가 두 라우트에 실제 요청을 보내고, 받은 원본 HTML을 그대로
          분석합니다 (브라우저 fetch가 아니라 서버 측 저수준 요청이라 하이드레이션 영향을 받지 않습니다).
        </p>
      )}
    </div>
  )
}
