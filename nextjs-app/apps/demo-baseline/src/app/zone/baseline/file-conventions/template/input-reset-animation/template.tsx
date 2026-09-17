'use client'
import React, { useEffect, useRef } from 'react'
import { recordAnimationEvent, recordTemplateMount, recordTemplateUnmount, useInputResetState } from './hooks/useInputResetStore'

export default function InputResetTemplate({ children }: { children: React.ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { templateMountCount, templateMountedAt } = useInputResetState()

  useEffect(() => {
    recordTemplateMount()
    return () => {
      // 실제 uncontrolled input의 DOM 값을 언마운트 직전에 그대로 읽어 기록한다.
      recordTemplateUnmount(inputRef.current?.value ?? '')
    }
  }, [])

  return (
    <div
      onAnimationStart={() => recordAnimationEvent('start')}
      onAnimationEnd={() => recordAnimationEvent('end')}
      className="ira-template-entry space-y-3 rounded-lg border-2 border-purple-500/40 bg-purple-50/20 p-4 dark:border-purple-900/50 dark:bg-purple-950/20"
    >
      <style>{`
        @keyframes ira-slide-fade-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ira-template-entry {
          animation: ira-slide-fade-in 360ms ease-out;
        }
      `}</style>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200 pb-2 dark:border-purple-900">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
            template.tsx (진입마다 새 인스턴스 · CSS 진입 애니메이션 재생 · 입력값 리셋)
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-purple-100 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            template 마운트 횟수: {templateMountCount || '집계 중...'}
          </span>
          <span className="rounded bg-purple-100 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            이번 마운트 시각: {templateMountedAt || '마운트 중...'}
          </span>
          <input
            ref={inputRef}
            type="text"
            defaultValue=""
            placeholder="예: 이 사이즈 재고 있나요? (이동하면 비워짐)"
            className="w-72 rounded border border-purple-300 bg-white px-2 py-1 text-xs font-medium dark:bg-zinc-900 dark:border-purple-800"
          />
        </div>
      </div>
      {children}
    </div>
  )
}
