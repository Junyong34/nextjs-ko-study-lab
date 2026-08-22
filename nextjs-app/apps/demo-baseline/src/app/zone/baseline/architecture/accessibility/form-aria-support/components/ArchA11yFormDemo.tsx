'use client'
import React, { useState } from 'react'

export function ArchA11yFormDemo() {
  const [error, setError] = useState('카드 번호 16자리를 입력해주세요.')

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div>
        <label htmlFor="card-input" className="block font-semibold text-zinc-700 dark:text-zinc-300">신용카드 번호:</label>
        <input id="card-input" type="text" aria-invalid="true" aria-describedby="card-error" placeholder="1234-5678-9012-3456" className="mt-1 w-full rounded border border-rose-400 p-2 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100" />
        <div id="card-error" role="alert" className="mt-1 text-rose-500 font-bold font-mono">[주의]️ {error}</div>
      </div>
    </div>
  )
}
