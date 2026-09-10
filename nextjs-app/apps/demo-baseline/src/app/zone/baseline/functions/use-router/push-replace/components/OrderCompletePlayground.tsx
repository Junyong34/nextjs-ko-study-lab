'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { recordNavigation } from '../lib/navigationLog'
import { PRODUCT, ROOT_PATH } from '../types'

export function OrderCompletePlayground() {
  const router = useRouter()
  const pathname = usePathname()
  const [historyLength, setHistoryLength] = useState<number | null>(null)

  useEffect(() => {
    setHistoryLength(window.history.length)
  }, [pathname])

  const handleContinueShopping = () => {
    recordNavigation('replace', pathname, ROOT_PATH)
    router.replace(ROOT_PATH)
  }

  const handleBack = () => {
    recordNavigation('back', pathname, ROOT_PATH)
    router.back()
  }

  return (
    <div className="space-y-4 rounded-lg border border-emerald-300 bg-emerald-50/40 p-4 shadow-xs dark:border-emerald-900/50 dark:bg-emerald-950/20 text-xs">
      <div className="border-b border-emerald-200 pb-2.5 dark:border-emerald-900/50">
        <h4 className="font-bold text-emerald-900 dark:text-emerald-200">주문이 완료되었습니다</h4>
        <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">
          {PRODUCT.name} · {PRODUCT.price.toLocaleString()}원 결제 완료
        </p>
      </div>

      <div className="rounded bg-white p-3 dark:bg-zinc-950 border border-emerald-200/80 dark:border-emerald-900/50 font-mono text-[11px] space-y-1">
        <div>
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">현재 URL(usePathname): </span>
          <span className="text-blue-600 dark:text-blue-300">{pathname}</span>
        </div>
        <div>
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">현재 window.history.length: </span>
          <span>{historyLength ?? '측정 중...'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleContinueShopping}
          className="rounded border border-emerald-300 bg-white p-2 text-left hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-zinc-950 cursor-pointer"
        >
          <div className="font-bold text-emerald-700 dark:text-emerald-300">계속 쇼핑하기</div>
          <div className="text-zinc-500 text-[11px]">router.replace(상품 상세) — 이 완료 화면을 히스토리에서 교체</div>
        </button>

        <button
          type="button"
          onClick={handleBack}
          className="rounded border border-zinc-200 bg-white p-2 text-left hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 cursor-pointer"
        >
          <div className="font-bold text-zinc-800 dark:text-zinc-200">이전 화면으로</div>
          <div className="text-zinc-500 text-[11px]">router.back() — 히스토리 스택의 직전 라우트로 복귀</div>
        </button>
      </div>
      <p className="text-zinc-500 text-[11px] leading-relaxed">
        두 버튼 모두 상품 상세 화면으로 돌아가지만 <code>history.length</code>에 남기는 흔적이 다릅니다.{' '}
        <code>replace</code>는 이 완료 화면 엔트리 자체를 지우고, <code>back</code>은 엔트리를 지우지 않고 포인터만
        이전으로 옮깁니다. 도착한 상품 상세 화면의 검증 패널에서 실제 변화를 비교해 보세요.
      </p>
    </div>
  )
}
