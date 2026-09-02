'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { usePrefetch } from './PrefetchContext'

const BASE_URL = '/zone/baseline/linking-and-navigating/router-prefetch'
const DEALS_URL = `${BASE_URL}/deals`
const VIP_URL = `${BASE_URL}/vip`

export function PrefetchController() {
  const router = useRouter()
  const pathname = usePathname()
  const prefetchCtx = usePrefetch()

  const isPrefetched = prefetchCtx?.isPrefetched ?? false
  const setIsPrefetched = prefetchCtx?.setIsPrefetched ?? (() => {})
  const prefetchTime = prefetchCtx?.prefetchTime ?? null
  const setPrefetchTime = prefetchCtx?.setPrefetchTime ?? (() => {})
  const lastAction = prefetchCtx?.lastAction ?? '대기 중'
  const setLastAction = prefetchCtx?.setLastAction ?? (() => {})

  const handlePrefetchDeals = () => {
    router.prefetch(DEALS_URL)
    setIsPrefetched(true)
    const time = new Date().toLocaleTimeString('ko-KR')
    setPrefetchTime(time)
    setLastAction(`특가 상품 페이지(/deals) 백그라운드 prefetch 완료 (${time})`)
  }

  const handleGoDeals = () => {
    setLastAction('router.push(/deals) 실행 -> 미리 로드한 페이지로 전환')
    router.push(DEALS_URL)
  }

  const handleGoVip = () => {
    setLastAction('router.push(/vip) 실행 (prefetch 없음)')
    router.push(VIP_URL)
  }

  const handleGoHome = () => {
    setLastAction('홈 대시보드로 이동')
    router.push(BASE_URL)
  }

  return (
    <div className="space-y-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/90 p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs">
      {/* 상태 표시 바 */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs shadow-2xs dark:border-zinc-700 dark:bg-zinc-950">
        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-400">Current URL:</span>
          <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">
            {pathname.replace(BASE_URL, '') || '/ (대시보드)'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500 font-medium">특가 페이지(/deals) prefetch:</span>
          {isPrefetched ? (
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              사전 로드됨 ({prefetchTime})
            </span>
          ) : (
            <span className="rounded-md bg-zinc-200 px-2 py-0.5 font-mono text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              미완료
            </span>
          )}
        </div>
      </div>

      {/* 조작 버튼 그룹 */}
      <div className="flex flex-wrap gap-2.5 pt-1">
        {/* 1. router.prefetch 버튼 */}
        <button
          type="button"
          onClick={handlePrefetchDeals}
          disabled={isPrefetched}
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-amber-700 disabled:opacity-50 cursor-pointer"
        >
          <span>1. 특가 상품 백그라운드 prefetch</span>
          <span className="rounded bg-amber-800 px-1.5 py-0.5 font-mono text-[10px] text-amber-200">
            router.prefetch()
          </span>
        </button>

        {/* 2. router.push (deals) 버튼 */}
        <button
          type="button"
          onClick={handleGoDeals}
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          <span>2. 특가 상품으로 이동</span>
          <span className="rounded bg-zinc-700 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300 dark:bg-zinc-300 dark:text-zinc-800">
            router.push('/deals')
          </span>
        </button>

        {/* 3. router.push (vip) 버튼 */}
        <button
          type="button"
          onClick={handleGoVip}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
        >
          <span>3. VIP 라운지 이동 (prefetch 없음)</span>
          <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
            router.push('/vip')
          </span>
        </button>

        {/* 4. 홈 복귀 */}
        <button
          type="button"
          onClick={handleGoHome}
          className="inline-flex items-center rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
        >
          대시보드 복귀
        </button>
      </div>

      <div className="text-[11px] text-zinc-500 font-mono">
        • 최근 실행 액션: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lastAction}</span>
      </div>

      {/* 개발자도구 네트워크 탭 확인 안내 팁 (한쪽 구석 안내 박스) */}
      <div className="flex items-start gap-2 rounded-xl bg-zinc-100/90 p-3 text-[11px] leading-relaxed text-zinc-600 dark:bg-zinc-800/70 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
        <span className="font-bold text-zinc-800 dark:text-zinc-200 shrink-0">🌐 네트워크 탭 팁:</span>
        <span>
          프로덕션 모드(<code>pnpm start</code>)에서 <strong>1번 prefetch 버튼</strong>을 클릭하면 브라우저 개발자도구(F12) <strong>네트워크(Network) 탭</strong>에서 대상 페이지의 <code>.rsc</code> 페이로드와 JS 번들이 백그라운드로 미리 다운로드되는 것을 직접 확인하실 수 있습니다. (개발 모드에서는 불필요한 서버 부하 방지를 위해 네트워크 요청이 생략됩니다.)
        </span>
      </div>
    </div>
  )
}
