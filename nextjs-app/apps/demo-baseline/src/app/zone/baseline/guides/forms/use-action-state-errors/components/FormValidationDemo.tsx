'use client'
import React, { useState } from 'react'

export function FormValidationDemo() {
  const [email, setEmail] = useState('invalid-email')
  const [error, setError] = useState('올바른 이메일 형식을 입력하세요.')
  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.includes('@')) setError('')
    else setError('올바른 이메일 형식을 입력하세요.')
  }
  return (
    <form onSubmit={handleValidate} className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">이메일 주소</label>
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
        {error && <span className="text-[11px] font-bold text-rose-500 mt-1 block">{error}</span>}
      </div>
      <button type="submit" className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        검증 실행
      </button>
    </form>
  )
}
