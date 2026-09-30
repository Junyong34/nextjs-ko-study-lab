'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import type { TaintCaseId, TaintCaseResult, TaintDemoState } from '../types'

const CASES: { id: TaintCaseId; label: string; code: string }[] = [
  { id: 'safe', label: '① 마스킹 값 반환', code: '{ merchantId, maskedKey }' },
  { id: 'object', label: '② config 객체 반환', code: 'return config // taintObjectReference' },
  { id: 'value', label: '③ secretKey 문자열 반환', code: 'return { value: config.secretKey } // taintUniqueValue' },
  { id: 'derived', label: '④ 문자열로 가공해 반환', code: 'return { value: `key=${config.secretKey}` }' },
]

function statusOf(r: TaintCaseResult): { text: string; ok: boolean } {
  if (r.blocked) return { text: '차단됨 — React가 직렬화 중 예외를 던짐', ok: true }
  if (r.secretLeaked) return { text: '차단되지 않음 — 응답에 시크릿 원문 포함', ok: false }
  return { text: '통과 — 응답에 시크릿 원문 없음', ok: true }
}

interface Props {
  state: TaintDemoState
  isPending: boolean
  onRun: (id: TaintCaseId) => void
  onReset: () => void
}

export function ReactTaintDemo({ state, isPending, onRun, onReset }: Props) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">결제 시크릿 보호 콘솔</h4>
          <p className="text-xs text-zinc-500">
            서버의 <code>getPaymentConfig()</code>는 config 객체와 <code>secretKey</code>를 모두 taint합니다. 네 가지 반환 방식을 눌러 결과를 비교하세요.
          </p>
        </div>
        <DemoResetButton onReset={onReset} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CASES.map(({ id, label, code }) => {
          const r = state[id]
          const s = r ? statusOf(r) : null
          return (
            <div key={id} className="space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800">
              <button
                onClick={() => onRun(id)}
                disabled={isPending}
                className="w-full cursor-pointer rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {label}
              </button>
              <code className="block break-all text-[11px] text-zinc-500">{code}</code>
              {r && s ? (
                <div className="space-y-1 rounded bg-zinc-950 p-2 font-mono text-[11px]">
                  <div className={s.ok ? 'font-bold text-emerald-400' : 'font-bold text-red-400'}>{s.text}</div>
                  <div className="whitespace-pre-wrap break-all text-zinc-400">{r.message}</div>
                  <div className="text-zinc-500">[{r.timestamp}]</div>
                </div>
              ) : (
                <div className="text-[11px] text-zinc-400">대기 중</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
