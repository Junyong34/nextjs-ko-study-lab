'use client'
import React, { useState } from 'react'
export function ScriptPgSdkOnloadDemo() {
  const [status, setStatus] = useState('onLoad 대기 중')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">SDK 상태: {status}</div>
      <button type="button" onClick={() => setStatus('[확인] 결제 SDK 로드 성공 및 결제 버튼 활성화')} className="rounded bg-emerald-600 px-3 py-1 font-bold text-white cursor-pointer">
        onLoad 이벤트 발생 시뮬레이션
      </button>
    </div>
  )
}
