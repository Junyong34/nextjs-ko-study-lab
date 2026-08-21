'use client'

import React from 'react'

export default function AuthLoginPage() {
  return (
    <div className="space-y-2">
      <div className="text-center mb-3">
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          회원 로그인 (URL: /login)
        </h3>
        <p className="text-[11px] text-zinc-500">
          (auth) 그룹의 독립 레이아웃(GNB가 생략된 중앙 집중형 카드)이 입혀진 화면입니다.
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
        <div>
          <label className="block text-[11px] text-zinc-600 dark:text-zinc-400">
            아이디
          </label>
          <input
            type="text"
            readOnly
            value="user@example.com"
            className="w-full rounded border border-zinc-300 bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          />
        </div>
        <div>
          <label className="block text-[11px] text-zinc-600 dark:text-zinc-400">
            비밀번호
          </label>
          <input
            type="password"
            readOnly
            value="********"
            className="w-full rounded border border-zinc-300 bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          />
        </div>
        <button
          type="button"
          className="w-full rounded bg-zinc-900 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          로그인
        </button>
      </form>
    </div>
  )
}
