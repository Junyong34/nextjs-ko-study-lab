'use client'
import React, { useState } from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'

export function NavigationClientDemo() {
  const [currentVirtualUrl, setCurrentVirtualUrl] = useState('/shop/products')
  const [historyStack, setHistoryStack] = useState<string[]>(['/shop/products'])
  const [cartItemsCount, setCartItemsCount] = useState(2)

  const handlePush = (target: string) => {
    setCurrentVirtualUrl(target)
    setHistoryStack(prev => [...prev, target])
  }

  const handleReplace = (target: string) => {
    setCurrentVirtualUrl(target)
    setHistoryStack(prev => [...prev.slice(0, -1), target])
  }

  const handleBack = () => {
    if (historyStack.length > 1) {
      const next = historyStack.slice(0, -1)
      setHistoryStack(next)
      setCurrentVirtualUrl(next[next.length - 1])
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">useRouter 프로그래밍 네비게이션 시뮬레이터</h4>
          <p className="text-zinc-500 text-[11px]">router.push vs router.replace vs router.back의 쇼핑몰 화면 전환 동작을 대조합니다.</p>
        </div>
        <div className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-950 dark:text-blue-300">
          현재 경로: {currentVirtualUrl}
        </div>
      </div>

      {/* 시나리오 버튼들 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handlePush('/shop/products/prod-001')}
          className="rounded border border-zinc-200 bg-zinc-50 p-2 text-left hover:border-blue-500 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
        >
          <div className="font-bold text-blue-600">1. router.push(상세)</div>
          <div className="text-zinc-500 text-[11px]">히스토리 추가하며 상품 상세로 이동</div>
        </button>

        <button
          type="button"
          onClick={() => handleReplace('/shop/checkout/success')}
          className="rounded border border-zinc-200 bg-zinc-50 p-2 text-left hover:border-emerald-500 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
        >
          <div className="font-bold text-emerald-600">2. router.replace(결제완료)</div>
          <div className="text-zinc-500 text-[11px]">뒤로가기 방지하며 완료 페이지 대체</div>
        </button>

        <button
          type="button"
          onClick={handleBack}
          disabled={historyStack.length <= 1}
          className="rounded border border-zinc-200 bg-zinc-50 p-2 text-left hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 disabled:opacity-40 cursor-pointer"
        >
          <div className="font-bold text-zinc-800 dark:text-zinc-200">3. router.back()</div>
          <div className="text-zinc-500 text-[11px]">이전 탐색 화면으로 되돌아가기</div>
        </button>
      </div>

      {/* 브라우저 히스토리 스택 뷰 */}
      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 font-mono">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">브라우저 히스토리 스택 ({historyStack.length}단계):</span>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {historyStack.map((url, idx) => (
            <span
              key={idx}
              className={`rounded px-2 py-0.5 text-[11px] ${
                idx === historyStack.length - 1
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {idx + 1}. {url}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
