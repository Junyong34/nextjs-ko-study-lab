'use client'

import React, { useState, useTransition } from 'react'
import { DemoContainer, ExpectedActualPanel, DemoResetButton } from '@study/ui'
import { addItem, resetItems, type DemoItem } from './actions'

export default function ServerActionsBasicDemoPage() {
  const [items, setItems] = useState<DemoItem[]>([])
  const [inputText, setInputText] = useState('')
  const [statusMessage, setStatusMessage] = useState<string>(
    '대기 중 (폼에 텍스트를 입력하고 추가 버튼을 누르세요)',
  )
  const [isPending, startTransition] = useTransition()

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputText.trim() || isPending) return

    const formData = new FormData()
    formData.append('itemText', inputText.trim())

    startTransition(async () => {
      try {
        const result = await addItem(formData)
        if (result.success) {
          setItems(result.items)
          setInputText('')
          setStatusMessage(
            `Server Action 호출 성공! 서버 상태가 갱신되었습니다. (총 ${result.items.length}개)`,
          )
        } else if (result.error) {
          setStatusMessage(`오류: ${result.error}`)
        }
      } catch (error) {
        setStatusMessage(
          `Server Action 오류: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    })
  }

  const handleReset = async () => {
    startTransition(async () => {
      const result = await resetItems()
      setItems(result.items)
      setInputText('')
      setStatusMessage('상태가 초기화되었습니다.')
    })
  }

  const expectedText = 'Server Action을 통해 서버 상태가 갱신되고 항목이 즉시 반영됨'
  const actualText =
    items.length > 0
      ? `추가된 항목 ${items.length}개 (최근 항목: "${items[0]?.text}")`
      : '항목 없음 (초기 상태)'

  return (
    <DemoContainer className="space-y-4">
      {/* 데모 컨트롤 바 */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-zinc-200 bg-zinc-50/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Server Actions 기본 폼 처리 데모
            </span>
            <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              zone: baseline
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Next.js Server Action(`'use server'`)을 실행하여 서버 상태를 갱신하고 결과를 실시간 반영합니다.
          </p>
        </div>
        <DemoResetButton onReset={handleReset} label="상태 초기화" />
      </div>

      {/* 폼 인터랙션 */}
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          type="text"
          name="itemText"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="추가할 텍스트 입력 (예: Server Action 호출 테스트)"
          disabled={isPending}
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 shadow-xs placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
        <button
          type="submit"
          disabled={isPending || !inputText.trim()}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isPending ? '처리 중...' : '항목 추가'}
        </button>
      </form>

      {/* 기대값 vs 실제값 검증 패널 */}
      <ExpectedActualPanel
        expected={expectedText}
        actual={actualText}
        isMatched={items.length > 0}
        title="Server Actions 배관 검증"
        description={statusMessage}
      />

      {/* 동적 리스트: 항목이 추가될수록 높이가 길어짐 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <span>서버 등록 항목 리스트 ({items.length}개)</span>
          <span className="text-[11px] font-normal text-zinc-400">
            * 목록이 길어지면 ResizeObserver가 DEMO_RESIZE를 발생시킵니다.
          </span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-md border border-dashed border-zinc-300 p-8 text-center text-xs text-zinc-400 dark:border-zinc-700">
            아직 추가된 항목이 없습니다. 상단 폼에 텍스트를 입력하고 [항목 추가]를 눌러보세요.
          </div>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white shadow-xs dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
            {items.map((item, index) => (
              <li
                key={item.id}
                className="flex items-center justify-between px-3.5 py-2.5 text-xs text-zinc-800 dark:text-zinc-200"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-zinc-400">
                    #{items.length - index}
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {item.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span>생성: {item.createdAt}</span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Server Action
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DemoContainer>
  )
}
