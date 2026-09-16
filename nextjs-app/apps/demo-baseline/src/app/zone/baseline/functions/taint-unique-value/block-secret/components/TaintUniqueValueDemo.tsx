'use client'
import React from 'react'
import type { TaintDemoState } from '../types'

export function TaintUniqueValueDemo({
  state,
  isPending,
  onTaintedAttempt,
  onUntaintedAttempt,
}: {
  state: TaintDemoState
  isPending: boolean
  onTaintedAttempt: () => void
  onUntaintedAttempt: () => void
}) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">PayHub 결제 게이트웨이 시크릿 관리 콘솔</h4>
        <p className="text-xs text-zinc-500">
          <code>pgSecretKey</code>는 <code>experimental_taintUniqueValue</code>로 보호되어 있고, <code>legacyWebhookSecret</code>은
          taint를 걸지 않은 대조군입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded border border-red-200 bg-red-50/50 p-3.5 dark:border-red-900/40 dark:bg-red-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-700 dark:text-red-400">taint 적용 — pgSecretKey</span>
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-mono text-red-700 dark:bg-red-900/50 dark:text-red-300">
              protected
            </span>
          </div>
          <button
            onClick={onTaintedAttempt}
            disabled={isPending}
            className="w-full rounded bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
          >
            taint 적용 PG 시크릿 키 전달 시도 →
          </button>
          {state.tainted && (
            <div
              className={`rounded border p-2.5 font-mono text-[11px] leading-relaxed ${
                state.tainted.blocked
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-300'
                  : 'border-red-400 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300'
              }`}
            >
              <div className="font-bold">
                {state.tainted.blocked ? 'React 런타임 에러로 차단됨' : '경고: 원문이 그대로 반환됨'}
              </div>
              <div className="mt-1 whitespace-pre-wrap">{state.tainted.message}</div>
              <div className="mt-1 text-zinc-500">[{state.tainted.timestamp}]</div>
            </div>
          )}
        </div>

        <div className="space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">taint 미적용 — legacyWebhookSecret</span>
            <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-mono text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              unprotected
            </span>
          </div>
          <button
            onClick={onUntaintedAttempt}
            disabled={isPending}
            className="w-full rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
          >
            taint 미적용 레거시 웹훅 시크릿 전달 시도 →
          </button>
          {state.untainted && (
            <div className="rounded border border-amber-300 bg-amber-50 p-2.5 font-mono text-[11px] leading-relaxed text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-300">
              <div className="font-bold">차단되지 않고 클라이언트에 그대로 노출됨</div>
              <div className="mt-1 whitespace-pre-wrap">{state.untainted.message}</div>
              {state.untainted.revealedSecret && (
                <div className="mt-1.5 rounded bg-white/70 px-2 py-1 text-amber-950 dark:bg-black/30 dark:text-amber-200">
                  노출된 원문: <code>{state.untainted.revealedSecret}</code>
                </div>
              )}
              <div className="mt-1 text-zinc-500">[{state.untainted.timestamp}]</div>
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-zinc-500">
        두 버튼 모두 Server Action을 실제로 호출합니다. 브라우저 DevTools의 Network 탭에서 각 요청/응답 payload를 직접 열어
        원문 시크릿이 실제로 포함되는지(또는 되지 않는지) 확인할 수 있습니다.
      </p>
    </div>
  )
}
