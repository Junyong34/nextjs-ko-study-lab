'use client'
import React, { useState, useTransition } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { expireSessionAction } from '../actions'

export function RedirectSessionDemo() {
  const [target, setTarget] = useState('결제 진행 중')
  const [isPending, startTransition] = useTransition()

  const handleExpire = () => {
    setTarget('세션 만료 처리 중 -> redirect() 호출 예정')
    startTransition(async () => {
      await expireSessionAction()
      // redirect()가 성공하면 브라우저가 로그인 화면으로 이동하므로 이 아래 코드는 실행되지 않는다.
    })
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">현재 상태: {target}</div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleExpire}
          disabled={isPending}
          className="rounded bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
        >
          세션 만료 시뮬레이션
        </button>
        <DemoResetButton disabled={isPending} />
      </div>
      <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        클릭하면 이 화면을 벗어나 실제로 로그인 화면으로 이동합니다. 개발자 도구 Network 탭에서 이 버튼이 보낸
        요청의 응답 헤더(<code>x-action-redirect</code>)를 확인해 보세요.
      </p>
    </div>
  )
}
