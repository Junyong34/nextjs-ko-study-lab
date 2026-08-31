'use client'

import React, { useState, useTransition } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import type { SerializablePayload } from '../types'
import { VerificationFooter } from './VerificationFooter'

interface SerializationViewerClientProps {
  payload: SerializablePayload
  serverAction: (input: string) => Promise<{ success: boolean; result: string }>
}

export function SerializationViewerClient({
  payload,
  serverAction,
}: SerializationViewerClientProps) {
  const [actionResult, setActionResult] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleCallAction = () => {
    startTransition(async () => {
      const res = await serverAction('직렬화 경계 통과 테스트')
      setActionResult(res.result)
    })
  }

  return (
    <div className="space-y-6">
      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="RSC Props 직렬화 인스펙터" className="space-y-4">
        {/* 1. 전달받은 직렬화 가능 Props 인스펙터 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <span>RSC 경계를 통과하여 수신된 직렬화 데이터 (Props Tree)</span>
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              직렬화 성공 (JSON-Compatible)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
            <div className="rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/60">
              <span className="text-[11px] font-semibold text-zinc-500">기본 원시값 (Primitives):</span>
              <div className="font-mono text-[11px] mt-1 space-y-0.5 text-zinc-800 dark:text-zinc-200">
                <div>• String: "{payload.primitiveString}"</div>
                <div>• Number: {payload.primitiveNumber}</div>
                <div>• Boolean: {payload.primitiveBoolean ? 'true' : 'false'}</div>
                <div>• Null: null</div>
              </div>
            </div>

            <div className="rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/60">
              <span className="text-[11px] font-semibold text-zinc-500">평탄한 객체 & 배열:</span>
              <div className="font-mono text-[11px] mt-1 space-y-0.5 text-zinc-800 dark:text-zinc-200">
                <div>• SKU: {payload.plainObject.sku} (재고: {payload.plainObject.stock}개)</div>
                <div>• 카테고리 태그: [{payload.arrayData.join(', ')}]</div>
                <div>• 날짜 문자열: {payload.dateString}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Server Action 함수 prop 실행 테스트 */}
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              'use server' 함수 Prop 전달 및 실행 테스트
            </span>
            <span className="font-mono text-[10px] text-zinc-400">
              Function Props 경계 통과
            </span>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            일반 서버 JS 함수는 RSC 경계를 넘어갈 수 없지만, <code className="font-mono text-[11px]">'use server'</code> 함수는 Action ID로 직렬화되어 Props로 정상 전달됩니다.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleCallAction}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-2xs transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
            >
              {isPending ? '서버 통신 중...' : '전달받은 Server Action Props 실행'}
            </button>

            {actionResult && (
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                [확인] {actionResult}
              </span>
            )}
          </div>
        </div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter actionResult={actionResult} />
    </div>
  )
}
