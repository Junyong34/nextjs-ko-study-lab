'use client'
import React, { useState } from 'react'

export function ForbiddenTriggerDemo() {
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer')
  const [accessAttempt, setAccessAttempt] = useState(false)

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">스토어 관리자 정산/매출 대시보드 (/admin/settlements)</h4>
          <p className="text-xs text-zinc-500">현재 로그인된 세션의 권한에 따라 forbidden.tsx가 403을 렌더링합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">로그인 역할:</span>
          <button
            onClick={() => { setUserRole('customer'); setAccessAttempt(false); }}
            className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              userRole === 'customer' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            일반 고객 (CUSTOMER)
          </button>
          <button
            onClick={() => { setUserRole('admin'); setAccessAttempt(false); }}
            className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              userRole === 'admin' ? 'bg-purple-600 text-white' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            스토어 관리자 (ADMIN)
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setAccessAttempt(true)}
          className="rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
        >
          정산 관리자 페이지 접근 시도
        </button>
      </div>

      {accessAttempt && (
        userRole === 'customer' ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs dark:border-red-900/50 dark:bg-red-950/20">
            <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400">
              <span className="rounded bg-red-600 px-2 py-0.5 text-white">403 Forbidden</span>
              접근 권한이 없습니다 (forbidden.tsx 활성)
            </div>
            <p className="mt-1 text-red-600 dark:text-red-300">스토어 입점사 관리자 전용 정산 화면입니다. 일반 고객 계정으로는 열람할 수 없습니다.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-white">200 OK</span>
              정산 데이터 접근 성공
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 font-mono">
              <div className="rounded bg-white p-2 border dark:bg-zinc-900">당월 총 매출: ₩128,450,000</div>
              <div className="rounded bg-white p-2 border dark:bg-zinc-900">정산 예정액: ₩115,605,000</div>
              <div className="rounded bg-white p-2 border dark:bg-zinc-900">미결 주문: 14건</div>
            </div>
          </div>
        )
      )}
    </div>
  )
}
