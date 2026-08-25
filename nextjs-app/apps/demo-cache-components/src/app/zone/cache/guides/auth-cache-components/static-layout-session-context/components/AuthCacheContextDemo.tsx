'use client'

import React, { useState } from 'react'

interface UserSession {
  name: string
  tier: string
  cartCount: number
  isLoggedIn: boolean
}

export function AuthCacheContextDemo() {
  const [session, setSession] = useState<UserSession>({
    name: '홍길동 고객님',
    tier: 'VIP 골드',
    cartCount: 3,
    isLoggedIn: true,
  })

  const toggleSession = () => {
    if (!session.isLoggedIn) {
      setSession({
        name: '홍길동 고객님',
        tier: 'VIP 골드',
        cartCount: 3,
        isLoggedIn: true,
      })
    } else if (session.tier === 'VIP 골드') {
      setSession({
        name: '김철수 고객님',
        tier: '일반 회원',
        cartCount: 1,
        isLoggedIn: true,
      })
    } else {
      setSession({
        name: '게스트 (비회원)',
        tier: '미인증',
        cartCount: 0,
        isLoggedIn: false,
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* 1. 상단 컨트롤 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-xs">
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">클라이언트 세션 상태: </span>
          <strong className="text-zinc-900 dark:text-zinc-100">{session.name}</strong> ({session.tier})
        </div>

        <button
          type="button"
          onClick={toggleSession}
          className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
        >
          로그인 상태 변경
        </button>
      </div>

      {/* 2. 하이브리드 캐시 vs 세션 슬롯 대조 그리드 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* 정적 캐시 셸 */}
        <div className="rounded-lg border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
              1. 공통 상품 레이아웃 ('use cache')
            </span>
            <span className="rounded bg-emerald-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
              0ms Static
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            모든 사용자에게 0ms로 서빙되는 캐시된 글로벌 GNB 헤더 및 상품 스펙 레이아웃입니다.
          </p>
          <div className="rounded bg-white p-2.5 font-mono text-[11px] text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 border border-emerald-200 dark:border-emerald-900">
            • 카탈로그 ID: CAT-GLOBAL-2026<br />
            • 렌더 모드: Shared Static Cache
          </div>
        </div>

        {/* 클라이언트 개인화 세션 슬롯 */}
        <div className="rounded-lg border border-blue-300 bg-blue-50/50 p-4 dark:border-blue-950 dark:bg-blue-950/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-950 dark:text-blue-200">
              2. 개인화 세션 슬롯 (Client Context)
            </span>
            <span className="rounded bg-blue-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-900 dark:bg-blue-900 dark:text-blue-200">
              Client Hydrated
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            정적 캐시 셸 내부에 클라이언트 Context를 통해 안전하게 주입된 사용자 전용 상태입니다.
          </p>
          <div className="rounded bg-white p-2.5 font-mono text-[11px] text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 border border-blue-200 dark:border-blue-900">
            • 프로필: {session.name} ({session.tier})<br />
            • 장바구니: {session.cartCount}개 담김
          </div>
        </div>
      </div>
    </div>
  )
}
