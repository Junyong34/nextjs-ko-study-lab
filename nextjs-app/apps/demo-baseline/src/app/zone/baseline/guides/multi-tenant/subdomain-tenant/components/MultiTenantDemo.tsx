'use client'
import React, { useState } from 'react'
export function MultiTenantDemo() {
  const [tenant, setTenant] = useState('brand-a')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setTenant('brand-a')} className={`rounded px-3 py-1 font-bold ${tenant === 'brand-a' ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>테넌트 A (블루 테마)</button>
        <button type="button" onClick={() => setTenant('brand-b')} className={`rounded px-3 py-1 font-bold ${tenant === 'brand-b' ? 'bg-purple-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>테넌트 B (퍼플 테마)</button>
      </div>
      <div className={`rounded p-4 text-xs font-bold ${tenant === 'brand-a' ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200' : 'bg-purple-50 text-purple-900 dark:bg-purple-950/40 dark:text-purple-200'}`}>
         {tenant === 'brand-a' ? 'Brand A 프리미엄 공식 스토어' : 'Brand B 트렌디 셀렉트 샵'}
      </div>
    </div>
  )
}
