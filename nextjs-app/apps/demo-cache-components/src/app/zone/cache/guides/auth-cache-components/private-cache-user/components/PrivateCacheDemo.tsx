'use client'
import React, { useState } from 'react'
export function PrivateCacheDemo() {
  const [user, setUser] = useState('user_A')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setUser('user_A')} className={`rounded px-3 py-1 font-bold ${user === 'user_A' ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>사용자 A</button>
        <button type="button" onClick={() => setUser('user_B')} className={`rounded px-3 py-1 font-bold ${user === 'user_B' ? 'bg-purple-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>사용자 B</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 font-mono">
        캐시 격리 키: private:session:{user} -&gt; 장바구니 {user === 'user_A' ? '3개' : '1개'} 캐시됨
      </div>
    </div>
  )
}
